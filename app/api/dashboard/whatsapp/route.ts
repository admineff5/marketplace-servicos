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

        // ⏱️ Timeout de QR Code: Se estiver travado em QRCODE por mais de 2 minutos, expira.
        if (whatsapp && whatsapp.status === "QRCODE" && whatsapp.updatedAt) {
            const updatedAtTime = new Date(whatsapp.updatedAt).getTime();
            const now = Date.now();
            const diffMinutes = (now - updatedAtTime) / 1000 / 60;

            console.log(`[WhatsApp Timeout] Company: ${company.id} - Diff: ${diffMinutes.toFixed(2)} min | DB Status: ${whatsapp.status}`);

            if (diffMinutes > 1.5) { // Reduzindo para 1.5 minutos para ser mais rápido
                console.log(`[WhatsApp Timeout] 🚨 Expirando QR Code de ${company.id} devido a inatividade.`);
                await prisma.whatsappSession.update({
                    where: { id: whatsapp.id },
                    data: { status: "DISCONNECTED", qrCode: null }
                });
                whatsapp.status = "DISCONNECTED";
                whatsapp.qrCode = null;
            }
        }

        // 2. Busca logs de Mensagens do Dia
        const messages = await prisma.whatsappMessage.findMany({
            where: { companyId: company.id },
            orderBy: { timestamp: 'desc' },
            take: 40 // Aumentando a amostragem para pegar mais conversas
        });

        // 🔍 Busca os nomes reais e telefones dos clientes na tabela User
        const phoneNumbers = [...new Set(messages.map(m => m.senderNum))];
        const dbUsers = await prisma.user.findMany({
            where: { role: 'CLIENT' },
            select: { name: true, phone: true }
        });

        const clientProfiles = messages.reduce((acc: any, m) => {
            const senderNum = m.senderNum;
            if (!acc[senderNum]) {
                const user = dbUsers.find(u => {
                    if (!u.phone) return false;
                    const cleanPhone = u.phone.replace(/\D/g, '');
                    const cleanSender = senderNum.replace(/\D/g, '');
                    return (
                        cleanPhone === cleanSender ||
                        cleanPhone.includes(cleanSender.substring(0, 11)) ||
                        cleanSender.includes(cleanPhone.substring(0, 11)) ||
                        (u.name && m.senderName && u.name.toLowerCase() === m.senderName.toLowerCase())
                    );
                });
                if (user) {
                    acc[senderNum] = { name: user.name, phone: user.phone };
                }
            }
            return acc;
        }, {});

        return NextResponse.json({
            session: whatsapp || { status: 'DISCONNECTED', qrCode: null, number: null },
            messages: messages || [],
            clientProfiles: clientProfiles // 👈 Envia mapa de perfis reais
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
