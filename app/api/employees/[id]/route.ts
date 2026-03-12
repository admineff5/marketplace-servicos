import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, role, locationId, image } = body;

        const employee = await prisma.employee.update({
            where: { id },
            data: {
                name,
                locationId,
                // Adicionando role e image se o esquema suportar, caso contrário apenas name/locationId
                // Se o esquema simplificado não tiver role/image, removeremos depois
            },
        });

        return NextResponse.json(employee);
    } catch (error) {
        console.error("PUT Employee Error:", error);
        return NextResponse.json({ error: "Erro ao atualizar profissional" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.employee.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE Employee Error:", error);
        return NextResponse.json({ error: "Erro ao excluir profissional" }, { status: 500 });
    }
}
