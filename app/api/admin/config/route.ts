// app/api/admin/config/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: ดึงค่าทั้งหมด
export async function GET() {
  const configs = await prisma.systemConfig.findMany({
    orderBy: { key: 'asc' }
  });
  return NextResponse.json(configs);
}

// POST: บันทึกค่า (รับมาเป็น Array แล้ววนลูป update)
export async function POST(request: Request) {
  try {
    const body = await request.json(); // รับ array [{key, value}, ...]
    
    // ใช้ Transaction เพื่อความชัวร์ (ถ้าพังก็พังหมด ไม่เซฟครึ่งๆ กลางๆ)
    await prisma.$transaction(
        body.map((config: any) => 
            prisma.systemConfig.update({
                where: { key: config.key },
                data: { value: String(config.value) }
            })
        )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
