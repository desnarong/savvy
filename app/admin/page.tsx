// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Users, Search, Edit, Trash2, X, Save, Crown, User as UserIcon, CreditCard, Plus, Star, Settings } from "lucide-react";
// ✅ new UI imports
import Card from "@/components/Card";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Badge from "@/components/Badge";

// Dictionary สำหรับแปลง Key ภาษาอังกฤษ เป็นภาษาไทยให้แอดมินเข้าใจง่าย
const CONFIG_LABELS: Record<string, string> = {
    MAINTENANCE_MODE: "โหมดปิดปรับปรุงระบบ (Maintenance)",
    ALLOW_REGISTER: "อนุญาตให้สมัครสมาชิกใหม่",
    ANNOUNCEMENT_ACTIVE: "แสดงแถบประกาศด้านบน",
    ANNOUNCEMENT_TEXT: "ข้อความประกาศ",
    FREE_CATEGORY_LIMIT: "จำกัดหมวดหมู่ (Free Plan)",
    SUPPORT_CONTACT: "ข้อมูลติดต่อ Support",
    PRO_PRICE: "ราคา Pro Plan (Backup)" // เผื่อยังมีตกค้าง
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("users");

  // Data States
  const [users, setUsers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [configs, setConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit States
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);

  // --- Fetch Data ---
  const fetchData = async () => {
    try {
        const [usersRes, plansRes, configsRes] = await Promise.all([
            fetch("/api/admin/users"),
            fetch("/api/admin/plans"),
            fetch("/api/admin/config") // <-- ดึง Config
        ]);
        
        setUsers(await usersRes.json());
        setPlans(await plansRes.json());
        setConfigs(await configsRes.json());
        setLoading(false);
    } catch (error) { console.error("Fetch error:", error); }
  };

  useEffect(() => {
    if (status === "authenticated") {
        if ((session?.user as any)?.role !== "ADMIN") router.push("/");
        else fetchData();
    } else if (status === "unauthenticated") router.push("/login");
  }, [status]);

  // --- Handlers: User ---
  const handleUpdateUser = async () => {
    if (!editingUser) return;
    await fetch("/api/admin/users/manage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingUser.id, role: editingUser.role, plan: editingUser.plan })
    });
    setEditingUser(null); fetchData();
  };
  const handleDeleteUser = async (id: string) => {
    if(confirm("ยืนยันลบผู้ใช้นี้?")) {
        await fetch(`/api/admin/users/manage?id=${id}`, { method: "DELETE" });
        fetchData();
    }
  };

  // --- Handlers: Plan ---
  const handleSavePlan = async () => {
    if (!editingPlan) return;
    const payload = { ...editingPlan, price: parseInt(editingPlan.price), days: parseInt(editingPlan.days) };
    const method = editingPlan.id ? "PUT" : "POST";
    
    await fetch("/api/admin/plans", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    setEditingPlan(null); fetchData();
  };
  const handleDeletePlan = async (id: string) => {
    if(confirm("ยืนยันลบแผนนี้?")) {
        await fetch(`/api/admin/plans?id=${id}`, { method: "DELETE" });
        fetchData();
    }
  };

  // --- Handlers: System Config ---
  const handleConfigChange = (key: string, value: string) => {
    setConfigs(prev => prev.map(c => c.key === key ? { ...c, value } : c));
  };

  const handleSaveConfig = async () => {
    if(!confirm("ยืนยันการบันทึกตั้งค่าระบบ?")) return;
    await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configs)
    });
    alert("บันทึกเรียบร้อย!");
    fetchData();
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-slate-400">Loading Dashboard...</div>;

  const filteredUsers = users.filter(u => u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10 font-sans">
      <div className="container space-y-6">
         
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2"><ShieldCheck size={32} className="text-primary-600"/> Admin Control Panel</h1>
 
         {/* Tab Menu */}
        <div className="flex gap-2 border-b border-slate-300 overflow-x-auto">
             <button onClick={() => setActiveTab("users")} className={`px-6 py-3 font-bold rounded-t-xl transition flex items-center gap-2 ${activeTab === "users" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:bg-white/50"}`}><Users size={18}/> จัดการผู้ใช้</button>
             <button onClick={() => setActiveTab("plans")} className={`px-6 py-3 font-bold rounded-t-xl transition flex items-center gap-2 ${activeTab === "plans" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:bg-white/50"}`}><CreditCard size={18}/> แพ็กเกจราคา</button>
             <button onClick={() => setActiveTab("system")} className={`px-6 py-3 font-bold rounded-t-xl transition flex items-center gap-2 ${activeTab === "system" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:bg-white/50"}`}><Settings size={18}/> ตั้งค่าระบบ</button>
         </div>
 
         {/* Tab 1: Users */}
         {activeTab === "users" && (
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Search className="text-neutral-400" size={18}/>
              <Input placeholder="ค้นหาผู้ใช้..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
              <div className="ml-auto"><Badge>{users.length} คน</Badge></div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-neutral-50 border-b">
                  <tr><th className="p-4 text-sm font-bold text-neutral-500">User</th><th className="p-4 text-sm font-bold text-neutral-500 text-center">Role</th><th className="p-4 text-sm font-bold text-neutral-500 text-center">Plan</th><th className="p-4 text-sm font-bold text-neutral-500 text-right">Action</th></tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-neutral-50">
                      <td className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden">{u.image ? <img src={u.image} className="w-full h-full object-cover"/> : u.email[0].toUpperCase()}</div><div><div className="font-bold text-neutral-800">{u.name || "ไม่ระบุชื่อ"}</div><div className="text-xs text-neutral-500">{u.email}</div></div></div></td>
                      <td className="p-4 text-center"><span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-neutral-100 text-neutral-600'}`}>{u.role}</span></td>
                      <td className="p-4 text-center"><span className={`px-3 py-1 rounded-full text-xs font-bold ${u.plan === 'PRO' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{u.plan}</span></td>
                      <td className="p-4 text-right"><div className="flex justify-end gap-2"><Button variant="secondary" size="sm" onClick={()=>setEditingUser(u)}><Edit size={16}/> แก้ไข</Button><Button variant="danger" size="sm" onClick={()=>handleDeleteUser(u.id)}><Trash2 size={16}/></Button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
 
         {/* Tab 2: Plans */}
         {activeTab === "plans" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">รายการแพ็กเกจทั้งหมด</h3>
                <Button onClick={()=>setEditingPlan({ name:"", price:59, days:30, isRecommended:false })} icon={<Plus size={16}/>}>เพิ่มแพ็กเกจใหม่</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plans.map(p => (
                  <Card key={p.id} className="p-5 relative">
                    {p.isRecommended && <Badge className="absolute top-3 right-3"><Star size={12}/> แนะนำ</Badge>}
                    <h4 className="font-bold text-xl">{p.name}</h4>
                    <div className="text-3xl font-extrabold text-primary-600 my-2">฿{p.price}</div>
                    <p className="text-sm text-neutral-500 mb-4">ระยะเวลาใช้งาน: <span className="font-bold text-neutral-700">{p.days}</span> วัน</p>
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={()=>setEditingPlan(p)}>แก้ไข</Button>
                      <Button variant="danger" onClick={()=>handleDeletePlan(p.id)}><Trash2/></Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
        )}
 
         {/* Tab 3: System Config (NEW!) */}
         {activeTab === "system" && (
            <Card className="p-6 max-w-4xl">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-xl">ตั้งค่าระบบกลาง</h3>
                  <p className="text-sm text-neutral-500">ปรับเปลี่ยนการทำงานของเว็บไซต์ได้ทันที</p>
                </div>
                <Button onClick={handleSaveConfig} icon={<Save/>}>บันทึก</Button>
              </div>
              <div className="space-y-3">
                {configs.map(c => {
                  const isBoolean = c.value==='true' || c.value==='false';
                  return (
                    <div key={c.key} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-2 border rounded">
                      <div className="flex-1">
                        <label className="font-bold block mb-1">{CONFIG_LABELS[c.key]||c.key}</label>
                        <p className="text-xs text-neutral-400 font-mono">{c.key}</p>
                      </div>
                      <div className="w-full md:w-auto">
                        {isBoolean ? <Button variant="ghost" onClick={() => handleConfigChange(c.key, c.value==='true'?'false':'true')}>{c.value==='true'?'ON':'OFF'}</Button> : <Input value={c.value} onChange={(e)=>handleConfigChange(c.key, e.target.value)} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
        )}
      </div>
    </div>
  );
}
