import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    const url = process.env.DATABASE_URL;
    if (!url) {
        console.error("❌ CRITICAL: DATABASE_URL is missing in process.env");
    } else {
        console.log(`✅ Prisma Bridge: Injecting URL (Length: ${url.trim().length} chars)`);
    }
    
    // Explicitly pass the URL to ensure all build workers receive the connection string
    return new PrismaClient({
        datasources: {
            db: {
                url: url?.trim()
            }
        }
    } as any);
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
