// app/history/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Trash2, Pencil, FileText, X, Search, ChevronLeft, ChevronRight } from "lucide-react"; // เพิ่ม icon
import { CategoryIcon } from "@/components/IconPicker";

// Types
type Category = { id: string; name: string; icon?: string | null };
type Transaction = { id: string; amount: number; date: string; note: string; categoryId: string; category: Category };

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  // --- Pagination State ---
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch Data (รับ page เป็น parameter)
  const fetchData = useCallback(async (pageNum = 1) => {
    if (!session?.user?.email) return;
    setLoading(true);
    
    // ดึง history แบบมี page
    const histRes = await fetch(`/api/transactions/history?email=${session.user.email}&page=${pageNum}`);
    const histJson = await histRes.json();
    
    // ดึงหมวดหมู่ (เหมือนเดิม)
    const catRes = await fetch(`/api/categories?email=${session.user.email}`);
    const catJson = await catRes.json();

    // อัปเดต State
    setTransactions(histJson.data || []);
    setTotalPages(histJson.pagination?.totalPages || 1);
    setCategories(catJson);
    setLoading(false);
  }, [session?.user?.email]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") fetchData(page); // ส่ง page ปัจจุบันไป
  }, [status, router, fetchData, page]);

  // ฟังก์ชันเปลี่ยนหน้า
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      // fetchData จะทำงานเองเพราะ useEffect จับค่า page อยู่
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ลบรายการนี้?")) return;
    await fetch("/api/transactions/delete", { method: "POST", body: JSON.stringify({ id }) });
    fetchData(page); // รีเฟรชหน้าเดิม
  };

  const handleUpdate = async () => {
    if (!editingTx) return;
    await fetch("/api/transactions/update", {
        method: "PUT",
        body: JSON.stringify({
            id: editingTx.id,
            amount: editingTx.amount,
            date: editingTx.date,
            note: editingTx.note,
            categoryId: editingTx.categoryId
        })
    });
    setEditingTx(null); 
    fetchData(page);
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });

  if (loading && transactions.length === 0) return <div className="min-h-screen flex items-center justify-center text-blue-400 font-medium">Loading history...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-xl text-blue-600"><FileText size={24} /></div>
                ประวัติรายการ
            </h1>
            <p className="text-slate-500 text-sm mt-1 ml-1">หน้ารายการ {page} จาก {totalPages}</p>
          </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
          {transactions.length === 0 ? (
              <div className="p-16 text-center text-slate-400">
                  <Search size={48} className="mx-auto mb-4 text-slate-200" />
                  ไม่มีรายการในหน้านี้
              </div>
          ) : (
              <div className="divide-y divide-slate-100">
                  {transactions.map((tx) => (
                      <div key={tx.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition group">
                          {/* (ส่วนแสดงรายการเหมือนเดิม) */}
                          <div className="flex items-center gap-4 overflow-hidden">
                              <div className="flex flex-col items-center justify-center bg-slate-100 w-14 h-14 rounded-2xl text-slate-500 shrink-0 font-bold shadow-sm">
                                  <span className="text-sm">{formatDate(tx.date).split(' ')[0]}</span>
                                  <span className="text-[10px] uppercase tracking-wide opacity-70">{formatDate(tx.date).split(' ')[1]}</span>
                              </div>
                              <div className="bg-blue-50 text-blue-600 p-3 rounded-full shrink-0">
                                  <CategoryIcon iconName={tx.category.icon} size={18} />
                              </div>
                              <div className="truncate pr-4">
                                  <p className="font-bold text-slate-700 truncate text-base">{tx.category.name}</p>
                                  <p className="text-sm text-slate-400 truncate font-medium">{tx.note || "-"}</p>
                              </div>
                          </div>

                          <div className="flex items-center gap-4">
                              <span className="font-bold text-slate-800 text-lg hidden sm:block">
                                  -฿{tx.amount.toLocaleString()}
                              </span>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setEditingTx({ ...tx, date: new Date(tx.date).toISOString().split('T')[0] })} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"><Pencil size={18} /></button>
                                <button onClick={() => handleDelete(tx.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"><Trash2 size={18} /></button>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
            <button 
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
            >
                <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-bold text-slate-600">
                หน้า {page} / {totalPages}
            </span>
            <button 
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
            >
                <ChevronRight size={20} />
            </button>
        </div>
      )}

      {/* Edit Modal (เหมือนเดิม) */}
      {editingTx && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-lg text-slate-800">✏️ แก้ไขรายการ</h3><button onClick={() => setEditingTx(null)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full"><X size={20}/></button></div>
                  <div className="space-y-4">
                      <div><label className="block text-xs font-bold text-slate-400 ml-1 mb-1 uppercase">หมวดหมู่</label><select className="w-full p-4 bg-slate-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700" value={editingTx.categoryId} onChange={(e) => setEditingTx({...editingTx, categoryId: e.target.value})}>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                      <div><label className="block text-xs font-bold text-slate-400 ml-1 mb-1 uppercase">จำนวนเงิน</label><input type="number" className="w-full p-4 bg-slate-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-2xl text-slate-800" value={editingTx.amount} onChange={(e) => setEditingTx({...editingTx, amount: parseFloat(e.target.value)})} /></div>
                      <div className="grid grid-cols-2 gap-4"><input type="date" className="w-full p-4 bg-slate-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-600" value={editingTx.date} onChange={(e) => setEditingTx({...editingTx, date: e.target.value})} /><input type="text" className="w-full p-4 bg-slate-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" value={editingTx.note} onChange={(e) => setEditingTx({...editingTx, note: e.target.value})} /></div>
                      <button onClick={handleUpdate} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 mt-2 shadow-lg shadow-blue-200 active:scale-[0.98] transition">บันทึกการแก้ไข</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
