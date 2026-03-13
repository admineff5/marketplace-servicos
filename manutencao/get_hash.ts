import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://usrdbsite:RPmD0pUdUFnMFWu5xQmkRgSRZHNidkF3K7l@localhost:5434/dbsite"
    }
  }
});

async function main() {
  const u = await prisma.user.findUnique({ where: { email: 'rodrigoamac@gmail.com' } });
  if (u) {
    console.log('--- HASH START ---');
    console.log(u.password);
    console.log('--- HASH END ---');
  } else {
    console.log('NOT FOUND');
  }
  await prisma.$disconnect();
}

main();
