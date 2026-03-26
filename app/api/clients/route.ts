import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma, { getCompanyByUserId } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const session = await getSession();
        
        if (!session) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        const { id: userId } = session;
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

        // 🚀 Busca Leads que ainda não foram convertidos
        const leads = await prisma.lead.findMany({
            where: { companyId: company.id, converted: false }
        });

        leads.forEach((l: any) => {
            if (!clientsMap.has(l.id)) {
                clientsMap.set(l.id, {
                    id: l.id,
                    name: l.name,
                    phone: l.phone,
                    email: l.email,
                    lastVisit: null,
                    totalVisits: 0,
                    status: "Lead"
                });
            }
        });

        return NextResponse.json(Array.from(clientsMap.values()));
    } catch (error) {
        console.error("GET Clients Error:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });

        const company = await getCompanyByUserId(session.id);
        if (!company) return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });

        const body = await request.json();
        const { name, phone } = body;

        if (!name || !phone) {
            return NextResponse.json({ error: "Nome e Telefone são obrigatórios" }, { status: 400 });
        }

        // 🧹 Limpa a formatação do telefone
        const cleanPhone = phone.replace(/\D/g, "");

        // 🛡️ Salva como Lead associado à Empresa
        const newLead = await prisma.lead.create({
            data: {
                name,
                phone: cleanPhone,
                companyId: company.id,
                interest: "Cadastro Manual",
                converted: false
            }
        });

        return NextResponse.json({ success: true, lead: newLead });
    } catch (error) {
        console.error("POST Clients Error:", error);
        return NextResponse.json({ error: "Erro ao criar cliente manual" }, { status: 500 });
    }
}
