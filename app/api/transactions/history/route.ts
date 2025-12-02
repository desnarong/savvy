// app/api/transactions/history/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const page = parseInt(searchParams.get('page') || '1'); // รับเลขหน้า (Default = 1)
  const limit = 20; // จำนวนรายการต่อหน้า

  if (!email) return NextResponse.json([]);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json([]);

  // ใช้ Transaction เพื่อดึงข้อมูล + นับจำนวนพร้อมกัน (เร็วขึ้น)
  const [transactions, total] = await prisma.$transaction([
    prisma.transaction.findMany({
      where: { userId: user.id },
      include: {
        category: { select: { name: true, icon: true } }
      },
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit, // ข้ามรายการของหน้าก่อนๆ
      take: limit, // ดึงมาแค่ limit
    }),
    prisma.transaction.count({ where: { userId: user.id } }) // นับทั้งหมด
  ]);

  return NextResponse.json({
    data: transactions,
    pagination: {
      total,
      page,
      totalPages: Math.ceil(total / limit)
    }
  });
}
