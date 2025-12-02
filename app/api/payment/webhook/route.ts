// app/api/payment/webhook/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("💰 Webhook Raw Body:", body);

    // 1. รับค่าแบบยืดหยุ่น (เผื่อ Paynoi ส่งมาแบบไม่มี key 'data')
    // ถ้ามี body.data ให้ใช้ body.data ถ้าไม่มีให้ใช้ body ตรงๆ
    const data = body.data || body;

    // data ควรมี: status, ref1, payment_status, amount (ยอดเงิน)
    
    // 2. ตรวจสอบว่าจ่ายสำเร็จจริงไหม (Paynoi ใช้ status '1' หรือ payment_status 'completed')
    if (data.status !== "1" && data.payment_status !== "completed") {
        console.log("❌ Payment status is not completed:", data.status);
        return NextResponse.json({ status: 0, msg: "Status not completed" });
    }

    // 3. ค้นหา Payment ใน DB ของเราจาก ref1
    const payment = await prisma.payment.findUnique({
      where: { ref1: data.ref1 },
      include: { user: true }
    });

    if (!payment) {
        console.error("❌ Payment record not found for ref1:", data.ref1);
        return NextResponse.json({ status: 0, msg: "Payment not found" });
    }

    // 4. ถ้าสถานะยังไม่ Complete ให้ทำการอัปเกรด
    if (payment.status !== 'COMPLETED') {
        console.log(`✅ Payment found! User: ${payment.userId}, Amount: ${payment.amount}`);

        // --- Logic คำนวณวันใช้งาน (Smart Plan) ---
        // ไปดึง Plan ทั้งหมดมาเช็คว่ายอดเงินที่จ่าย ตรงกับ Plan ไหน
        const matchedPlan = await prisma.pricingPlan.findFirst({
            where: { price: Number(payment.amount) } // หา Plan ที่ราคาตรงกับยอดเงิน
        });

        // ถ้าเจอ Plan ให้ใช้วันจาก Plan นั้น, ถ้าไม่เจอ (เช่นปรับราคาแล้ว) ให้ Default 30 วัน
        const daysToAdd = matchedPlan ? matchedPlan.days : 30;
        
        // คำนวณวันหมดอายุ
        const newSubscriptionEnds = new Date();
        newSubscriptionEnds.setDate(newSubscriptionEnds.getDate() + daysToAdd);
        // ----------------------------------------

        // ใช้ Transaction เพื่อความชัวร์
        await prisma.$transaction([
            // 4.1 อัปเดตสถานะ Payment เป็นจ่ายแล้ว
            prisma.payment.update({
                where: { id: payment.id },
                data: { 
                    status: 'COMPLETED',
                    transId: data.trans_id || "PAYNOI_TX" // เก็บ Transaction ID จาก Paynoi
                }
            }),
            // 4.2 อัปเกรด User และเติมวัน
            prisma.user.update({
                where: { id: payment.userId },
                data: {
                    plan: 'PRO',
                    subscriptionEnds: newSubscriptionEnds
                }
            })
        ]);

        console.log(`🎉 User ${payment.userId} upgraded to PRO for ${daysToAdd} days!`);
    } else {
        console.log("⚠️ Payment already completed.");
    }

    // 5. ตอบกลับ Paynoi ว่าได้รับแล้ว
    return NextResponse.json({ status: 1 });

  } catch (error) {
    console.error("❌ Webhook Error:", error);
    // ต้องตอบ 200 หรือ json กลับไปเสมอ ไม่งั้น Paynoi จะส่งซ้ำ
    return NextResponse.json({ status: 0 });
  }
}
