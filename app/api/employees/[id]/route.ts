import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, role, days, hours, image, locationId } = body;

        const employee = await prisma.employee.update({
            where: { id },
            data: {
                name,
                locationId,
            },
        });

        return NextResponse.json(employee);
    } catch (error) {
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
        return NextResponse.json({ message: "Profissional excluído com sucesso" });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao excluir profissional" }, { status: 500 });
    }
}
