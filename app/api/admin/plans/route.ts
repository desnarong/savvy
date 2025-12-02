// app/api/admin/plans/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: ดึงรายการแผนทั้งหมด (ใช้ได้ทั้ง Admin และหน้า Pricing)
export async function GET() {
  const plans = await prisma.pricingPlan.findMany({
    orderBy: { price: 'asc' } // เรียงตามราคา
  });
  return NextResponse.json(plans);
}

// POST: สร้างแผนใหม่ (Admin Only)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const plan = await prisma.pricingPlan.create({ data: body });
    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

// PUT: แก้ไขแผน (Admin Only)
export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();
    const plan = await prisma.pricingPlan.update({
      where: { id },
      data: data
    });
    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

// DELETE: ลบแผน (Admin Only)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if(!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.pricingPlan.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
