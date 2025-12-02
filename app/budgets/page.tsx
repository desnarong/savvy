// app/budgets/page.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Copy, Pencil, X, Wallet, CheckCircle2 } from "lucide-react";
import { IconPicker, CategoryIcon, iconOptions } from "@/components/IconPicker";
// เพิ่ม UI imports
import Card from "@/components/Card";
import Button from "@/components/Button";
import Input from "@/components/Input";

type CategoryWithBudget = {
  id: string;
  name: string;
  icon?: string | null;
  currentBudget: number;
};

export default function BudgetPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [categories, setCategories] = useState<CategoryWithBudget[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState(iconOptions[0].name);
  const [editingCategory, setEditingCategory] = useState<CategoryWithBudget | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  
  // --- Config State ---
  const [freeLimit, setFreeLimit] = useState(5); // Default 5 เผื่อโหลดไม่ทัน

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const totalBudget = useMemo(() => {
    return categories.reduce((sum, item) => sum + (item.currentBudget || 0), 0);
  }, [categories]);

  const fetchData = useCallback(async () => {
    if (!session?.user?.email) return;
    
    const catRes = await fetch(`/api/categories?email=${session.user.email}`);
    const catData = await catRes.json();

    const dashboardRes = await fetch(`/api/dashboard?email=${session.user.email}`);
    const dashData = await dashboardRes.json();
    const budgets = dashData.data || [];

    const merged = catData.map((c: any) => {
        const found = budgets.find((b: any) => b.categoryName === c.name);
        return {
            id: c.id,
            name: c.name,
            icon: c.icon,
            currentBudget: found ? found.budget : 0
        };
    });

    setCategories(merged);
    setLoading(false);
  }, [session?.user?.email]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
        setLoading(true);
        fetchData();
        
        // --- ดึง Config: Free Limit ---
        fetch("/api/config/public")
            .then(res => res.json())
            .then(data => setFreeLimit(data.freeLimit));
    }
  }, [status, router, fetchData]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    const res = await fetch("/api/categories/create", {
      method: "POST",
      body: JSON.stringify({
        email: session?.user?.email,
        name: newCategoryName,
        icon: newCategoryIcon
      })
    });

    const data = await res.json();

    // 1. เช็ค Limit (ใช้ตัวแปร freeLimit จาก Config)
    if (res.status === 403 && data.error === 'LIMIT_REACHED') {
        if(confirm(`🔒 คุณใช้โควต้าฟรีครบ ${freeLimit} หมวดหมู่แล้ว! \n\nต้องการดูแพ็กเกจ Pro เพื่อปลดล็อกการใช้งานไม่จำกัดหรือไม่?`)) {
            router.push("/pricing");
        }
        return;
    }

    if (!res.ok) {
        alert(data.error || "เกิดข้อผิดพลาด");
        return;
    }

    setNewCategoryName("");
    setNewCategoryIcon(iconOptions[0].name);
    fetchData(); 
  };

  const handleSetBudget = async (categoryId: string, amount: number) => {
    setSavingId(categoryId);
    setCategories(prev => prev.map(c => c.id === categoryId ? { ...c, currentBudget: amount } : c));

    await fetch("/api/budgets/set", {
      method: "POST",
      body: JSON.stringify({
        email: session?.user?.email,
        categoryId,
        amount,
        month: currentMonth,
        year: currentYear
      })
    });
    
    setTimeout(() => setSavingId(null), 1000);
  };

  const handleCopy = async () => {
    if(!confirm(`ยืนยันการคัดลอกงบจากเดือนก่อนหน้า?`)) return;
    setLoading(true);
    const res = await fetch("/api/budgets/copy", {
        method: "POST",
        body: JSON.stringify({
          email: session?.user?.email,
          month: currentMonth,
          year: currentYear
        })
      });
      const data = await res.json();
      
      if(data.success) {
        alert(data.message);
        fetchData();
      } else {
        alert(data.message || data.error);
        setLoading(false);
      }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.name) return;

    await fetch("/api/categories/update", {
        method: "PUT",
        body: JSON.stringify({
            id: editingCategory.id,
            name: editingCategory.name,
            icon: editingCategory.icon
        })
    });
    setEditingCategory(null);
    fetchData();
  };

  if (loading && categories.length === 0) return (
    <div className="min-h-screen flex items-center justify-center text-blue-500 font-medium">
        Loading settings...
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="container">
       {/* Header & Total Budget Card */}
      <Card className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 mb-4">
        <div>
          <h1 className="text-2xl font-bold">จัดการงบประมาณ</h1>
          <p className="text-sm text-neutral-500 mt-1">ประจำเดือน {currentMonth}/{currentYear}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-neutral-500">งบรวมทั้งเดือน</span>
          <div className="text-3xl font-extrabold">฿{totalBudget.toLocaleString()}</div>
        </div>
      </Card>

      {/* Action Bar: Create & Copy */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create New Category */}
          <div className="lg:col-span-2">
            <Card className="p-6">
               <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2 text-lg">
                   <div className="w-1.5 h-6 bg-green-500 rounded-full"></div>
                   สร้างหมวดหมู่ใหม่
               </h3>
              <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-center">
                    <CategoryIcon iconName={newCategoryIcon} size={24}/>
                  </div>
                  <Input placeholder="ชื่อหมวด (เช่น ค่าคอนโด)" value={newCategoryName} onChange={(e)=>setNewCategoryName(e.target.value)} onKeyDown={(e)=> e.key==='Enter' && handleAddCategory()} />
                </div>
                   <div>
                     <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide ml-1">เลือกไอคอน</p>
                     <IconPicker selectedIcon={newCategoryIcon} onSelect={setNewCategoryIcon} />
                   </div>
                  
                <div className="flex justify-end mt-2">
                  <Button onClick={handleAddCategory} disabled={!newCategoryName}>+ เพิ่มหมวดหมู่</Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Copy Option */}
          <div>
            <Card className="p-6 flex flex-col items-center text-center gap-4">
              <div className="bg-white p-4 rounded-full text-blue-600 shadow-sm"><Copy size={28}/></div>
              <div>
                <h3 className="font-bold text-blue-900 text-lg">คัดลอกงบเดือนเก่า</h3>
                <p className="text-sm text-blue-600/80 mt-1">ดึงงบจากเดือนที่แล้วมาใช้ทันที</p>
              </div>
              <Button onClick={handleCopy} className="w-full">กดเพื่อคัดลอก</Button>
            </Card>
          </div>
       </div>

      {/* Budget List */}
      <Card className="overflow-hidden">
           <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
               <h3 className="font-bold text-slate-700 flex items-center gap-2">
                   <Wallet size={20} className="text-slate-400"/> รายการงบประมาณ
               </h3>
               <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">
                   {categories.length} หมวด
               </span>
           </div>
           <div className="divide-y divide-slate-100">
               {categories.length === 0 && (
                   <div className="p-10 text-center text-slate-400">ยังไม่มีหมวดหมู่ เริ่มสร้างด้านบนได้เลยครับ</div>
               )}
               {categories.map((cat) => (
                   <div key={cat.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition group">
                       <div className="flex items-center gap-4 flex-1">
                           <div className="bg-white border border-slate-100 p-3 rounded-2xl shadow-sm text-blue-600">
                               {/* ✅ ส่ง icon โดยมี null fallback */}
                               <CategoryIcon iconName={cat.icon || undefined} size={22} />
                           </div>
                           <div className="flex items-center gap-2">
                               <span className="font-bold text-slate-700 text-lg">{cat.name}</span>
                               <button onClick={() => setEditingCategory(cat)} className="text-slate-300 hover:text-blue-500 transition opacity-0 group-hover:opacity-100">
                                   <Pencil size={16} />
                               </button>
                           </div>
                       </div>
                       <div className="flex items-center gap-3 relative">
                           <span className="text-slate-300 font-bold hidden sm:inline">฿</span>
                           <div className="relative">
                               <input 
                                   type="number" 
                                   defaultValue={cat.currentBudget}
                                   onBlur={(e) => handleSetBudget(cat.id, parseFloat(e.target.value))}
                                   className="w-32 sm:w-40 p-3 bg-slate-50 border border-slate-200 rounded-xl text-right font-bold text-slate-800 outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                               />
                               <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-6">
                                   {savingId === cat.id && <CheckCircle2 size={20} className="text-green-500 animate-in zoom-in" />}
                               </div>
                           </div>
                       </div>
                   </div>
               ))}
           </div>
      </Card>
      </div>
     </div>
   );
 }
