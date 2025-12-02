// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const appName = "Savvy รู้ตังค์";

// 1. อีเมลสำหรับรีเซ็ตรหัสผ่าน
export async function sendResetPasswordEmail(email: string, resetLink: string) {
  try {
    await resend.emails.send({
      from: `${appName} <${fromEmail}>`,
      to: email,
      subject: '🔒 ตั้งรหัสผ่านใหม่ - Savvy รู้ตังค์',
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563eb; text-align: center;">Savvy รู้ตังค์</h2>
          <p>สวัสดีครับ,</p>
          <p>เราได้รับคำขอให้รีเซ็ตรหัสผ่านสำหรับบัญชีของคุณ <strong>${email}</strong></p>
          <p>กรุณากดปุ่มด้านล่างเพื่อตั้งรหัสผ่านใหม่ (ลิ้งค์มีอายุ 1 ชั่วโมง):</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">ตั้งรหัสผ่านใหม่</a>
          </div>
          <p style="font-size: 12px; color: #666;">หรือก๊อปปี้ลิ้งค์นี้ไปวางในเบราว์เซอร์:<br/>${resetLink}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999; text-align: center;">หากคุณไม่ได้เป็นคนกดขอรีเซ็ต กรุณาเพิกเฉยต่ออีเมลฉบับนี้</p>
        </div>
      `
    });
    return { success: true };
  } catch (error) {
    console.error("Resend Error:", error);
    return { success: false, error };
  }
}

// 2. อีเมลต้อนรับ (ส่งตอนสมัครสมาชิกเสร็จ)
export async function sendWelcomeEmail(email: string, name: string = "สมาชิกใหม่") {
    try {
      await resend.emails.send({
        from: `${appName} <${fromEmail}>`,
        to: email,
        subject: '🎉 ยินดีต้อนรับสู่ Savvy รู้ตังค์!',
        html: `
          <div style="font-family: sans-serif; color: #333; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #2563eb; text-align: center;">ยินดีต้อนรับครับ!</h2>
            <p>สวัสดีคุณ <strong>${name}</strong>,</p>
            <p>ขอบคุณที่สมัครใช้งาน <strong>Savvy รู้ตังค์</strong> แอปที่จะช่วยให้การวางแผนการเงินของคุณเป็นเรื่องง่าย</p>
            <p>คุณสามารถเริ่มตั้งงบประมาณและจดรายรับรายจ่ายได้ทันที</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">เข้าสู่ระบบ</a>
            </div>
          </div>
        `
      });
    } catch (error) {
      console.error("Welcome Email Error:", error);
    }
}
