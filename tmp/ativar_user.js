const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'rodrigoamac@gmail.com';
    console.log(`Ativando manualmente o usuário: ${email}`);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.log("❌ Usuário não encontrado!");
        return;
    }

    await prisma.user.update({
        where: { id: user.id },
        data: { 
            emailVerified: true,
            verificationToken: null
        }
    });

    console.log("✅ Usuário ATIVADO com sucesso! Tente fazer login agora.");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
