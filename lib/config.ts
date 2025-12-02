// lib/config.ts
import { prisma } from "@/lib/prisma";

export async function getConfig(key: string, defaultValue: string = "") {
  const config = await prisma.systemConfig.findUnique({ where: { key } });
  return config?.value || defaultValue;
}

export async function getIntConfig(key: string, defaultValue: number = 0) {
  const val = await getConfig(key);
  return val ? parseInt(val) : defaultValue;
}

export async function getBoolConfig(key: string, defaultValue: boolean = false) {
  const val = await getConfig(key);
  return val === 'true';
}
