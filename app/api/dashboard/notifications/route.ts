import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma, { getCompanyByUserId } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

        const company = await getCompanyByUserId(session.id);
        if (!company) return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });

        // Passo 1: Disparador dinâmico de Estoque
        // Verifica se há produtos com baixo estoque que ainda NÃO tem notificação não lida
        const lowStockProducts = await prisma.product.findMany({
            where: { companyId: company.id, stock: { lt: 5 } }
        });

        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
        for (const product of lowStockProducts) {
            const existingAlert = await prisma.notification.findFirst({
                where: { 
                    companyId: company.id, 
                    type: "STOCK", 
                    message: { contains: product.name },
                    createdAt: { gte: last24h }
                }
            });

            if (!existingAlert) {
                await prisma.notification.create({
                    data: {
                        companyId: company.id,
                        title: "Estoque Baixo",
                        message: `Atenção: O produto "${product.name}" está com apenas ${product.stock} unidades.`,
                        type: "STOCK",
                        link: "/dashboard/produtos"
                    }
                });
            }
        }

        // Passo 2: Buscar as notificações da Empresa
        const notifications = await prisma.notification.findMany({
            where: { companyId: company.id },
            orderBy: { createdAt: 'desc' },
            take: 30
        });

        // Retornar as métricas junto com as notificações
        const unreadCount = notifications.filter(n => !n.isRead).length;

        return NextResponse.json({ notifications, unreadCount });
    } catch (error) {
        console.error("GET Notifications Error:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

// Rota para marcar notificação(ões) como lida(s)
export async function PATCH(request: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

        const company = await getCompanyByUserId(session.id);
        if (!company) return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });

        const body = await request.json();
        const { notificationId, markAll } = body;

        if (markAll) {
            await prisma.notification.updateMany({
                where: { companyId: company.id, isRead: false },
                data: { isRead: true }
            });
            return NextResponse.json({ success: true, message: "Todas marcadas como lidas" });
        }

        if (!notificationId) {
            return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
        }

        const updated = await prisma.notification.update({
            where: { id: notificationId, companyId: company.id },
            data: { isRead: true }
        });

        return NextResponse.json({ success: true, notification: updated });
    } catch (error) {
        console.error("PATCH Notifications Error:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
