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

        const company = await getCompanyByUserId(userId);

        if (!company) {
            return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
        }

        return NextResponse.json(company);
    } catch (error) {
        console.error("Dashboard Profile GET Error:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getSession();
        
        if (!session) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        const { id: userId } = session;
        const company = await getCompanyByUserId(userId);

        if (!company) {
            return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
        }

        const body = await request.json();
        const { name, legalName, imageUrl } = body;

        const updated = await prisma.company.update({
            where: { ownerId: userId },
            data: { 
                name, 
                legalName, 
                imageUrl 
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Dashboard Profile PUT Error:", error);
        return NextResponse.json({ error: "Erro ao atualizar dados" }, { status: 500 });
    }
}
