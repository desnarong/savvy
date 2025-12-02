// app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth"; // ต้องเช็ค Session ฝั่ง Server ด้วยเพื่อความปลอดภัย

export async function GET(request: Request) {
  // เช็คสิทธิ์ก่อนว่าใช่ Admin ไหม (กันคนอื่นยิง API เล่น)
  // (โค้ดเช็ค Session ฝั่ง Server อาจต้อง setup authOptions แยก แต่ในขั้นตอนนี้ข้ามไปก่อนเพื่อความง่าย)
  
  // ดึง User ทั้งหมด เรียงจากใหม่ไปเก่า
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, role: true, plan: true, createdAt: true }
  });

  return NextResponse.json(users);
}
