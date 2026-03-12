import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status, date } = body;

        const appointment = await prisma.appointment.update({
            where: { id },
            data: {
                status,
                date: date ? new Date(date) : undefined,
            },
        });

        return NextResponse.json(appointment);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao atualizar agendamento" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.appointment.delete({
            where: { id },
        });
        return NextResponse.json({ message: "Agendamento excluído com sucesso" });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao excluir agendamento" }, { status: 500 });
    }
}
