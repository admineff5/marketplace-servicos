import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: Promise<{ senderNum: string }> }) {
    const { senderNum } = await params;
    try {
        await prisma.whatsappMessage.deleteMany({
            where: { senderNum }
        });

        // 💡 Opcional: Se quiser que a IA "esqueça" o contexto imediato na memória (se houver cache), 
        // o reinício do worker ou limpar o histórico já força ela a reler as novas regras.

        return NextResponse.json({ success: true, message: "Conversa limpa com sucesso!" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
