// app/api/dashboard/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // ดึง Budget + Category (ตรงนี้มันได้ icon มาแล้วแต่อยู่ใน object category)
    const budgets = await prisma.budget.findMany({
      where: { userId: user.id, month: currentMonth, year: currentYear },
      include: { category: true }
    });

    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0);

    const expenses = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId: user.id,
        date: { gte: startOfMonth, lte: endOfMonth }
      },
      _sum: { amount: true }
    });

    const dashboardData = budgets.map(budget => {
      const actual = expenses.find(e => e.categoryId === budget.categoryId)?._sum.amount || 0;
      const percent = (Number(actual) / Number(budget.amount)) * 100;

      return {
        categoryName: budget.category.name,
        // *** แก้ตรงนี้ครับ: ส่ง icon กลับไปให้หน้าบ้านด้วย ***
        icon: budget.category.icon, 
        budget: Number(budget.amount),
        actual: Number(actual),
        percent: percent,
        status: percent > 100 ? 'OVER' : percent > 80 ? 'WARNING' : 'OK'
      };
    });

    return NextResponse.json({ data: dashboardData });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
