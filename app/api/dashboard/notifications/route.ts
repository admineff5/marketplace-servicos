import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("auth_session");
        
        if (!session) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        // Devolvendo lista vazia para "zerar" os dados do mockup como solicitado
        // No futuro, buscar da tabela Notification se for implementada
        return NextResponse.json([]);
    } catch (error) {
        console.error("Dashboard Notifications GET Error:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
