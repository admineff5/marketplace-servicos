const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debug() {
    try {
        console.log("Iniciando depuração da API de agendamentos...");
        
        // Simular a busca do appointments que fizemos na Rota
        const appointments = await prisma.appointment.findMany({
            where: {
                userId: "qualquer" // Vamos tentar buscar TODOS primeiro para ver se algum quebra
            },
            include: {
                location: true,
                service: true,
                employee: {
                    select: {
                        name: true,
                        image: true
                    }
                },
                company: {
                    select: {
                        name: true,
                        image: true
                    }
                }
            },
            orderBy: { date: 'desc' }
        });
        
        console.log(`Sucesso! Encontrados ${appointments.length} agendamentos.`);
        if (appointments.length > 0) {
            console.log("Exemplo do primeiro agendamento:", JSON.stringify(appointments[0], null, 2));
        }
    } catch (error) {
        console.error("ERRO FLAT EXECUTANDO QUERY:");
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

debug();
