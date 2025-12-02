// app/reset-password/page.tsx
"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

// สร้าง Component ย่อยเพื่อรองรับ useSearchParams (ป้องกัน Error ตอน Build)
function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg("รหัสผ่านไม่ตรงกัน");
      setStatus("error");
      return;
    }

    setStatus("loading");
    
    const res = await fetch("/api/auth/reset-password/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: password }),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("success");
      // รอ 3 วินาทีแล้วดีดไปหน้า Login
      setTimeout(() => router.push("/login"), 3000);
    } else {
      setErrorMsg(data.error || "เกิดข้อผิดพลาด");
      setStatus("error");
    }
  };

  if (!token) {
    return <div className="text-red-500 font-bold">ไม่พบ Token (ลิ้งค์ไม่สมบูรณ์)</div>;
  }

  if (status === "success") {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
            <CheckCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">สำเร็จ!</h2>
        <p className="text-slate-500 mb-6">รหัสผ่านของคุณถูกเปลี่ยนแล้ว <br/>กำลังพากลับไปหน้าเข้าสู่ระบบ...</p>
        <Link href="/login" className="text-blue-600 font-bold hover:underline">ไปหน้าเข้าสู่ระบบทันที</Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4 shadow-lg shadow-blue-200">
          <Lock size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">ตั้งรหัสผ่านใหม่</h1>
        <p className="text-slate-500 text-sm mt-1">กรุณากรอกรหัสผ่านใหม่ของคุณ</p>
      </div>

      {status === "error" && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-2 font-bold border border-red-100">
          <AlertCircle size={18}/> {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">รหัสผ่านใหม่</label>
          <input 
            type="password" required 
            className="w-full p-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 outline-none transition"
            placeholder="••••••••"
            value={password} onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">ยืนยันรหัสผ่าน</label>
          <input 
            type="password" required 
            className="w-full p-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 outline-none transition"
            placeholder="••••••••"
            value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
          />
        </div>
        
        <button 
          disabled={status === "loading"} 
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-[0.98] disabled:opacity-70"
        >
          {status === "loading" ? "กำลังบันทึก..." : "ยืนยันรหัสผ่านใหม่"}
        </button>
      </form>
    </div>
  );
}

// Main Page Component
export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        <Suspense fallback={<div>Loading...</div>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}
