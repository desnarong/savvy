# Savvy รู้ตังค์ - Personal Finance Manager

แอปพลิเคชันจัดการเงินส่วนตัวสำหรับคนรุ่นใหม่ ด้วยกราฟสวยงาม การวิเคราะห์รายจ่าย และการตั้งงบประมาณที่ง่ายต่อใจ

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15 (optional - ใช้ Docker)

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/desnarong/savvy.git
cd savvy

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
# แล้วแก้ไข .env.local ให้ตรงกับระบบของคุณ

# 4. Setup database
npx prisma db push
npx prisma db seed

# 5. Run development server
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

### Docker Deployment

```bash
# 1. Build and run
docker-compose up -d

# 2. Run migrations
docker exec savvy_app npx prisma db push
docker exec savvy_app npx prisma db seed

# 3. Access the app
# Open https://yourdomain.com (หรือ http://localhost ถ้า local)
```

## 📁 Project Structure
