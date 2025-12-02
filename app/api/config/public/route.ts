// app/api/config/public/route.ts
import { NextResponse } from 'next/server';
import { getBoolConfig, getIntConfig } from '@/lib/config';

export async function GET() {
  // ส่งเฉพาะค่าที่จำเป็นและปลอดภัยไปให้หน้าบ้าน
  return NextResponse.json({
    allowRegister: await getBoolConfig('ALLOW_REGISTER', true),
    freeLimit: await getIntConfig('FREE_CATEGORY_LIMIT', 5),
    maintenance: await getBoolConfig('MAINTENANCE_MODE', false),
  });
}
