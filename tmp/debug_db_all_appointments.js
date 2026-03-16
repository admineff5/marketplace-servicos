const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
         employee: { select: { id: true, name: true, companyId: true } }
      },
      orderBy: { date: 'asc' }
    });

    console.log(`=== TODOS OS AGENDAMENTOS NO BANCO ===`);
    appointments.forEach(a => {
        console.log(`- ID: ${a.id}`);
        console.log(`  Titulo: ${a.title}`);
        console.log(`  Data: ${a.date.toISOString()}`);
        console.log(`  Status: ${a.status}`);
        console.log(`  Company ID (Appointment): ${a.companyId}`);
        console.log(`  Profissional: ${a.employee?.name} (ID: ${a.employee?.id})`);
        console.log(`  Company ID (Profissional): ${a.employee?.companyId}`);
        console.log('-----------------------------------');
    });

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
