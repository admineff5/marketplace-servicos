import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    return new PrismaClient();
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

export async function getCompanyByUserId(userId: string) {
    let company = await prisma.company.findUnique({
        where: { ownerId: userId }
    });

    if (!company) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user?.role === "BUSINESS") {
            company = await prisma.company.create({
                data: {
                    ownerId: userId,
                    name: `Empresa de ${user.name.split(' ')[0]}`,
                    niche: "Serviços",
                }
            });
            console.log(`[SYSTEM] Empresa auto-criada para usuário BUSINESS: ${userId}`);
        }
    }
    return company;
}

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
