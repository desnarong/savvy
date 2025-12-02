// app/api/payment/cancel/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // อัปเดตกลับเป็น FREE
    await prisma.user.update({
      where: { email },
      data: {
        plan: 'FREE',
        subscriptionEnds: null // ล้างวันหมดอายุ
      }
    });

    return NextResponse.json({ success: true, message: 'Downgrade successful' });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
