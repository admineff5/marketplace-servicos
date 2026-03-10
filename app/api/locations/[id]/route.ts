import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { name, cep, address, number, neighborhood, city, state, mapsLink } = body;

        const location = await prisma.location.update({
            where: { id: params.id },
            data: {
                name,
                cep,
                address,
                number,
                neighborhood,
                city,
                state,
                mapsLink,
            },
        });

        return NextResponse.json(location);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao atualizar unidade" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.location.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ message: "Unidade excluída com sucesso" });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao excluir unidade" }, { status: 500 });
    }
}
