import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const { name, price, duration } = body;

        const service = await prisma.service.update({
            where: { id },
            data: {
                name,
                price: parseFloat(price),
                duration: duration ? parseInt(duration as any) : null,
            }
        });

        return NextResponse.json(service);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;

        // 🔍 Verifica se existem agendamentos vinculados a este serviço
        const count = await prisma.appointment.count({
            where: { serviceId: id }
        });

        if (count > 0) {
            return NextResponse.json({ 
                error: `Não é possível excluir. Existem ${count} agendamento(s) vinculado(s) a este serviço.` 
            }, { status: 400 });
        }

        await prisma.service.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete Service Error:", error);
        return NextResponse.json({ error: "Erro interno ao excluir serviço" }, { status: 500 });
    }
}
