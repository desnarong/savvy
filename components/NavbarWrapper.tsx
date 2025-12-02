// components/NavbarWrapper.tsx
"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  // ซ่อน Navbar ในหน้า login และ register
  if (pathname === "/login" || pathname === "/register") return null;
  return <Navbar />;
}
