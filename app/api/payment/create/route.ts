// app/api/payment/create/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    console.log("🔵 [Payment] Start creating payment (New Logic)...");

    // 1. ตรวจสอบสิทธิ์ (Auth Check)
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      console.error("❌ Unauthorized: No session found");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId } = await request.json();
    console.log(`👤 User: ${session.user.email} requesting Plan ID: ${planId}`);

    // 2. ดึงข้อมูล User และ Plan
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
        console.error("❌ User not found in DB");
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const plan = await prisma.pricingPlan.findUnique({ where: { id: planId } });
    if (!plan) {
        console.error("❌ Plan not found:", planId);
        return NextResponse.json({ error: 'ไม่พบแพ็กเกจที่เลือก' }, { status: 400 });
    }

    // 3. สร้าง Ref1
    const ref1 = `ORD-${user.id.substring(0, 5)}-${Date.now()}`;
    console.log("🔑 Generated Ref1:", ref1);

    // 4. เตรียม Payload (แบบที่คุณต้องการ)
    const payload = {
      method: "create",
      api_key: process.env.PAYNOI_API_KEY,
      amount: plan.price.toString(), // แปลงเป็น string เพื่อความชัวร์
      ref1: ref1,
      key_id: process.env.PAYNOI_KEY_ID,
      account: process.env.PAYNOI_ACCOUNT_NO,
      type: process.env.PAYNOI_ACCOUNT_TYPE
    };

    console.log("🚀 Payload to be sent:", JSON.stringify(payload, null, 2));
    console.log("🌐 Target URL: https://paynoi.com/ppay_api"); // เช็ค URL ว่าใช้ .com ตามที่คุณแก้มา

    // 5. ยิง API (ใส่ Try/Catch ย่อยเพื่อดัก Error DNS โดยเฉพาะ)
    let res;
    try {
        res = await fetch("https://paynoi.com/ppay_api", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    } catch (fetchError: any) {
        console.error("🔥 NETWORK/DNS ERROR:", fetchError);
        console.error("สาเหตุ: เครื่องหาโดเมน paynoi.com ไม่เจอ หรือเน็ตออกไม่ได้");
        throw new Error("Network connection failed: " + fetchError.message);
    }

    // 6. อ่าน Response
    const responseText = await res.text();
    console.log("📩 Raw Response from Paynoi:", responseText);

    let data;
    try {
        data = JSON.parse(responseText);
    } catch (e) {
        console.error("❌ Failed to parse JSON response");
        throw new Error("Invalid JSON response from Paynoi");
    }

    console.log("📦 Parsed Data:", data);

    if (data.status !== 1) {
      console.error("❌ Paynoi returned Error Status:", data.msg);
      return NextResponse.json({ error: 'สร้าง QR Code ไม่สำเร็จ: ' + data.msg }, { status: 500 });
    }

    // 7. บันทึก Transaction
    console.log("💾 Saving to Database...");
    await prisma.payment.create({
      data: {
        userId: user.id,
        amount: Number(data.amount || plan.price),
        ref1: ref1,
	ref2: planId,
        transId: data.trans_id,
        qrCode: data.qr_image_base64
      }
    });
    
    console.log("✅ Payment Created Successfully!");

    return NextResponse.json({ 
      qrCode: data.qr_image_base64,
      amount: data.amount,
      transId: data.trans_id,
      expireAt: data.expire_at
    });

  } catch (error: any) {
    console.error("❌ SERVER ERROR:", error);
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}
