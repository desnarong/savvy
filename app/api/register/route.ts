// app/api/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from '@/lib/email';
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
    }

    // 1. เข้ารหัส Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. สร้าง User ใหม่
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // ส่ง Welcome Email (ไม่ต้อง await ก็ได้ ให้ทำ background)
    sendWelcomeEmail(email, user.name || "สมาชิก");

    return NextResponse.json({ message: "สมัครสมาชิกสำเร็จ", user }, { status: 201 });
  } catch (error: any) {
    // เช็คกรณีอีเมลซ้ำ (Unique constraint violation code = P2002)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "อีเมลนี้ถูกใช้งานแล้ว" }, { status: 400 });
    }
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
