import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-700">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">นโยบายความเป็นส่วนตัว (Privacy Policy)</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">1. ข้อมูลที่เราจัดเก็บ</h2>
            <p>เราจัดเก็บข้อมูลที่จำเป็นสำหรับการให้บริการเท่านั้น ได้แก่:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>อีเมล (Email) และชื่อผู้ใช้ (Username) สำหรับการเข้าสู่ระบบ</li>
              <li>ข้อมูลประวัติการชำระเงิน (วันที่, จำนวนเงิน, สถานะ)</li>
              <li>ข้อมูลที่คุณบันทึกในระบบ (รายรับ-รายจ่าย)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">2. การใช้งานข้อมูล</h2>
            <p>เราใช้ข้อมูลของคุณเพื่อ:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>ให้บริการและปรับปรุงระบบ Savvy รู้ตังค์</li>
              <li>ตรวจสอบและยืนยันการชำระเงิน</li>
              <li>ติดต่อแจ้งเตือนสถานะบัญชีหรือโปรโมชั่น (คุณสามารถยกเลิกได้)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">3. การเปิดเผยข้อมูล</h2>
            <p>เราไม่เปิดเผยข้อมูลส่วนตัวของคุณให้แก่บุคคลภายนอก ยกเว้น:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>ผู้ให้บริการชำระเงิน (เช่น Paynoi) เพื่อประมวลผลธุรกรรม</li>
              <li>เมื่อมีการร้องขอตามกฎหมาย</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">4. ความปลอดภัย</h2>
            <p>เราใช้มาตรการความปลอดภัยมาตรฐาน (SSL/Encryption) เพื่อปกป้องข้อมูลของคุณ รหัสผ่านของคุณถูกเข้ารหัสและเราไม่สามารถมองเห็นได้</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <Link href="/" className="text-blue-600 hover:underline">← กลับสู่หน้าหลัก</Link>
        </div>
      </div>
    </div>
  );
}
