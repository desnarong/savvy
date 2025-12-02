import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-700">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">ข้อตกลงการใช้งาน (Terms of Service)</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">1. การยอมรับข้อตกลง</h2>
            <p>เมื่อคุณเข้าใช้งาน Savvy รู้ตังค์ ถือว่าคุณยอมรับข้อตกลงและเงื่อนไขทั้งหมดในหน้านี้ หากไม่ยอมรับ กรุณาระงับการใช้งานทันที</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">2. บัญชีผู้ใช้</h2>
            <p>คุณต้องรับผิดชอบต่อความปลอดภัยของรหัสผ่านและการกระทำทั้งหมดที่เกิดขึ้นภายใต้บัญชีของคุณ เราขอสงวนสิทธิ์ในการระงับบัญชีหากพบการใช้งานที่ผิดปกติหรือผิดกฎหมาย</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">3. การชำระเงินและการคืนเงิน</h2>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>บริการของเราเป็นรูปแบบชำระเงินก่อนใช้งาน (Pre-paid)</li>
              <li>การอัปเกรดสถานะ PRO จะมีผลทันทีหลังจากชำระเงินสำเร็จ</li>
              <li><strong>นโยบายการคืนเงิน:</strong> เนื่องจากเป็นสินค้าดิจิทัล เราขอสงวนสิทธิ์ไม่คืนเงินทุกกรณี ยกเว้นเกิดข้อผิดพลาดจากระบบของเราโดยตรง</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">4. การจำกัดความรับผิดชอบ</h2>
            <p>Savvy รู้ตังค์ ให้บริการ "ตามสภาพ" (As is) เราไม่รับประกันว่าระบบจะไม่มีข้อผิดพลาด หรือหยุดทำงาน แต่จะพยายามแก้ไขปัญหาให้เร็วที่สุดเท่าที่เป็นไปได้</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <Link href="/" className="text-blue-600 hover:underline">← กลับสู่หน้าหลัก</Link>
        </div>
      </div>
    </div>
  );
}
