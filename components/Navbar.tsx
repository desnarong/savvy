// components/Navbar.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Wallet, History, LogOut, Settings, LogIn, UserPlus, Crown, ShieldCheck } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const appMenuItems = [
    { name: "ภาพรวม", href: "/", icon: LayoutDashboard },
    { name: "ตั้งงบ", href: "/budgets", icon: Wallet },
    { name: "ประวัติ", href: "/history", icon: History },
    { name: "ตั้งค่า", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Desktop Topbar */}
      <nav className="hidden md:flex items-center justify-between px-8 py-4 bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 transition-all">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200/50 transform group-hover:-rotate-6 transition duration-300">S</div>
            <div className="flex flex-col leading-none -space-y-0.5">
                <span className="font-bold text-slate-900 text-lg tracking-tight">Savvy</span>
                <span className="text-blue-600 font-bold text-sm tracking-wide">รู้ตังค์</span>
            </div>
        </Link>
        
        {status === "loading" && <div className="w-20 h-8 bg-slate-100 rounded-full animate-pulse"></div>}

        {status === "authenticated" && (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-full border border-slate-100">
              {appMenuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 flex items-center gap-2 ${isActive ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}>
                    <item.icon size={16} /> <span className="hidden lg:inline">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Admin Button */}
            {(session?.user as any)?.role === 'ADMIN' && (
                <Link href="/admin" className="px-4 py-2 rounded-full text-sm font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 flex items-center gap-2 transition shadow-sm hover:shadow-md">
                    <ShieldCheck size={16} /> <span className="hidden lg:inline">Admin</span>
                </Link>
            )}

            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                <div className="text-right hidden xl:block">
                    <div className="flex items-center justify-end gap-1.5">
                        <span className="text-sm font-bold text-slate-700 leading-tight">{session?.user?.name || "ผู้ใช้งาน"}</span>
                        {(session?.user as any)?.plan === 'PRO' ? (
                           <span className="bg-amber-100 text-amber-700 text-[9px] px-1.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-0.5 font-bold"><Crown size={8} fill="currentColor"/> PRO</span>
                        ) : (
                           <span className="bg-slate-100 text-slate-500 text-[9px] px-1.5 py-0.5 rounded-full border border-slate-200 font-bold">FREE</span>
                        )}
                    </div>
                    <p className="text-[10px] font-medium text-slate-400">{session?.user?.email}</p>
                </div>
                <div className="relative group">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                        {session?.user?.image ? <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" /> : <span className="text-blue-600 font-bold text-lg">{(session?.user?.email?.[0] || "U").toUpperCase()}</span>}
                    </div>
                </div>
                <button onClick={() => signOut({ callbackUrl: '/login' })} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition border border-transparent hover:border-red-100" title="ออกจากระบบ"><LogOut size={20} /></button>
            </div>
          </div>
        )}

        {status === "unauthenticated" && (
           <div className="flex items-center gap-4">
              <Link href="/login" className="text-slate-500 font-bold text-sm hover:text-blue-600 transition">เข้าสู่ระบบ</Link>
              <Link href="/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center gap-2 hover:scale-105 active:scale-95">สมัครฟรี <UserPlus size={18}/></Link>
           </div>
        )}
      </nav>

      {/* Mobile Bottom Dock */}
      {status === "authenticated" && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50 pb-safe shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]">
          {appMenuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 transition-all ${isActive ? "text-blue-600 scale-105" : "text-slate-400"}`}>
                <div className={`p-2 rounded-2xl transition ${isActive ? "bg-blue-50" : ""}`}><item.icon size={24} strokeWidth={isActive ? 2.5 : 2} /></div>
                <span className="text-[10px] font-bold">{item.name}</span>
              </Link>
            )
          })}
          {(session?.user as any)?.role === 'ADMIN' && (
             <Link href="/admin" className="flex flex-col items-center gap-1 text-purple-500">
                <div className="p-2"><ShieldCheck size={24} strokeWidth={2} /></div><span className="text-[10px] font-bold">Admin</span>
             </Link>
          )}
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="flex flex-col items-center gap-1 text-slate-300 hover:text-red-500 transition"><div className="p-2"><LogOut size={24} strokeWidth={2} /></div><span className="text-[10px] font-bold">ออก</span></button>
        </nav>
      )}
    </>
  );
}