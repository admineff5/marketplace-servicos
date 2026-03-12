import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    if (!process.env.DATABASE_URL) {
        console.warn("⚠️ DATABASE_URL is not defined in the environment.");
    }
    return new PrismaClient();
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
