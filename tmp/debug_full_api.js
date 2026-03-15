require('dotenv').config(); // <--- CARREGAR .ENV
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function formatApt(apt) {
    try {
        return {
            id: apt.id,
            service: apt.service?.name || "Serviço",
            company: apt.company?.name || "Empresa", 
            date: new Date(apt.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            time: new Date(apt.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            rawDate: apt.date instanceof Date ? apt.date.toISOString() : new Date(apt.date).toISOString(),
            professional: apt.employee?.name || "Desconhecido", // <--- SAFE NAVIGATION
            address: (apt.location?.name || "") + " - " + (apt.location?.address || ""),
            price: "R$ " + (apt.service?.price ? apt.service.price.toFixed(2) : "0.00"),
            status: apt.status?.toLowerCase() || 'pending',
            rating: apt.rating,
            comment: apt.comment,
            image: apt.company?.image || "https://images.unsplash.com/photo-1560066914-1f29b3bbec3e?w=150&auto=format&fit=crop&q=80",
            employeeImage: apt.employee?.image, // <--- SAFE NAVIGATION
            locationId: apt.locationId,
            companyId: apt.companyId,
            employeeId: apt.employeeId,
            mapsLink: apt.location?.mapsLink
        };
    } catch (e) {
        console.error("ERRO FORMATANDO ITEM:", apt.id, e.message);
        return null;
    }
}

async function debug() {
    try {
        console.log("Iniciando depuração Completa com Dotenv...");
        
        const appointments = await prisma.appointment.findMany({
            include: {
                location: true,
                service: true,
                employee: { select: { name: true, image: true } },
                company: { select: { name: true, image: true } }
            }
        });

        console.log(`Puxei ${appointments.length} agendamentos do banco de dados para formatar...`);
        
        if (appointments.length === 0) {
            console.log("AVISO: Nenhum agendamento no banco de dados.");
            return;
        }

        const formatted = appointments.map(formatApt).filter(Boolean);
        console.log(`SUCESSO: ${formatted.length} agendamentos formatados sem quebras de backend!`);
        if (formatted.length > 0) {
            console.log("Exemplo Formatado:", formatted[0]);
        }

    } catch (error) {
        console.error("ERRO FLAT EXECUTANDO QUERY");
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

debug();
