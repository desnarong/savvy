// app/api/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // ดึงหมวดหมู่และงบประมาณเดือนนี้
    const categories = await prisma.category.findMany({
      where: { userId: user.id, type: "EXPENSE" }
    });

    const budgets = await prisma.budget.findMany({
      where: { userId: user.id, month: currentMonth, year: currentYear }
    });

    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id, date: { gte: new Date(currentYear, currentMonth - 1, 1) } }
    });

    // คำนวณข้อมูลสำหรับแต่ละหมวด
    const data = categories.map(cat => {
      // ✅ แปลง Decimal เป็น number
      const budget = Number(budgets.find(b => b.categoryId === cat.id)?.amount || 0);
      const actual = transactions
        .filter(t => t.categoryId === cat.id)
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      // ✅ ตอนนี้ budget เป็น number แล้ว
      const percent = budget > 0 ? (actual / budget) * 100 : 0;

      let status = "OK";
      if (actual > budget) status = "OVER";
      else if (actual > budget * 0.8) status = "WARNING";

      return {
        categoryId: cat.id,
        categoryName: cat.name,
        icon: cat.icon,
        budget: budget,
        actual: Number(actual),
        percent: Math.round(percent),
        status
      };
    });

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 });
  }
}
