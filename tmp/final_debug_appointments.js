const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("=== DIAGNOSTICO DE AGENDAMENTOS ===");
    const appts = await prisma.appointment.findMany({
      include: {
        employee: { select: { name: true, companyId: true } },
        user: { select: { name: true } },
        company: { select: { id: true, name: true } }
      },
      orderBy: { date: 'asc' }
    });

    console.log(`Logando ${appts.length} agendamentos totais:`);
    appts.forEach(a => {
        if (a.user?.name === 'Olivia' || a.title?.includes('Olivia')) {
            console.log(`- CLIENTE: Olivia | Data: ${a.date.toISOString()} | Status: ${a.status} | Empresa: ${a.company?.name} (ID: ${a.companyId}) | Profis: ${a.employee?.name}`);
        }
    });

  } catch (e) {
    console.error("Erro no diagnostico:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
