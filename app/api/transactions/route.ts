// app/api/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. POST: บันทึกรายจ่ายใหม่
export async function POST(req: NextRequest) {
  try {
    const { email, amount, categoryId, note, date } = await req.json();

    if (!email || !amount || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        categoryId,
        userId: user.id,
        note: note || '',
        date: new Date(date),
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
