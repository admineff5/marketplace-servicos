const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("--- Locations ---");
    const locs = await prisma.location.findMany();
    console.log(JSON.stringify(locs, null, 2));

    console.log("\n--- Employees ---");
    const emps = await prisma.employee.findMany();
    console.log(JSON.stringify(emps, null, 2));

    console.log("\n--- Appointments ---");
    const apts = await prisma.appointment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            location: true,
            employee: true
        }
    });
    console.log(JSON.stringify(apts, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
