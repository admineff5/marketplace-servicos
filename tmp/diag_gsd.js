const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("=== DIAGNÓSTICO GSD / WHATSAPP ===");
    
    // 1. Verificar sessões do WhatsApp
    const sessions = await prisma.whatsappSession.findMany();
    console.log("\n--- SESSÕES ---");
    if (sessions.length === 0) console.log("Nenhuma sessão encontrada.");
    sessions.forEach(s => {
        console.log(`CompanyId: ${s.companyId} | Status: ${s.status} | Number: ${s.number}`);
    });

    // 2. Verificar fila de mensagens
    const queue = await prisma.whatsappQueue.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' }
    });
    console.log("\n--- FILA DE MENSAGENS (Últimas 10) ---");
    if (queue.length === 0) console.log("Fila vazia.");
    queue.forEach(q => {
        console.log(`ID: ${q.id} | Phone: ${q.phone} | Status: ${q.status} | Attempts: ${q.attempts} | Error: ${q.error || 'Nenhum'}`);
    });

    // 3. Verificar usuário de teste
    const user = await prisma.user.findFirst({
        where: { email: 'rodrigoamac@gmail.com' }
    });
    console.log("\n--- USUÁRIO TESTE ---");
    if (user) {
        console.log(`Nome: ${user.name} | Phone: ${user.phone} | Verified: ${user.emailVerified} | Token: ${user.verificationToken}`);
    } else {
        console.log("Usuário não encontrado.");
    }

    console.log("\n=== FIM DO DIAGNÓSTICO ===");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
