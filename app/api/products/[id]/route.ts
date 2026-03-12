import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const { name, price, stock, image, description } = body;

        const product = await prisma.product.update({
            where: { id: params.id },
            data: {
                name,
                price: parseFloat(price),
                description: description || `Estoque: ${stock}`
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.product.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao excluir" }, { status: 500 });
    }
}
