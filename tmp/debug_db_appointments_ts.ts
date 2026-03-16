import prisma from '../lib/prisma';

async function main() {
    try {
        const clients = await prisma.user.findMany({ where: { role: 'BUSINESS' } });
        const businessUser = clients[0];
        if (!businessUser) {
            console.log("Nenhum usuario BUSINESS encontrado.");
            return;
        }

        const company = await prisma.company.findFirst({ where: { userId: businessUser.id } });
        if (!company) {
            console.log("Nenhuma empresa encontrada.");
            return;
        }

        const appointments = await prisma.appointment.findMany({
            where: { companyId: company.id },
            orderBy: { date: 'asc' }
        });

        console.log(`Empresa: ${company.name}`);
        appointments.forEach((a: any) => {
            console.log(`- ID: ${a.id} | Titulo: ${a.title} | Data: ${a.date.toISOString()} | Status: ${a.status}`);
        });

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
