const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("=== WHATSAPP MESSAGES ===");
    const messages = await prisma.whatsappMessage.findMany({
        orderBy: { timestamp: 'desc' },
        take: 5,
        select: { senderNum: true, senderName: true, content: true }
    });
    console.log(JSON.stringify(messages, null, 2));

    console.log("=== USERS (Paginados ou Recentes) ===");
    const users = await prisma.user.findMany({
        where: { name: { contains: 'Rodrigo' } },
        select: { id: true, name: true, phone: true }
    });
    console.log(JSON.stringify(users, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
