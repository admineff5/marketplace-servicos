import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

async function getUserId() {
    const cookieStore = await cookies();
    const session = cookieStore.get("auth_session");
    if (!session) return null;
    try {
        const userData = JSON.parse(session.value);
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
        await prisma.paymentMethod.delete({
            where: { id, userId }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao excluir cartão" }, { status: 500 });
    }
}
