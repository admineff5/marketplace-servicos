const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const sessions = await prisma.whatsappSession.findMany();
    console.log("SESSIONS:");
    for (const s of sessions) {
        const updatedAtTime = new Date(s.updatedAt).getTime();
        const now = Date.now();
        const diffMinutes = (now - updatedAtTime) / 1000 / 60;
        console.log({
            companyId: s.companyId,
            status: s.status,
            updatedAt: s.updatedAt,
            hasQr: !!s.qrCode,
            diffMinutes
        });
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
