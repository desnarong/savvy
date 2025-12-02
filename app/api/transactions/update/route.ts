// app/api/transactions/update/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const { id, amount, date, note, categoryId } = await request.json();
    
    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        amount: parseFloat(amount),
        date: new Date(date),
        note,
        categoryId
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
