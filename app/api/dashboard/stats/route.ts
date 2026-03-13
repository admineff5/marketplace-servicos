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

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Agregando Agendamentos do mês
        const appointments = await prisma.appointment.findMany({
            where: {
                service: { companyId: company.id },
                date: { gte: startOfMonth }
            },
            include: {
                service: { select: { price: true } }
            }
        });

        const totalAgendamentos = appointments.length;
        const agendamentosOnline = appointments.filter(a => a.status !== "CANCELLED").length; 
        const atendimentos = appointments.filter(a => a.status === "CONFIRMED" || a.status === "COMPLETED").length;
        
        const receita = appointments
            .filter(a => a.status === "CONFIRMED" || a.status === "COMPLETED")
            .reduce((acc, curr) => acc + (curr.service?.price || 0), 0);

        // KPI Mocks for trends
        const stats = [
            { title: "Resultado", value: `R$ ${receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, trend: "+0%", isPositive: true },
            { title: "Receita", value: `R$ ${receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, trend: "+0%", isPositive: true },
            { title: "Despesa", value: "R$ 0,00", trend: "0%", isPositive: false },
            { title: "Agendamentos", value: totalAgendamentos.toString(), trend: "+0%", isPositive: true },
            { title: "Agendamentos Online", value: agendamentosOnline.toString(), trend: "+0%", isPositive: true },
            { title: "Atendimentos", value: atendimentos.toString(), trend: "+0%", isPositive: true },
        ];

        return NextResponse.json(stats);
    } catch (error) {
        console.error("GET Dashboard Stats Error:", error);
        return NextResponse.json({ error: "Erro ao buscar estatísticas" }, { status: 500 });
    }
}
