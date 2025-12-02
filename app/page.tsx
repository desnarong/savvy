// app/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, X, Wallet, TrendingUp, TrendingDown, Shield, ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, BarChart, Bar, ResponsiveContainer, YAxis, Legend, XAxis, CartesianGrid } from 'recharts';
import { CategoryIcon } from "@/components/IconPicker";
import Card from "@/components/Card";
import Button from "@/components/Button";

// --- Components ---

// หน้า Landing Page (สำหรับคนยังไม่ Login)
const LandingPage = () => (
  <div className="min-h-screen bg-white font-sans text-slate-900">
    
    {/* ❌ ลบ Navbar ตรงนี้ออกแล้ว (ใช้ Navbar หลักแทน) */}

    {/* Hero Section */}
    <header className="px-6 pt-16 md:pt-24 pb-20 text-center max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold shadow-sm border border-blue-100">
        <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span></span>
        แอปจัดการเงินอันดับ 1 สำหรับคนรุ่นใหม่
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
        รู้ทุกบาท <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">จัดการทุกสตางค์</span><br/> อย่างชาญฉลาด
      </h1>
      <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
        เลิกงงว่าเงินหายไปไหน <strong>Savvy รู้ตังค์</strong> ช่วยคุณตั้งงบประมาณ จดบันทึก และวิเคราะห์พฤติกรรมการใช้จ่ายได้ในที่เดียว ง่าย สวย และปลอดภัย
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
         <Link href="/register" className="px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
            เริ่มใช้งานฟรี <ArrowRight size={20}/>
         </Link>
         {/* ปุ่มดูตัวอย่าง (Login) ถ้าอยากให้ลองกด */}
         {/* <Link href="/login" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 font-bold text-lg rounded-2xl hover:bg-slate-50 transition flex items-center justify-center">เข้าสู่ระบบ</Link> */}
      </div>
    </header>

    {/* Feature Highlights */}
    <section className="bg-slate-50 py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><Wallet size={28}/></div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">ตั้งงบประมาณได้ดั่งใจ</h3>
            <p className="text-slate-500 leading-relaxed">กำหนดวงเงินสำหรับค่าอาหาร ค่าเดินทาง หรือค่าช้อปปิ้ง ระบบจะช่วยเตือนเมื่อคุณใช้จ่ายใกล้เกินงบ</p>
         </div>
         <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><TrendingUp size={28}/></div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">กราฟสวย เข้าใจง่าย</h3>
            <p className="text-slate-500 leading-relaxed">ไม่ต้องปวดหัวกับตัวเลข ดูสรุปยอดผ่าน Dashboard ที่ออกแบบมาให้อ่านง่ายที่สุดใน 3 วินาที</p>
         </div>
         <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300">
            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><Shield size={28}/></div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">ข้อมูลปลอดภัย 100%</h3>
            <p className="text-slate-500 leading-relaxed">ข้อมูลของคุณเป็นความลับ เราใช้มาตรฐานความปลอดภัยระดับสากล ไม่มีการนำข้อมูลไปขายต่อ</p>
         </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="py-12 text-center text-slate-400 text-sm bg-white border-t border-slate-100">
       <p>© 2025 Savvy รู้ตังค์. All rights reserved.</p>
    </footer>
  </div>
);

// --- Main Dashboard Logic ---
const COLORS = ['#2563EB', '#0EA5E9', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function Page() {
  const { data: session, status } = useSession();
  if (status === "unauthenticated") return <LandingPage />;
  return <DashboardLogic session={session} status={status} />;
}

// แยก Logic Dashboard ออกมาเพื่อให้ Code อ่านง่าย
function DashboardLogic({ session, status }: any) {
  const [data, setData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ amount: "", categoryId: "", note: "", date: new Date().toISOString().split('T')[0] });

  const fetchDashboard = useCallback(async () => {
    if (!session?.user?.email) return;
    setLoading(true);
    const res = await fetch(`/api/dashboard?email=${session.user.email}`);
    const json = await res.json();
    setData(json.data || []);
    setLoading(false);
  }, [session?.user?.email]);

  const fetchCategories = useCallback(async () => {
    if (!session?.user?.email) return;
    const res = await fetch(`/api/categories?email=${session.user.email}`);
    const json = await res.json();
    setCategories(json);
    if (json.length > 0) setForm(f => ({ ...f, categoryId: json[0].id }));
  }, [session?.user?.email]);

  useEffect(() => {
    if (status === "authenticated") { fetchDashboard(); fetchCategories(); }
  }, [status, fetchDashboard, fetchCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.categoryId) return;
    try {
      await fetch("/api/transactions", {
        method: "POST",
        body: JSON.stringify({ email: session?.user?.email, ...form }),
      });
      setIsModalOpen(false);
      setForm(prev => ({ ...prev, amount: "", note: "" }));
      fetchDashboard(); 
    } catch (error) { alert("เกิดข้อผิดพลาด"); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-blue-500 font-bold">Loading your finance...</div>;

  const totalBudget = data.reduce((acc, item) => acc + item.budget, 0);
  const totalActual = data.reduce((acc, item) => acc + item.actual, 0);
  const remaining = totalBudget - totalActual;
  const pieData = data.filter(d => d.actual > 0).map(d => ({ name: d.categoryName, value: d.actual }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="container">
       {/* Hero */}
      <Card className="p-6 mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">ภาพรวมรายจ่าย</h1>
          <p className="text-sm text-neutral-500 mt-1">สวัสดี, {session?.user?.email}</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={<Plus size={18}/>}>จดรายจ่าย</Button>
      </Card>
      </div>
     {/* Cards */}
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-36 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-6 opacity-5 transition transform duration-500">
               <Wallet size={80} className="text-primary-200"/>
           </div>
           <div className="flex items-center gap-3 text-slate-500 text-sm font-bold uppercase tracking-wider">
              <div className="p-2 bg-slate-50 text-slate-600 rounded-xl"><Wallet size={18}/></div> งบทั้งหมด
           </div>
           <div className="text-3xl font-bold text-slate-800">฿{totalBudget.toLocaleString()}</div>
         </div>

         <div className="bg-blue-600 p-6 rounded-3xl shadow-xl shadow-blue-200 flex flex-col justify-between h-36 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition transform group-hover:scale-110 duration-500">
                <TrendingUp size={80} />
            </div>
            <div className="flex items-center gap-3 text-blue-100 text-sm font-bold uppercase tracking-wider">
               <div className="p-2 bg-white/20 rounded-xl"><TrendingUp size={18}/></div> ใช้ไปแล้ว
            </div>
            <div className="text-4xl font-bold">฿{totalActual.toLocaleString()}</div>
         </div>

         <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-36 relative overflow-hidden">
            <div className="flex items-center gap-3 text-slate-500 text-sm font-bold uppercase tracking-wider">
               <div className={`p-2 rounded-xl ${remaining < 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                 <TrendingDown size={18}/>
               </div> คงเหลือ
            </div>
            <div className={`text-3xl font-bold ${remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
               ฿{remaining.toLocaleString()}
            </div>
         </div>
      </div>

      {data.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
             <div className="text-slate-300 mb-4 inline-block p-4 bg-slate-50 rounded-full"><Wallet size={48}/></div>
             <h3 className="text-lg font-bold text-slate-700">ยังไม่มีข้อมูลงบประมาณ</h3>
             <p className="text-slate-400 mb-6">เริ่มต้นด้วยการตั้งงบประมาณประจำเดือน</p>
             <Link href="/budgets" className="text-blue-600 font-bold hover:underline bg-blue-50 px-6 py-2 rounded-xl transition hover:bg-blue-100">ไปหน้าตั้งงบ</Link>
          </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                 <h3 className="font-bold text-slate-800 mb-6 text-lg">📊 สถิติการใช้จ่าย</h3>
                 <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={data} layout="vertical" margin={{left: 0, right: 20}} barGap={4}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                          <YAxis dataKey="categoryName" type="category" width={100} tick={{fontSize: 12, fill: '#64748b', fontWeight: 600}} axisLine={false} tickLine={false} />
                          <XAxis type="number" hide />
                          <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}} formatter={(value: number) => `฿${value.toLocaleString()}`} />
                          <Legend verticalAlign="top" height={36} iconType="circle" />
                          <Bar dataKey="budget" name="งบที่ตั้งไว้" fill="#cbd5e1" radius={[0, 4, 4, 0]} barSize={12} />
                          <Bar dataKey="actual" name="ใช้ไปแล้ว" fill="#2563EB" radius={[0, 4, 4, 0]} barSize={12} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {data.map((item, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition duration-200 group">
                       <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                             <div className="bg-blue-50 text-blue-600 p-3 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition duration-300">
                                <CategoryIcon iconName={item.icon} size={20} />
                             </div>
                             <div className="truncate max-w-[100px] sm:max-w-[120px]">
                                <h4 className="font-bold text-slate-700 text-sm truncate" title={item.categoryName}>{item.categoryName}</h4>
                                <div className="text-xs text-slate-400 mt-0.5 font-medium">{item.percent.toFixed(0)}%</div>
                             </div>
                          </div>
                          <span className={`px-2 py-1 text-[10px] font-bold rounded-lg ${item.status === 'OVER' ? 'bg-red-50 text-red-600' : item.status === 'WARNING' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                             {item.status}
                          </span>
                       </div>
                       <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
                          <div className={`h-full rounded-full transition-all duration-1000 ${item.status === 'OVER' ? 'bg-red-500' : item.status === 'WARNING' ? 'bg-orange-400' : 'bg-blue-500'}`} style={{width: `${Math.min(item.percent, 100)}%`}}></div>
                       </div>
                       <div className="flex justify-between text-xs font-medium">
                          <span className={`font-bold ${item.status === 'OVER' ? 'text-red-600' : 'text-slate-800'}`}>฿{item.actual.toLocaleString()}</span>
                          <span className="text-slate-400">/ ฿{item.budget.toLocaleString()}</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-fit">
              <h3 className="font-bold text-slate-800 mb-2 text-lg">🍰 สัดส่วนรายจ่าย</h3>
              <div className="h-64 flex items-center justify-center relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                       </Pie>
                       <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} formatter={(value: number) => `฿${value.toLocaleString()}`} />
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                    <span className="text-3xl font-bold text-slate-800">{pieData.length}</span>
                    <span className="text-xs text-slate-400 font-medium">หมวดหมู่</span>
                 </div>
              </div>
              <div className="space-y-4 mt-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                 {pieData.length === 0 ? <p className="text-center text-slate-400 text-sm py-4">ยังไม่มีรายจ่าย</p> : pieData.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full shadow-sm" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                          <span className="text-slate-600 font-medium truncate max-w-[100px]">{entry.name}</span>
                      </div>
                      <span className="font-bold text-slate-800">฿{entry.value.toLocaleString()}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-[100] transition-opacity">
           <div className="bg-white w-full max-w-md p-6 rounded-t-3xl sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold text-slate-800">จดรายจ่ายใหม่</h2>
                 <button onClick={() => setIsModalOpen(false)} className="bg-slate-100 p-2 rounded-full hover:bg-slate-200 text-slate-500 transition"><X size={20}/></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="text-xs font-bold text-slate-400 ml-1 mb-1 block uppercase">หมวดหมู่</label>
                    <select className="w-full p-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 appearance-none font-medium text-slate-700 outline-none" value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-400 ml-1 mb-1 block uppercase">จำนวนเงิน</label>
                    <input type="number" className="w-full p-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-2xl text-slate-800 outline-none placeholder:text-slate-300" placeholder="0.00" autoFocus value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <input type="date" className="w-full p-4 bg-slate-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-600" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                    <input type="text" className="w-full p-4 bg-slate-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" placeholder="Note..." value={form.note} onChange={e => setForm({...form, note: e.target.value})} />
                 </div>
                 <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 mt-2 active:scale-[0.98] transition">บันทึก</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
