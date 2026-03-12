import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    const url = process.env.DATABASE_URL;
    if (!url) {
        console.error("❌ CRITICAL: DATABASE_URL is missing in process.env");
    } else {
        console.log(`✅ Prisma: DATABASE_URL detected (Length: ${url.length} chars)`);
        if (url.includes('"')) {
            console.warn("⚠️ Warning: DATABASE_URL contains quotes, this might cause issues.");
        }
    }
    
    // Attempting to force the URL if detected but rejected by default constructor
    return new PrismaClient();
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
