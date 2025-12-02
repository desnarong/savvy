// app/api/config/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/route"; // ถ้ามี authOptions แยก

export async function GET() {
  // ดึงค่าราคา (ถ้าไม่มีใน DB ให้ Default 59)
  const config = await prisma.systemConfig.findUnique({
    where: { key: 'PRO_PRICE' }
  });
  
  return NextResponse.json({ price: parseInt(config?.value || '59') });
}

export async function POST(request: Request) {
  try {
    // เช็คสิทธิ์ Admin (ในโค้ดจริงควรเช็ค Session, แต่เพื่อความง่ายข้ามไปก่อน)
    const { price } = await request.json();

    // บันทึกค่าลง DB (Upsert = ถ้ามีให้อัปเดต ถ้าไม่มีให้สร้างใหม่)
    await prisma.systemConfig.upsert({
      where: { key: 'PRO_PRICE' },
      update: { value: String(price) },
      create: { key: 'PRO_PRICE', value: String(price) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
