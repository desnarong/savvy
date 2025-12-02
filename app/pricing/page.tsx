"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // ✅ Import useSession
import { useRouter } from "next/navigation";
import { Check, X, ShieldCheck, Zap, Crown, Loader2 } from "lucide-react";
// ✅ new UI imports
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";

type Plan = {
  id: string;
  name: string;
  price: number;
  days: number;
  isRecommended: boolean;
};

export default function PricingPage() {
  const { data: session, status, update } = useSession(); // ✅ ดึง update มาใช้
  const router = useRouter();
  
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/plans")
      .then((res) => res.json())
      .then((data) => {
        setPlans(data);
        setLoading(false);
      });
  }, []);

  const handleBuy = async (plan: Plan) => {
    if (status !== "authenticated") return router.push("/login");
    
    setProcessing(plan.id);
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        body: JSON.stringify({ planId: plan.id }),
      });
      const data = await res.json();
      
      if (data.qrCode) {
        setPaymentData({ ...data, planName: plan.name, price: plan.price });
        setShowModal(true);
      } else {
        alert("เกิดข้อผิดพลาด: " + data.error);
      }
    } catch (error) {
      alert("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    } finally {
      setProcessing(null);
    }
  };

  // ✅ ฟังก์ชันสำหรับปุ่ม "ฉันชำระเงินแล้ว"
  const handlePaymentCompleted = async () => {
    // 1. สั่งให้ NextAuth ไปดึงข้อมูล User มาใหม่เดี๋ยวนี้!
    await update(); 
    // 2. รีโหลดหน้าเว็บเพื่อโชว์สถานะ PRO
    window.location.reload();
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-blue-600 font-bold"><Loader2 className="animate-spin mr-2"/> Loading Plans...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="container space-y-12">
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-800">อัปเกรดเป็น PRO</h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">ปลดล็อกขีดจำกัด สร้างหมวดหมู่ได้ไม่จำกัด และเข้าถึงฟีเจอร์ใหม่ๆ ก่อนใคร</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map(plan => (
            <Card key={plan.id} className={`${plan.isRecommended ? 'border-primary-500 shadow-lg' : ''} p-6`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl">{plan.name}</h3>
                  <div className="text-3xl font-extrabold text-primary-600 mt-2">฿{plan.price}</div>
                  <div className="text-sm text-neutral-500">/ {plan.days} วัน</div>
                </div>
                {plan.isRecommended && <Badge>แนะนำ</Badge>}
              </div>
              <ul className="space-y-3 mb-6 text-neutral-600">
                <li className="flex items-center gap-2"><Check className="text-success-500"/> สร้างหมวดหมู่ได้ไม่จำกัด</li>
                <li className="flex items-center gap-2"><Check className="text-success-500"/> ใช้งานได้ทุกฟีเจอร์</li>
              </ul>
              <Button onClick={()=>handleBuy(plan)} loading={processing===plan.id} className="w-full"><Zap/> เลือกแพ็กเกจนี้</Button>
            </Card>
          ))}
        </div>
 
        <div className="text-center">
            <p className="text-sm text-neutral-500 font-medium flex items-center justify-center gap-2"><ShieldCheck size={16}/> ชำระเงินปลอดภัยผ่าน QR Code PromptPay</p>
        </div>
       </div>
 
       {/* Payment Modal */}
      {showModal && paymentData && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition bg-slate-100 p-1 rounded-full"><X size={20}/></button>
            
            <div className="text-center mb-6 mt-2">
              <h3 className="font-bold text-xl text-slate-800">สแกนเพื่อชำระเงิน</h3>
              <p className="text-slate-500 text-sm mt-1">แอปธนาคารรองรับทุกธนาคาร</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6 flex flex-col items-center">
               {/* เช็ค Prefix ก่อนใส่ */}
               <img 
                 src={paymentData.qrCode.startsWith('data:') ? paymentData.qrCode : `data:image/png;base64,${paymentData.qrCode}`} 
                 className="w-48 h-48 object-contain mix-blend-multiply" 
                 alt="QR Code" 
               />
               <div className="mt-4 text-center">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">ยอดชำระ</p>
                 <p className="text-3xl font-black text-blue-600">฿{paymentData.price.toFixed(2)}</p>
               </div>
            </div>

            <div className="space-y-3 text-center">
                <p className="text-xs text-slate-400">กรุณาชำระเงินภายใน 15 นาที <br/> ระบบจะอัปเกรดให้คุณอัตโนมัติหลังชำระเงิน</p>
                {/* ✅ ปุ่มนี้จะสั่ง Refresh Session */}
                <button onClick={handlePaymentCompleted} className="text-blue-600 font-bold text-sm hover:underline">ฉันชำระเงินแล้ว</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
