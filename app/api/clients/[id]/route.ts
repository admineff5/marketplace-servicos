import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        // 1. Apaga agendamentos vinculados para evitar erro de Foreign Key
        await prisma.appointment.deleteMany({ where: { userId: id } });

        // 2. Apaga o usuário
        await prisma.user.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
