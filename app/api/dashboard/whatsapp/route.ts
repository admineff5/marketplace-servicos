import { NextResponse } from "next/server";
import prisma, { getCompanyByUserId } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("auth_session");

        if (!session) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        const { id: userId } = JSON.parse(session.value);
        const company = await getCompanyByUserId(userId);

        if (!company) {
            return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
        }

        // 1. Busca Status do WhatsApp
        const whatsapp = await prisma.whatsappSession.findUnique({
            where: { companyId: company.id }
        });

        // 2. Busca logs de Mensagens do Dia
        const messages = await prisma.whatsappMessage.findMany({
            where: { companyId: company.id },
            orderBy: { timestamp: 'desc' },
            take: 20 // Últimas 20 mensagens
        });

        return NextResponse.json({
            session: whatsapp || { status: 'DISCONNECTED', qrCode: null, number: null },
            messages: messages || []
        });

    } catch (error) {
        console.error("Dashboard WhatsApp GET Error:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("auth_session");

        if (!session) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        const { id: userId } = JSON.parse(session.value);
        const company = await getCompanyByUserId(userId);

        if (!company) {
            return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
        }

        const body = await request.json();
        const { action } = body; // "CONNECT" ou "DISCONNECT"

        if (action === "CONNECT") {
            // Cria ou Reseta Status para QRCODE
            await prisma.whatsappSession.upsert({
                where: { companyId: company.id },
                update: { status: 'QRCODE', qrCode: null },
                create: { companyId: company.id, status: 'QRCODE' }
            });
        } else if (action === "DISCONNECT") {
            // Sinaliza para o Worker Desconectar
            await prisma.whatsappSession.update({
                where: { companyId: company.id },
                data: { status: 'DISCONNECTING' }
            });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Dashboard WhatsApp POST Error:", error);
        return NextResponse.json({ error: "Erro ao processar ação" }, { status: 500 });
    }
}
