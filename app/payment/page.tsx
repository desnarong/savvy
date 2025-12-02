// app/payment/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function PaymentPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    // 1. ดึงข้อมูล Payment จาก LocalStorage
    const stored = localStorage.getItem("currentPayment");
    
    if (stored) {
        setPaymentData(JSON.parse(stored));
        setLoading(false);
    } else {
        // ถ้าไม่มีข้อมูล (เช่น user พิมพ์ URL เข้ามาเอง) ดีดกลับไปหน้าเลือกแผน
        router.push("/pricing");
    }
  }, [router]);

  // ฟังก์ชันเช็คสถานะ (จำลองการกดปุ่มยืนยัน)
  const handleCheckStatus = async () => {
    setChecking(true);
    
    // บังคับโหลด Session ใหม่ เพื่อดูว่าสถานะเปลี่ยนเป็น PRO หรือยัง
    await update();
    
    // เช็คว่าใน Session เป็น Pro หรือยัง?
    // (หมายเหตุ: ปกติ Webhook ของ Paynoi จะใช้เวลา 1-3 วินาที)
    // ในที่นี้เราจะ Refresh หน้าเพื่อเช็คผล
    window.location.reload();
  };

  // ถ้า User เป็น PRO แล้ว ให้แสดงหน้า Success
  if ((session?.user as any)?.plan === 'PRO') {
      return (
        <div className="min-h-screen bg-green-50 flex items-center justify-center p-4 font-sans animate-in zoom-in-95">
            <div className="bg-white p-10 rounded-3xl shadow-xl max-w-sm w-full text-center border border-green-100">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <CheckCircle2 size={48} />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-800 mb-2">ชำระเงินสำเร็จ!</h1>
                <p className="text-slate-500 mb-8">บัญชีของคุณได้รับการอัปเกรดเป็น <br/><span className="text-green-600 font-bold">Pro Unlimited</span> เรียบร้อยแล้ว</p>
                <Link href="/" className="block w-full py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-200">
                    เข้าใช้งานทันที
                </Link>
            </div>
        </div>
      );
  }

  if (loading) return <div className="h-screen flex items-center justify-center text-blue-600 font-bold"><Loader2 className="animate-spin mr-2"/> กำลังโหลดข้อมูล...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full text-center border border-slate-100 relative">
        
        {/* ปุ่มย้อนกลับ */}
        <Link href="/pricing" className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 transition">
            <ArrowLeft size={24} />
        </Link>

        <div className="mb-6 mt-2">
            <h1 className="text-xl font-bold text-slate-800 mb-1">สแกนเพื่อชำระเงิน</h1>
            <p className="text-slate-500 text-xs">QR Code นี้ใช้ได้ครั้งเดียว</p>
        </div>

        {/* QR Code Area */}
        <div className="bg-white p-4 rounded-2xl border-2 border-blue-100 inline-block mb-6 shadow-sm relative group">
            {paymentData?.qrImage ? (
                <img src={`data:image/png;base64,${paymentData.qrImage}`} alt="PromptPay QR" className="w-56 h-56 object-contain mix-blend-multiply" />
            ) : (
                <div className="w-56 h-56 bg-slate-100 flex items-center justify-center text-slate-400 rounded-xl">QR Error</div>
            )}
            <div className="absolute inset-x-0 bottom-2 text-[10px] text-slate-400 font-mono tracking-widest opacity-50">PROMPTPAY</div>
        </div>

        {/* Amount Display */}
        <div className="bg-blue-50 p-5 rounded-2xl mb-6 border border-blue-100">
            <div className="flex items-center justify-center gap-2 mb-1 text-slate-500 text-xs font-bold uppercase tracking-wide">
                ยอดที่ต้องโอน
                <span className="bg-blue-200 text-blue-700 px-1.5 py-0.5 rounded text-[10px]">ห้ามปัดเศษ</span>
            </div>
            <p className="text-4xl font-black text-blue-600 tracking-tight">
                ฿{paymentData?.amount}
            </p>
            <div className="mt-3 flex items-start gap-2 text-left bg-white/50 p-2 rounded-lg">
                <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5"/>
                <p className="text-[10px] text-slate-500 leading-tight">
                    ระบบใช้ <strong>"ทศนิยม"</strong> ในการยืนยันตัวตน กรุณาโอนยอดให้ตรงเป๊ะๆ ภายใน 15 นาที
                </p>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
            <button 
                onClick={handleCheckStatus} 
                disabled={checking}
                className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
            >
                {checking ? <Loader2 className="animate-spin" size={20}/> : "ฉันโอนเงินแล้ว"}
            </button>
            <p className="text-[10px] text-slate-400">
                เมื่อโอนเสร็จแล้ว กดปุ่มด้านบนเพื่อรีเฟรชสถานะ
            </p>
        </div>
      </div>
    </div>
  );
}
