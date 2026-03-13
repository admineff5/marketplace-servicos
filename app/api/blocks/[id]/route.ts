import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("auth_session");
        
        if (!session) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        const { id: userId } = JSON.parse(session.value);
        const { id } = await params;

        const company = await prisma.company.findUnique({
            where: { ownerId: userId }
        });

        if (!company) {
            return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
        }

        const body = await request.json();
        const { employeeId, date, reason, situation, openTime, closeTime, isAllDay } = body;

        const block = await prisma.block.update({
            where: { id, companyId: company.id },
            data: {
                employeeId: employeeId || null,
                date: new Date(date),
                reason,
                situation,
                openTime,
                closeTime,
                isAllDay
            }
        });

        return NextResponse.json(block);
    } catch (error) {
        console.error("PUT Block Error:", error);
        return NextResponse.json({ error: "Erro ao atualizar bloqueio" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("auth_session");
        
        if (!session) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        const { id: userId } = JSON.parse(session.value);
        const { id } = await params;

        const company = await prisma.company.findUnique({
            where: { ownerId: userId }
        });

        if (!company) {
            return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
        }

        await prisma.block.delete({
            where: { id, companyId: company.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE Block Error:", error);
        return NextResponse.json({ error: "Erro ao excluir bloqueio" }, { status: 500 });
    }
}
