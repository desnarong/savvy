// app/api/admin/users/manage/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. แก้ไขข้อมูลผู้ใช้ (เปลี่ยน Plan / Role)
export async function PUT(request: Request) {
  try {
    const { id, role, plan } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role, plan }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

// 2. ลบผู้ใช้ (Delete User)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    // ลบข้อมูลที่เกี่ยวข้องก่อน (Cascade Delete)
    // *หมายเหตุ: ถ้าตั้งค่า Cascade ใน Prisma schema แล้ว ไม่ต้องลบ manual ก็ได้
    // แต่เพื่อความชัวร์ ลบ transaction/budget/category ก่อน
    await prisma.transaction.deleteMany({ where: { userId: id } });
    await prisma.budget.deleteMany({ where: { userId: id } });
    await prisma.category.deleteMany({ where: { userId: id } });
    await prisma.payment.deleteMany({ where: { userId: id } });

    // ลบ User
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
