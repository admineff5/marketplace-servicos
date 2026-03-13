import { NextResponse } from "next/server";
import prisma, { getCompanyByUserId } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("auth_session");
        
        if (!session) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        const { id: userId } = JSON.parse(session.value);
        const company = await getCompanyByUserId(userId);

        if (!company) {
            return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
        }

        // Buscar agendamentos da empresa e extrair usuários únicos
        const appointments = await prisma.appointment.findMany({
            where: { location: { companyId: company.id } },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        email: true
                    }
                }
            },
            orderBy: { date: 'desc' }
        });

        // Agrupar usuários únicos e calcular metadados (última visita, total visitas)
        const clientsMap = new Map();
        appointments.forEach(app => {
            if (!app.user) return; // Segurança caso o usuário tenha sido deletado
            
            if (!clientsMap.has(app.userId)) {
                clientsMap.set(app.userId, {
                    id: app.user.id,
                    name: app.user.name,
                    phone: app.user.phone,
                    email: app.user.email,
                    lastVisit: app.date,
                    totalVisits: 1,
                    status: "Novo"
                });
            } else {
                const client = clientsMap.get(app.userId);
                client.totalVisits += 1;
                client.status = client.totalVisits > 5 ? "VIP" : "Frequente";
            }
        });

        return NextResponse.json(Array.from(clientsMap.values()));
    } catch (error) {
        console.error("GET Clients Error:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
