import { PrismaClient } from "@prisma/client";

// Next.js dev-módban újratölti a modulokat, ez megakadályozza,
// hogy minden újratöltésnél új adatbázis-kapcsolat nyíljon.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
