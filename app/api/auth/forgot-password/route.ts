// app/api/auth/forgot-password/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sendResetPasswordEmail } from '@/lib/email'; // <--- Import

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // เพื่อความปลอดภัย ไม่ควรบอกว่าไม่มีอีเมลนี้ (แต่ใน Dev บอกได้)
      return NextResponse.json({ error: 'ไม่พบอีเมลนี้ในระบบ' }, { status: 404 });
    }

    // สร้าง Token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 ชม.

    // บันทึก DB
    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry }
    });

    // สร้าง Link
    // ตรวจสอบว่า NEXTAUTH_URL ใน .env มีค่าหรือไม่ (เช่น http://localhost:3000)
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;
    
    // --- ส่งอีเมลจริง (Resend) ---
    console.log("Sending email to:", email);
    await sendResetPasswordEmail(email, resetUrl);
    // ---------------------------

    return NextResponse.json({ 
      success: true, 
      message: 'ส่งลิงก์กู้คืนรหัสผ่านไปที่อีเมลของคุณแล้ว (กรุณาเช็ค Inbox หรือ Junk)'
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการส่งอีเมล' }, { status: 500 });
  }
}
