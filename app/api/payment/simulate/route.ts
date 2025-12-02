// app/api/payment/simulate/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // อัปเดต User เป็น PRO
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        plan: 'PRO',
        // แถมวันหมดอายุให้ 1 ปี (นับจากวันนี้)
        subscriptionEnds: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) 
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Upgrade Successful', 
      plan: updatedUser.plan 
    });

  } catch (error) {
    console.error("Payment Error:", error);
    return NextResponse.json({ error: 'Upgrade failed' }, { status: 500 });
  }
}
