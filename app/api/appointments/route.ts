import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("auth_session");

        if (!session) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        const { id: userId, role } = JSON.parse(session.value);

        // BUSINESS: buscar agendamentos da empresa do dono
        if (role === "BUSINESS") {
            const company = await prisma.company.findUnique({
                where: { ownerId: userId }
            });

            if (!company) {
                return NextResponse.json([]);
            }

            const { searchParams } = new URL(request.url);
            const dateStr = searchParams.get("date");
            const limitStr = searchParams.get("limit");

            let whereClause: any = {
                service: { companyId: company.id }
            };

            if (dateStr) {
                const date = new Date(dateStr);
                const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
                const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
                whereClause.date = { gte: startOfDay, lte: endOfDay };
            }

            const appointments = await prisma.appointment.findMany({
                where: whereClause,
                include: {
                    employee: { select: { name: true } },
                    service: { select: { name: true, price: true } },
                    location: { select: { name: true, address: true } },
                    user: { select: { name: true } }
                },
                orderBy: { date: 'asc' },
                take: limitStr ? parseInt(limitStr) : undefined
            });

            const formatted = appointments.map((apt: any) => ({
                id: apt.id,
                start: apt.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                client: apt.user.name,
                prof: apt.employee.name,
                title: apt.service.name,
                status: apt.status,
                date: apt.date,
            }));

            return NextResponse.json(formatted);
        }

        // CLIENT: buscar apenas agendamentos do próprio usuário
        const appointments = await prisma.appointment.findMany({
            where: { userId },
            include: {
                employee: { select: { name: true } },
                service: { select: { name: true, price: true } },
                location: { select: { name: true, address: true } },
            },
            orderBy: { date: 'asc' }
        });

        const formatted = appointments.map((apt: any) => ({
            id: apt.id,
            start: apt.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            service: apt.service.name,
            prof: apt.employee.name,
            status: apt.status,
            date: apt.date,
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error("GET Appointments Error:", error);
        return NextResponse.json({ error: "Erro ao buscar agendamentos" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("auth_session");

        if (!session) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        const { id: userId } = JSON.parse(session.value);
        const body = await request.json();
        const { employeeId, serviceId, locationId, date } = body;

        if (!employeeId || !serviceId || !locationId || !date) {
            return NextResponse.json({ error: "Campos obrigatórios: employeeId, serviceId, locationId, date" }, { status: 400 });
        }

        const appointment = await prisma.appointment.create({
            data: {
                employeeId,
                serviceId,
                userId, // ← Usar userId da SESSÃO, não do body (segurança)
                locationId,
                date: new Date(date),
            },
        });

        return NextResponse.json(appointment);
    } catch (error) {
        console.error("POST Appointment Error:", error);
        return NextResponse.json({ error: "Erro ao criar agendamento" }, { status: 500 });
    }
}
