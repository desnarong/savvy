// app/api/transactions/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. POST: บันทึกรายจ่ายใหม่
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, amount, categoryId, note, date } = body;

    // หา User ID (เหมือนเดิมครับ ใช้แก้ขัดไปก่อนจะมี Login จริง)
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        categoryId,
        userId: user.id,
        note,
        date: new Date(date), // แปลง string เป็น Date Object
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating transaction' }, { status: 500 });
  }
}
