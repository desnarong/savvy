# 1. Base Image
FROM node:20-alpine AS base

# 2. Dependencies
FROM base AS deps
WORKDIR /app
# ลง Dependencies ที่จำเป็นสำหรับ Alpine
RUN apk add --no-cache libc6-compat openssl

COPY package.json package-lock.json* ./
# ลงแบบครบชุด (รวม devDependencies) เพื่อให้มี ts-node และ prisma cli
RUN npm ci

# 3. Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# สร้าง Prisma Client
RUN npx prisma generate

# ปิด Telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Build Next.js
RUN npm run build

# 4. Runner (Production)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# ติดตั้ง OpenSSL (สำคัญมากสำหรับ Prisma)
RUN apk add --no-cache openssl

# Copy ไฟล์จาก Builder (แบบมาตรฐาน)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000
ENV PORT 3000

# ใช้ npm start แทน node server.js
CMD ["npm", "start"]
