import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        
        if (!session) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        const { id: userId } = session;
        const { id } = await params;

        const company = await prisma.company.findUnique({
            where: { ownerId: userId }
        });

        if (!company) {
            return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
        }

        const body = await request.json();
        const { name, role, locationId, image, hours } = body;

        const employee = await prisma.employee.update({
            where: { id, companyId: company.id },
            data: {
                name,
                role,
                locationId,
                image,
                hours
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
        const session = await getSession();
        
        if (!session) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        const { id: userId } = session;
        const { id } = await params;

        const company = await prisma.company.findUnique({
            where: { ownerId: userId }
        });

        if (!company) {
            return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
        }

        await prisma.$transaction([
            prisma.appointment.deleteMany({ where: { employeeId: id } }),
            prisma.block.deleteMany({ where: { employeeId: id } }),
            prisma.employee.delete({
                where: { id, companyId: company.id }
            })
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE Employee Error:", error);
        return NextResponse.json({ error: "Erro ao excluir profissional" }, { status: 500 });
    }
}
