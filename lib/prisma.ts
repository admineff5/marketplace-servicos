import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    const url = process.env.DATABASE_URL;
    if (!url) {
        console.error("❌ CRITICAL: DATABASE_URL is missing in process.env");
    } else {
        console.log("✅ Prisma: DATABASE_URL loaded from environment");
    }
    
    return new PrismaClient();
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
