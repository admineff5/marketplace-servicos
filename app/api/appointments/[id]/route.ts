import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { status, date, startTime, endTime } = body;

        const appointment = await prisma.appointment.update({
            where: { id: params.id },
            data: {
                status,
                date: date ? new Date(date) : undefined,
                startTime: startTime ? new Date(startTime) : undefined,
                endTime: endTime ? new Date(endTime) : undefined,
            },
        });

        return NextResponse.json(appointment);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao atualizar agendamento" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.appointment.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ message: "Agendamento excluído com sucesso" });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao excluir agendamento" }, { status: 500 });
    }
}
