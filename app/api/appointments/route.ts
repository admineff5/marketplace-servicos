import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const dateStr = searchParams.get("date");
        const limitStr = searchParams.get("limit");

        let where: any = {};
        if (dateStr) {
            const date = new Date(dateStr);
            const startOfDay = new Date(date.setHours(0, 0, 0, 0));
            const endOfDay = new Date(date.setHours(23, 59, 59, 999));
            where.date = {
                gte: startOfDay,
                lte: endOfDay
            };
        }

        const appointments = await prisma.appointment.findMany({
            where,
            include: {
                employee: true,
                service: true,
                location: true,
                user: true
            },
            orderBy: { date: 'asc' },
            take: limitStr ? parseInt(limitStr) : undefined
        });

        // Formatar para o Dashboard se necessário
        const formatted = appointments.map((apt: any) => ({
            ...apt,
            start: apt.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            client: apt.user.name,
            prof: apt.employee.name,
            title: apt.service.name
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error("GET Appointments Error:", error);
        return NextResponse.json({ error: "Erro ao buscar agendamentos" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { employeeId, serviceId, userId, locationId, date } = body;

        const appointment = await prisma.appointment.create({
            data: {
                employeeId,
                serviceId,
                userId,
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
