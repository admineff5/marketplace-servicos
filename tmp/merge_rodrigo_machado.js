const fs = require('fs');
const env = fs.readFileSync('c:/Antigravity/.env', 'utf-8');
env.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length === 2) {
        process.env[parts[0].trim()] = parts[1].replace(/"/g, '').trim();
    }
});

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Iniciando Migração de Cliente Duplicado...");

    // 1. Achar o cliente Verdadeiro (Pelo e-mail original ou buscando por rodrigoamac@gmail.com)
    const trueClient = await prisma.user.findFirst({
        where: { email: 'rodrigoamac@gmail.com' } // E-mail garantido do print 4!
    });

    // 2. Achar o cliente Duplicado (Pelo número misterioso)
    const duplicateClient = await prisma.user.findFirst({
        where: { phone: '20505111720572' }
    });

    if (trueClient && duplicateClient) {
        console.log(`✅ Cliente Verdadeiro: ${trueClient.name} (ID: ${trueClient.id})`);
        console.log(`⚠️ Cliente Duplicado: ${duplicateClient.name} (ID: ${duplicateClient.id})`);

        // 3. Migrar Agendamentos
        const agendamentos = await prisma.appointment.updateMany({
            where: { userId: duplicateClient.id },
            data: { userId: trueClient.id }
        });
        console.log(`✅ [${agendamentos.count}] agendamentos migrados!`);

        // 4. Deletar Duplicado
        await prisma.user.delete({ where: { id: duplicateClient.id } });
        console.log(`✅ Cliente duplicado deletado!`);

        // 5. Vincular número do whats no perfil principal
        await prisma.user.update({
            where: { id: trueClient.id },
            data: { phone: '20505111720572' }
        });
        console.log(`✅ Número do WhatsApp vinculado ao Perfil Principal!`);
    } else {
        console.log("❌ Não foi possível encontrar os dois perfis para mesclagem.");
        console.log("Verdadeiro encontrado:", !!trueClient);
        console.log("Duplicado encontrado:", !!duplicateClient);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
