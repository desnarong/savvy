import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
        
        {/* Copyright */}
        <p>© {currentYear} Savvy รู้ตังค์. All rights reserved.</p>

        {/* Links */}
        <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">
              นโยบายความเป็นส่วนตัว
            </Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">
              ข้อตกลงการใช้งาน
            </Link>
        </div>
      </div>
    </footer>
  );
}
