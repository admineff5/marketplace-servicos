import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma, { getCompanyByUserId } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const session = await getSession();
        
        if (!session) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        const { id: userId } = session;
        const company = await prisma.company.findUnique({
            where: { ownerId: userId }
        });

        if (!company) {
            return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
        }

        const blocks = await prisma.block.findMany({
            where: { companyId: company.id },
            include: {
                employee: true
            },
            orderBy: { date: 'asc' }
        });

        return NextResponse.json(blocks);
    } catch (error) {
        console.error("GET Blocks Error:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession();
        
        if (!session) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        const { id: userId } = session;
        const company = await prisma.company.findUnique({
            where: { ownerId: userId }
        });

        if (!company) {
            return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
        }

        const body = await request.json();
        const { employeeId, date, reason, situation, openTime, closeTime, isAllDay } = body;

        const block = await prisma.block.create({
            data: {
                companyId: company.id,
                employeeId: employeeId || null,
                date: new Date(date),
                reason,
                situation: situation || "Feriado",
                openTime,
                closeTime,
                isAllDay: isAllDay ?? true
            }
        });

        return NextResponse.json(block);
    } catch (error) {
        console.error("POST Block Error:", error);
        return NextResponse.json({ error: "Erro ao criar bloqueio" }, { status: 500 });
    }
}
