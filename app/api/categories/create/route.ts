// app/api/categories/create/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getIntConfig } from '@/lib/config'; // Import Helper

export async function POST(request: Request) {
  try {
    const { email, name, icon } = await request.json();
    
    const user = await prisma.user.findUnique({ 
        where: { email },
        include: { categories: true } 
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // --- 🔒 Logic จำกัดสิทธิ์ (Dynamic) ---
    const isPro = user.plan === 'PRO';
    const categoryCount = user.categories.length;
    
    // ดึงค่า Limit จาก Config (Default 5)
    const limit = await getIntConfig('FREE_CATEGORY_LIMIT', 5);

    if (!isPro && categoryCount >= limit) {
        return NextResponse.json({ 
            error: 'LIMIT_REACHED', 
            message: `ผู้ใช้ Free สร้างได้สูงสุด ${limit} หมวดหมู่` 
        }, { status: 403 });
    }
    // ------------------------------------

    const category = await prisma.category.create({
      data: { name, icon: icon || 'other', type: 'EXPENSE', userId: user.id }
    });

    return NextResponse.json(category);

  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
