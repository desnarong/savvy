// app/api/budgets/set/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, categoryId, amount, month, year } = await request.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // ใช้ upsert: ถ้าเดือนนี้หมวดนี้มีงบแล้ว -> แก้ตัวเลข, ถ้ายัง -> สร้างใหม่
    const budget = await prisma.budget.upsert({
      where: {
        month_year_categoryId_userId: {
          month: parseInt(month),
          year: parseInt(year),
          categoryId,
          userId: user.id
        }
      },
      update: { amount: parseFloat(amount) },
      create: {
        amount: parseFloat(amount),
        month: parseInt(month),
        year: parseInt(year),
        categoryId,
        userId: user.id
      }
    });

    return NextResponse.json(budget);
  } catch (error) {
    console.error(error); // ดู log error ถ้ามีปัญหา
    return NextResponse.json({ error: 'Error setting budget' }, { status: 500 });
  }
}
