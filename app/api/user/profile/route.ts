// app/api/user/profile/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. ดึงข้อมูลโปรไฟล์ (GET)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { email },
    select: { name: true, image: true, email: true } // ดึงเฉพาะข้อมูลที่ปลอดภัย
  });

  return NextResponse.json(user);
}

// 2. อัปเดตข้อมูลโปรไฟล์ (PUT)
export async function PUT(request: Request) {
  try {
    const { email, name, image } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { name, image }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
