// app/api/categories/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // 1. รับค่า email จาก URL
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      // ถ้าไม่มี email ส่ง array ว่างกลับไป เพื่อไม่ให้ Dropdown หน้าบ้านพัง
      return NextResponse.json([]);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    
    // ถ้าไม่เจอ User ก็ส่ง array ว่าง
    if (!user) return NextResponse.json([]);

    // 2. ดึงหมวดหมู่เฉพาะของ User คนนี้
    const categories = await prisma.category.findMany({
      where: { userId: user.id },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(categories);

  } catch (error) {
    console.error("Categories API Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
