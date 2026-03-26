import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

async function getUserId() {
    const session = await getSession();
    if (!session) return null;
    try {
        const userData = session;
        return userData.id;
    } catch {
        return null;
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const userId = await getUserId();
    const { id } = await params;

    if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    try {
        await prisma.address.delete({
            where: { id, userId }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao excluir endereço" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const userId = await getUserId();
    const { id } = await params;

    if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    try {
        const body = await request.json();
        const { isDefault } = body;

        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false }
            });
        }

        const address = await prisma.address.update({
            where: { id, userId },
            data: body
        });

        return NextResponse.json(address);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao atualizar endereço" }, { status: 500 });
    }
}
