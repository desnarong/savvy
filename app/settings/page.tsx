// app/settings/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { User, Save, Lock, Camera, AlertCircle, Loader2, Download, Trash2, ShieldAlert, UploadCloud, Crown, CreditCard } from "lucide-react";
// ✅ new UI components
import { Card } from "@/components/Card";
import Button from "@/components/Button";
import Input from "@/components/Input";

// --- ⚙️ ตั้งค่า Cloudinary ---
const CLOUD_NAME = "dsabmbgxn"; 
const UPLOAD_PRESET = "savvy_images";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- States ---
  const [profile, setProfile] = useState({ name: "", image: "" });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [pass, setPass] = useState({ current: "", new: "", confirm: "" });
  const [savingPass, setSavingPass] = useState(false);
  
  const [message, setMessage] = useState({ type: "", text: "" });

  // --- Fetch Data ---
  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/user/profile?email=${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          if(data) setProfile({ name: data.name || "", image: data.image || "" });
          setLoadingProfile(false);
        });
    }
  }, [session?.user?.email]);

  // --- Handlers ---

  // 1. Upload Image
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("ไฟล์รูปภาพต้องมีขนาดไม่เกิน 5MB"); return; }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
        const data = await res.json();
        if (data.secure_url) setProfile(prev => ({ ...prev, image: data.secure_url }));
        else alert("อัปโหลดรูปไม่สำเร็จ");
    } catch (error) { alert("เกิดข้อผิดพลาดในการอัปโหลด"); }
    setUploadingImage(false);
  };

  // 2. Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.user?.email, ...profile }),
      });
      if (res.ok) {
        await update({ name: profile.name, image: profile.image });
        setMessage({ type: "success", text: "บันทึกข้อมูลส่วนตัวสำเร็จ!" });
      } else { setMessage({ type: "error", text: "บันทึกไม่สำเร็จ" }); }
    } catch (err) { setMessage({ type: "error", text: "เกิดข้อผิดพลาด" }); }
    setSavingProfile(false);
  };

  // 3. Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    if (pass.new !== pass.confirm) { setMessage({ type: "error", text: "รหัสผ่านใหม่ไม่ตรงกัน" }); return; }
    setSavingPass(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.user?.email, currentPassword: pass.current, newPassword: pass.new }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "เปลี่ยนรหัสผ่านสำเร็จ!" });
        setPass({ current: "", new: "", confirm: "" });
      } else { setMessage({ type: "error", text: data.error }); }
    } catch (err) { setMessage({ type: "error", text: "เกิดข้อผิดพลาด" }); }
    setSavingPass(false);
  };

  // 4. Downgrade Plan (New!)
  const handleDowngrade = async () => {
    if(!confirm("คุณต้องการยกเลิก Pro Plan และกลับไปเป็น Free ใช่หรือไม่? \n\n(สิทธิพิเศษต่างๆ เช่น การสร้างหมวดหมู่ไม่จำกัด จะหายไปทันที)")) return;
    
    try {
        const res = await fetch("/api/payment/cancel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: session?.user?.email }),
        });
        
        if (res.ok) {
            alert("ยกเลิกสมาชิกเรียบร้อยแล้ว สถานะของคุณกลับเป็น Free");
            await update(); // รีเฟรช Session เพื่อให้ UI อัปเดต
            window.location.reload();
        } else {
            alert("เกิดข้อผิดพลาดในการยกเลิก");
        }
    } catch (error) {
        alert("เชื่อมต่อ Server ไม่ได้");
    }
  };

  if (loadingProfile) return <div className="min-h-screen flex items-center justify-center text-blue-500 font-bold">Loading settings...</div>;

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="container">
       
       <h1 className="text-2xl font-bold text-slate-800">ตั้งค่าบัญชี</h1>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button onClick={() => setActiveTab("profile")} className={`px-6 py-3 text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 ${activeTab === "profile" ? "bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}><User size={18}/> ข้อมูลส่วนตัว</button>
        <button onClick={() => setActiveTab("security")} className={`px-6 py-3 text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 ${activeTab === "security" ? "bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}><Lock size={18}/> ความปลอดภัย</button>
        <button onClick={() => setActiveTab("data")} className={`px-6 py-3 text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 ${activeTab === "data" ? "bg-white text-red-500 border-b-2 border-red-500 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}><ShieldAlert size={18}/> ข้อมูล & บัญชี</button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in slide-in-from-top-2 ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
          <AlertCircle size={20}/> {message.text}
        </div>
      )}

      <Card className="min-h-[400px] p-8">
        
        {/* Tab 1: Profile */}
        {activeTab === "profile" && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300 max-w-lg">
                <h2 className="text-lg font-bold text-slate-800 mb-6">แก้ไขข้อมูลส่วนตัว</h2>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-slate-50 shadow-inner overflow-hidden flex-shrink-0">
                                {profile.image ? <img src={profile.image} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><User size={40}/></div>}
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200"><Camera className="text-white" size={24} /></div>
                            {uploadingImage && <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center"><Loader2 className="text-blue-600 animate-spin" size={24} /></div>}
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="font-bold text-slate-700 mb-1">รูปโปรไฟล์</h3>
                            <p className="text-xs text-slate-400 mb-3">แนะนำขนาด 1:1 (ไม่เกิน 5MB)</p>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange}/>
                            <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage} icon={<UploadCloud size={16} />}>{uploadingImage ? "กำลังอัปโหลด..." : "อัปโหลดรูปใหม่"}</Button>
                        </div>
                    </div>
                    <div>
                        <Input label="ชื่อเล่น / ชื่อที่แสดง" placeholder="ชื่อของคุณ" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" loading={savingProfile} icon={<Save size={16}/>}>บันทึกการเปลี่ยนแปลง</Button>
                    </div>
                </form>
            </div>
        )}

        {/* Tab 2: Security */}
        {activeTab === "security" && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300 max-w-lg">
                <h2 className="text-lg font-bold text-slate-800 mb-6">เปลี่ยนรหัสผ่าน</h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div><Input label="รหัสผ่านปัจจุบัน" type="password" required value={pass.current} onChange={e => setPass({...pass, current: e.target.value})} /></div>
                    <hr className="border-slate-100 my-2"/>
                    <div><Input label="รหัสผ่านใหม่" type="password" required value={pass.new} onChange={e => setPass({...pass, new: e.target.value})} /></div>
                    <div><Input label="ยืนยันรหัสผ่านใหม่" type="password" required value={pass.confirm} onChange={e => setPass({...pass, confirm: e.target.value})} /></div>
                    <div className="flex justify-end"><Button type="submit" disabled={savingPass} loading={savingPass}>เปลี่ยนรหัสผ่าน</Button></div>
                </form>
            </div>
        )}

        {/* Tab 3: Data & Subscription */}
        {activeTab === "data" && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300 space-y-8 max-w-2xl">
                
                {/* Subscription Section */}
                <Card className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                     <div>
                         <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                             สถานะสมาชิก
                             {(session?.user as any)?.plan === 'PRO' ? (
                                 <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md text-[10px] font-bold border border-amber-200 flex items-center gap-1 uppercase tracking-wide">
                                     <Crown size={10} fill="currentColor"/> Pro Member
                                 </span>
                             ) : (
                                 <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-bold border border-slate-300 uppercase tracking-wide">Free Starter</span>
                             )}
                         </h3>
                         <p className="text-sm text-slate-500 mt-1">
                             {(session?.user as any)?.plan === 'PRO' 
                                 ? "คุณได้รับสิทธิ์ใช้งานเต็มรูปแบบ สร้างหมวดหมู่ได้ไม่จำกัด" 
                                 : "จำกัดการสร้างหมวดหมู่สูงสุด 5 รายการ"}
                         </p>
                     </div>
                     
                     {/* Action Button: Upgrade or Downgrade */}
                     {(session?.user as any)?.plan === 'PRO' ? (
-                            <button 
-                                onClick={handleDowngrade}
-                                className="bg-white border border-slate-300 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition shadow-sm whitespace-nowrap flex items-center gap-2"
-                            >
-                                ยกเลิก Pro Plan
-                            </button>
+                            <Button onClick={handleDowngrade} variant="secondary">ยกเลิก Pro Plan</Button>
+                        ) : (
+                            <Link href="/pricing"><Button variant="primary"><CreditCard size={16} /> อัปเกรดทันที</Button></Link>
+                        )}
                     </div
 
                     <hr className="border-slate-100"/>
 
                     <div className="text-sm text-slate-500">
                         <p className="mb-1">การชำระเงินถัดไปของคุณจะเกิดขึ้นในวันที่:</p>
                         <p className="font-bold text-slate-700">15 มีนาคม 2023</p>
                     </div>
                 </Card>

                 <hr className="border-slate-100"/>

                 {/* Data Section */}
                 <div>
                     <h2 className="text-lg font-bold text-slate-800 mb-2">ข้อมูลของคุณ</h2>
                     <p className="text-slate-500 text-sm mb-4">ดาวน์โหลดข้อมูลรายการทั้งหมดของคุณเก็บไว้เป็นไฟล์ CSV</p>
                     <button className="border border-slate-200 text-slate-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition flex items-center gap-2"><Download size={18}/> Export CSV</button>
                 </div>
                 
                 <hr className="border-slate-100"/>
                 
                 {/* Danger Zone */}
                 <div>
                     <h2 className="text-lg font-bold text-red-600 mb-2">ลบบัญชีผู้ใช้ (Danger Zone)</h2>
                     <p className="text-slate-500 text-sm mb-4">เมื่อลบบัญชี ข้อมูลทั้งหมดจะถูกลบถาวรและไม่สามารถกู้คืนได้ โปรดระวัง</p>
-                    <button onClick={() => alert("ระบบกำลังพัฒนา")} className="bg-red-50 text-red-600 border border-red-100 px-6 py-3 rounded-xl font-bold hover:bg-red-100 transition flex items-center gap-2"><Trash2 size={18}/> ลบบัญชีถาวร</button>
+                    <Button variant="danger" onClick={() => alert("ระบบกำลังพัฒนา")}><Trash2 size={18}/> ลบบัญชีถาวร</Button>
                 </div>
             </div>
         )}
      </Card>
      </div>
     </div>
   );
 }
