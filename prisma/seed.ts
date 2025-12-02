// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 1. สร้าง Admin (เหมือนเดิม)
  const hashedPassword = await bcrypt.hash('password123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: { role: 'ADMIN', plan: 'PRO' },
    create: {
      email: 'admin@admin.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'ADMIN',
      plan: 'PRO',
      image: 'https://ui-avatars.com/api/?name=Admin+Savvy&background=6366f1&color=fff'
    },
  })

  // 2. สร้างค่า Config เริ่มต้น (ส่วนที่เพิ่มมา)
  const configs = [
    { key: 'MAINTENANCE_MODE', value: 'false' },      // เปิดโหมดปิดปรับปรุง
    { key: 'ALLOW_REGISTER', value: 'true' },         // อนุญาตให้สมัครสมาชิก
    { key: 'ANNOUNCEMENT_ACTIVE', value: 'true' },    // เปิดแถบประกาศ
    { key: 'ANNOUNCEMENT_TEXT', value: 'ยินดีต้อนรับสู่ Savvy! เริ่มต้นวางแผนการเงินวันนี้' },
    { key: 'FREE_CATEGORY_LIMIT', value: '5' },       // จำกัดหมวดหมู่ Free
    { key: 'SUPPORT_CONTACT', value: 'support@savvy.com' } // อีเมลติดต่อ
  ];

  for (const config of configs) {
    await prisma.systemConfig.upsert({
      where: { key: config.key },
      update: {}, // ถ้ามีแล้วไม่ต้องแก้
      create: config,
    });
  }

  console.log("✅ Seed Data Created Successfully")
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
