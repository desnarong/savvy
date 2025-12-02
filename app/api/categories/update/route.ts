// app/api/categories/update/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const { id, name, icon } = await request.json();
    
    // อัปเดตข้อมูล
    const updated = await prisma.category.update({
      where: { id },
      data: { name, icon }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
