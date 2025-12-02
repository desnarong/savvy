// components/Navbar.tsx
"use client";

import Link from "next/link";
import { Menu, X, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "./Button";

export default function Navbar() {
  const { status } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // ซ่อน Navbar บนหน้า Landing ถ้ายังไม่ล็อกอิน
  if (status !== "authenticated" && pathname === "/") {
    return null;
  }

  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-neutral-800 border-b border-neutral-100 dark:border-neutral-700">
      <div className="container flex items-center justify-between py-3">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl text-primary-600">
          Savvy 💰
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {status === "authenticated" ? (
            <>
              <Link
                href="/dashboard"
                className="text-neutral-600 hover:text-neutral-900"
              >
                Dashboard
              </Link>
              <Link
                href="/budgets"
                className="text-neutral-600 hover:text-neutral-900"
              >
                Budgets
              </Link>
              <Link
                href="/settings"
                className="text-neutral-600 hover:text-neutral-900"
              >
                Settings
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-2">
          {status === "authenticated" ? (
            <Button variant="ghost" onClick={() => signOut()}>
              <LogOut />
            </Button>
          ) : null}
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && status === "authenticated" && (
        <div className="md:hidden bg-neutral-50 p-3 space-y-2">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/budgets">Budgets</Link>
          <Link href="/settings">Settings</Link>
        </div>
      )}
    </nav>
  );
}