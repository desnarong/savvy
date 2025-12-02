// app/api/setup-test/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  // 1. หา User (ที่เรา Seed ไว้)
  const user = await prisma.user.findUnique({ where: { email: 'demo@example.com' }});
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // 2. สร้างหมวดหมู่ "อาหาร" (ถ้ายังไม่มี)
  const category = await prisma.category.upsert({
    where: { name_userId: { name: 'Food', userId: user.id } }, // เช็คว่ามีหรือยัง
    update: {},
    create: { name: 'Food', type: 'EXPENSE', userId: user.id }
  });

  // 3. คำนวณเดือนที่แล้ว
  const today = new Date();
  let lastMonth = today.getMonth(); // 0-11 (ถ้าเดือนนี้ ม.ค. จะได้ 0)
  let year = today.getFullYear();
  
  if (lastMonth === 0) { lastMonth = 12; year = year - 1; }
  
  // 4. ยัดงบ 5,000 บาท ลงเดือนที่แล้ว
  await prisma.budget.create({
    data: {
      amount: 5000,
      month: lastMonth,
      year: year,
      categoryId: category.id,
      userId: user.id
    }
  });

  return NextResponse.json({ message: 'สร้างข้อมูลเดือนที่แล้วเรียบร้อย! (หมวด Food: 5000)' });
}
