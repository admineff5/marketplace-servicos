import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const { name, price, duration } = body;

        const service = await prisma.service.update({
            where: { id: params.id },
            data: {
                name,
                price: parseFloat(price),
                duration: parseInt(duration),
            }
        });

        return NextResponse.json(service);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.service.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao excluir" }, { status: 500 });
    }
}
