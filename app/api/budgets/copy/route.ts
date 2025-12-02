// app/api/budgets/copy/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // รับ email มาเพื่อหา userId (ใช้ชั่วคราวสำหรับการทดสอบ)
    // ใน production จริงควรดึง userId จาก session
    const { email, month, year } = body;

    if (!email || !month || !year) {
      return NextResponse.json({ error: 'ข้อมูลไม่ครบถ้วน (email, month, year)' }, { status: 400 });
    }

    // 0. หา User ID จาก email
    const user = await prisma.user.findUnique({ 
      where: { email: email }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'ไม่พบ User นี้ในระบบ' }, { status: 404 });
    }
    
    const userId = user.id;

    // 1. คำนวณหาเดือนก่อนหน้า
    // input month คือ 1-12
    let lastMonth = month - 1;
    let lastYear = year;

    // ถ้าเดือนปัจจุบันคือ มกราคม (1) -> เดือนก่อนคือ ธันวาคม (12) ของปีก่อนหน้า
    if (lastMonth === 0) {
      lastMonth = 12;
      lastYear = year - 1;
    }

    // 2. ดึงงบของเดือนที่แล้วมาทั้งหมด
    const oldBudgets = await prisma.budget.findMany({
      where: {
        userId: userId,
        month: lastMonth,
        year: lastYear,
      },
    });

    if (oldBudgets.length === 0) {
      return NextResponse.json({ 
        success: false,
        message: `ไม่พบข้อมูลงบประมาณของเดือนก่อนหน้า (${lastMonth}/${lastYear})` 
      }, { status: 404 });
    }

    // 3. เตรียมข้อมูลสำหรับเดือนใหม่
    // map ข้อมูลเดิม แต่เปลี่ยนเดือน/ปี เป็นปัจจุบัน
    const newBudgetsData = oldBudgets.map((b) => ({
      amount: b.amount,
      month: month,
      year: year,
      categoryId: b.categoryId,
      userId: userId,
    }));

    // 4. บันทึกลง DB
    // skipDuplicates: true คือถ้ามีงบของหมวดนี้ในเดือนนี้อยู่แล้ว จะไม่ทำอะไร (ไม่ error)
    const created = await prisma.budget.createMany({
      data: newBudgetsData,
      skipDuplicates: true, 
    });

    return NextResponse.json({ 
      success: true, 
      copiedCount: created.count, 
      message: `คัดลอกสำเร็จ ${created.count} รายการ จากเดือน ${lastMonth}/${lastYear}` 
    });

  } catch (error) {
    console.error("Budget Copy Error:", error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการคัดลอก Internal Server Error' }, { status: 500 });
  }
}
