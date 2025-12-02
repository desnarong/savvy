import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Savvy รู้ตังค์ - ตัวช่วยจัดการเงินสำหรับคนรุ่นใหม่",
  description: "จดรายรับรายจ่ายง่ายๆ วิเคราะห์กราฟสวยงาม พร้อมวางแผนการเงินได้ในที่เดียว เริ่มต้นใช้งานฟรี!",
  metadataBase: new URL('https://savvyapp.cc'),
  openGraph: {
    title: "Savvy รู้ตังค์",
    description: "จัดการเงินง่ายๆ ในมือถือคุณ",
    url: 'https://savvyapp.cc',
    siteName: 'Savvy รู้ตังค์',
    locale: 'th_TH',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            {/* Navbar (จะซ่อนเองเมื่ออยู่หน้า Landing ผ่าน Navbar.tsx) */}
            <Navbar />
            <main className="flex-grow">
              <div className="container py-8">
                {children}
              </div>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
