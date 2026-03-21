import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        // 1. Apaga agendamentos vinculados para evitar erro de Foreign Key
        await prisma.appointment.deleteMany({ where: { userId: id } });

        // 2. Apaga Endereços vinculados
        await prisma.address.deleteMany({ where: { userId: id } });

        // 3. Apaga Métodos de Pagamento vinculados
        await prisma.paymentMethod.deleteMany({ where: { userId: id } });

        // 4. Apaga Leads vinculados
        await prisma.lead.deleteMany({ where: { userId: id } });

        // 5. Apaga o usuário
        await prisma.user.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
