import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const dateStr = searchParams.get("date");

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
            orderBy: { date: 'asc' }
        });
        return NextResponse.json(appointments);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar agendamentos" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { employeeId, serviceId, userId, locationId, date, startTime, endTime } = body;

        const appointment = await prisma.appointment.create({
            data: {
                employeeId,
                serviceId,
                userId,
                locationId,
                date: new Date(date),
                startTime: startTime ? new Date(startTime) : null,
                endTime: endTime ? new Date(endTime) : null,
            },
        });

        return NextResponse.json(appointment);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao criar agendamento" }, { status: 500 });
    }
}
