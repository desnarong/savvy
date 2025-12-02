// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Users, Search, Edit, Trash2, X, Save, Crown, User as UserIcon, CreditCard, Plus, Star, Settings, ToggleLeft, ToggleRight } from "lucide-react";

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
      <div className="max-w-7xl mx-auto space-y-6">
        
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2"><ShieldCheck size={32} className="text-blue-600"/> Admin Control Panel</h1>

        {/* Tab Menu */}
        <div className="flex gap-2 border-b border-slate-300 overflow-x-auto">
            <button onClick={() => setActiveTab("users")} className={`px-6 py-3 font-bold rounded-t-xl transition flex items-center gap-2 ${activeTab === "users" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:bg-white/50"}`}><Users size={18}/> จัดการผู้ใช้</button>
            <button onClick={() => setActiveTab("plans")} className={`px-6 py-3 font-bold rounded-t-xl transition flex items-center gap-2 ${activeTab === "plans" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:bg-white/50"}`}><CreditCard size={18}/> แพ็กเกจราคา</button>
            <button onClick={() => setActiveTab("system")} className={`px-6 py-3 font-bold rounded-t-xl transition flex items-center gap-2 ${activeTab === "system" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:bg-white/50"}`}><Settings size={18}/> ตั้งค่าระบบ</button>
        </div>

        {/* Tab 1: Users */}
        {activeTab === "users" && (
            <div className="bg-white rounded-b-3xl rounded-tr-3xl p-6 shadow-sm border border-slate-200">
                <div className="flex justify-between mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                        <input type="text" placeholder="ค้นหาผู้ใช้..." className="pl-10 p-2 border rounded-xl w-64 focus:ring-2 focus:ring-blue-500 outline-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
                    </div>
                    <div className="text-sm text-slate-500 font-bold self-center">รวม: {users.length} คน</div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b">
                            <tr><th className="p-4 text-sm font-bold text-slate-500">User</th><th className="p-4 text-sm font-bold text-slate-500 text-center">Role</th><th className="p-4 text-sm font-bold text-slate-500 text-center">Plan</th><th className="p-4 text-sm font-bold text-slate-500 text-right">Action</th></tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredUsers.map(u => (
                                <tr key={u.id} className="hover:bg-slate-50">
                                    <td className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold overflow-hidden">{u.image ? <img src={u.image} className="w-full h-full object-cover"/> : u.email[0].toUpperCase()}</div><div><div className="font-bold text-slate-800">{u.name || "ไม่ระบุชื่อ"}</div><div className="text-xs text-slate-500">{u.email}</div></div></div></td>
                                    <td className="p-4 text-center"><span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>{u.role}</span></td>
                                    <td className="p-4 text-center"><span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center justify-center gap-1 w-fit mx-auto ${u.plan === 'PRO' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>{u.plan === 'PRO' && <Crown size={12} fill="currentColor"/>}{u.plan}</span></td>
                                    <td className="p-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => setEditingUser(u)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit size={18} /></button><button onClick={() => handleDeleteUser(u.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button></div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* Tab 2: Plans */}
        {activeTab === "plans" && (
            <div className="bg-white rounded-b-3xl rounded-tr-3xl p-6 shadow-sm border border-slate-200">
                <div className="flex justify-between mb-6">
                    <h3 className="font-bold text-lg text-slate-800">รายการแพ็กเกจทั้งหมด</h3>
                    <button onClick={() => setEditingPlan({ name: "", price: 59, days: 30, isRecommended: false })} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200"><Plus size={18}/> เพิ่มแพ็กเกจใหม่</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {plans.map(p => (
                        <div key={p.id} className="border border-slate-200 rounded-2xl p-5 relative hover:shadow-md transition bg-slate-50 group">
                            {p.isRecommended && <div className="absolute top-3 right-3 text-amber-500 bg-amber-50 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1"><Star size={12} fill="currentColor"/> แนะนำ</div>}
                            <h4 className="font-bold text-xl text-slate-800">{p.name}</h4>
                            <div className="text-3xl font-extrabold text-blue-600 my-2">฿{p.price}</div>
                            <p className="text-sm text-slate-500 mb-4">ระยะเวลาใช้งาน: <span className="font-bold text-slate-700">{p.days}</span> วัน</p>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setEditingPlan(p)} className="flex-1 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold hover:bg-slate-100 text-slate-600">แก้ไข</button>
                                <button onClick={() => handleDeletePlan(p.id)} className="p-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50"><Trash2 size={18}/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Tab 3: System Config (NEW!) */}
        {activeTab === "system" && (
            <div className="bg-white rounded-b-3xl rounded-tr-3xl p-8 shadow-sm border border-slate-200 max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-bold text-xl text-slate-800">ตั้งค่าระบบกลาง</h3>
                        <p className="text-sm text-slate-500">ปรับเปลี่ยนการทำงานของเว็บไซต์ได้ทันที</p>
                    </div>
                    <button onClick={handleSaveConfig} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition shadow-lg shadow-slate-300"><Save size={18}/> บันทึกการตั้งค่า</button>
                </div>
                
                <div className="space-y-6">
                    {configs.map((config) => {
                        const isBoolean = config.value === 'true' || config.value === 'false';
                        return (
                            <div key={config.key} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition">
                                <div className="flex-1">
                                    <label className="font-bold text-slate-700 block mb-1">
                                        {CONFIG_LABELS[config.key] || config.key}
                                    </label>
                                    <p className="text-xs text-slate-400 font-mono">{config.key}</p>
                                </div>
                                <div className="w-full md:w-auto">
                                    {isBoolean ? (
                                        <button 
                                            onClick={() => handleConfigChange(config.key, config.value === 'true' ? 'false' : 'true')}
                                            className={`relative w-14 h-8 rounded-full transition-colors duration-300 flex items-center px-1 ${config.value === 'true' ? 'bg-green-500' : 'bg-slate-300'}`}
                                        >
                                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${config.value === 'true' ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </button>
                                    ) : (
                                        <input 
                                            type="text" 
                                            className="w-full md:w-80 p-3 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={config.value}
                                            onChange={(e) => handleConfigChange(config.key, e.target.value)}
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}

        {/* Modals (User & Plan) - คงเดิมจาก Step ก่อนหน้า */}
        {editingUser && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="bg-white p-6 rounded-3xl w-full max-w-sm space-y-6 shadow-2xl">
                    <div className="flex justify-between items-center"><h3 className="font-bold text-lg text-slate-800">แก้ไขผู้ใช้</h3><button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button></div>
                    <div className="space-y-4">
                        <div><label className="block text-xs font-bold text-slate-400 uppercase mb-2">บทบาท (Role)</label><div className="grid grid-cols-2 gap-2"><button onClick={() => setEditingUser({...editingUser, role: 'USER'})} className={`p-3 rounded-xl border text-sm font-bold transition flex items-center justify-center gap-2 ${editingUser.role === 'USER' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200'}`}><UserIcon size={16}/> USER</button><button onClick={() => setEditingUser({...editingUser, role: 'ADMIN'})} className={`p-3 rounded-xl border text-sm font-bold transition flex items-center justify-center gap-2 ${editingUser.role === 'ADMIN' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-500 border-slate-200'}`}><ShieldCheck size={16}/> ADMIN</button></div></div>
                        <div><label className="block text-xs font-bold text-slate-400 uppercase mb-2">แพ็กเกจ (Plan)</label><div className="grid grid-cols-2 gap-2"><button onClick={() => setEditingUser({...editingUser, plan: 'FREE'})} className={`p-3 rounded-xl border text-sm font-bold transition ${editingUser.plan === 'FREE' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-slate-500 border-slate-200'}`}>FREE</button><button onClick={() => setEditingUser({...editingUser, plan: 'PRO'})} className={`p-3 rounded-xl border text-sm font-bold transition flex items-center justify-center gap-2 ${editingUser.plan === 'PRO' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-500 border-slate-200'}`}><Crown size={16} fill="currentColor"/> PRO</button></div></div>
                    </div>
                    <button onClick={handleUpdateUser} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition">บันทึกการเปลี่ยนแปลง</button>
                </div>
            </div>
        )}

        {editingPlan && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
                    <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-lg text-slate-800">{editingPlan.id ? "แก้ไขแพ็กเกจ" : "เพิ่มแพ็กเกจใหม่"}</h3><button onClick={() => setEditingPlan(null)}><X size={24} className="text-slate-400 hover:text-slate-600"/></button></div>
                    <div className="space-y-4">
                        <div><label className="text-xs font-bold text-slate-400 uppercase mb-1 block">ชื่อแพ็กเกจ</label><input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="เช่น รายปี สุดคุ้ม" value={editingPlan.name} onChange={e => setEditingPlan({...editingPlan, name: e.target.value})} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-xs font-bold text-slate-400 uppercase mb-1 block">ราคา (บาท)</label><input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none" value={editingPlan.price} onChange={e => setEditingPlan({...editingPlan, price: e.target.value})} /></div>
                            <div><label className="text-xs font-bold text-slate-400 uppercase mb-1 block">จำนวนวัน</label><input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none" value={editingPlan.days} onChange={e => setEditingPlan({...editingPlan, days: e.target.value})} /></div>
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer bg-slate-50 p-4 rounded-xl border border-slate-200 hover:bg-slate-100 transition"><input type="checkbox" className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" checked={editingPlan.isRecommended} onChange={e => setEditingPlan({...editingPlan, isRecommended: e.target.checked})} /><span className="text-sm font-bold text-slate-700 flex items-center gap-2"><Star size={16} className={editingPlan.isRecommended ? "text-amber-500 fill-amber-500" : "text-slate-400"}/> ตั้งเป็นแพ็กเกจแนะนำ</span></label>
                        <button onClick={handleSavePlan} className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 mt-2">บันทึกข้อมูล</button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}
