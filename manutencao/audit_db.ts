import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "postgresql://usrdbsite:RPmD0pUdUFnMFWu5xQmkRgSRZHNidkF3K7l@localhost:5434/dbsite"
      }
    }
  });

  console.log("--- Audit AgendeJá Database ---");

  // 1. Check User (PF)
  const userPF = await prisma.user.findUnique({
    where: { email: "rodrigoamac@gmail.com" }
  });
  console.log("\n[USER PF]", userPF ? { id: userPF.id, role: userPF.role, hasPassword: !!userPF.password, passwordPreview: userPF.password.substring(0, 10) } : "NOT FOUND");

  // 2. Check User (PJ)
  const userPJ = await prisma.user.findUnique({
    where: { email: "rodrigo@eff5.com.br" }
  });
  console.log("\n[USER PJ]", userPJ ? { id: userPJ.id, role: userPJ.role } : "NOT FOUND");

  if (userPJ) {
    const company = await prisma.company.findUnique({
      where: { ownerId: userPJ.id }
    });
    console.log("[COMPANY PJ]", company ? { id: company.id, name: company.name } : "NOT FOUND");
  }

  // 3. Check Tables
  try {
    const services = await prisma.service.findMany({ take: 1 });
    console.log("\n[SERVICES TABLE] OK", services.length > 0 ? "Has data" : "Empty");
    // Check for description field in first object if exists
    if (services.length > 0) {
      console.log("Service sample record:", services[0]);
    }
  } catch (e: any) {
    console.log("\n[SERVICES TABLE] ERROR:", e.message);
  }

  try {
    const employees = await prisma.employee.findMany({ take: 1 });
    console.log("\n[EMPLOYEES TABLE] OK", employees.length > 0 ? "Has data" : "Empty");
  } catch (e: any) {
    console.log("\n[EMPLOYEES TABLE] ERROR:", e.message);
  }

  await prisma.$disconnect();
}

main();
