// app/api/payment/cancel/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const user = await prisma.user.update({
      where: { email },
      data: { plan: 'FREE', subscriptionEnds: null }
    });

    return NextResponse.json({ message: 'Subscription cancelled', user });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
  }
}
