// app/forgot-password/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [debugLink, setDebugLink] = useState(""); // สำหรับเทส

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    const data = await res.json();

    if (res.ok) {
      setStatus("success");
      setDebugLink(data.debugLink); // รับลิ้งค์มาโชว์ (เฉพาะช่วง Dev)
    } else {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md text-center">
        <Link href="/login" className="flex items-center gap-2 text-slate-400 hover:text-slate-600 mb-6 text-sm font-bold"><ArrowLeft size={16}/> กลับไปหน้าเข้าสู่ระบบ</Link>
        
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
            <Mail size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">ลืมรหัสผ่าน?</h1>
        <p className="text-slate-500 text-sm mb-6">กรอกอีเมลของคุณเพื่อรับลิงก์ตั้งรหัสผ่านใหม่</p>

        {status === "success" ? (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm">
                <p className="font-bold">ส่งลิงก์แล้ว!</p>
                <p className="mt-2 text-xs">ในโหมดจริงต้องเช็คอีเมล แต่ตอนนี้คลิกข้างล่างได้เลย:</p>
                <a href={debugLink} className="block mt-2 text-blue-600 underline break-all">{debugLink}</a>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    type="email" required placeholder="name@example.com"
                    className="w-full p-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                    value={email} onChange={e => setEmail(e.target.value)}
                />
                {status === "error" && <p className="text-red-500 text-sm font-bold">ไม่พบอีเมลนี้ในระบบ</p>}
                <button disabled={status === "loading"} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition disabled:opacity-50">
                    {status === "loading" ? "กำลังส่ง..." : "ส่งลิงก์กู้คืน"}
                </button>
            </form>
        )}
      </div>
    </div>
  );
}
