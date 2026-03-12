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

        const { id: userId } = JSON.parse(session.value);

        const company = await prisma.company.findUnique({
            where: { ownerId: userId },
            select: {
                id: true,
                name: true,
                niche: true,
                imageUrl: true,
                cnpj: true,
                legalName: true,
            }
        });

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
        const cookieStore = await cookies();
        const session = cookieStore.get("auth_session");
        
        if (!session) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        const { id: userId } = JSON.parse(session.value);
        const body = await request.json();
        const { name, cnpj, legalName, imageUrl } = body;

        const updated = await prisma.company.update({
            where: { ownerId: userId },
            data: { 
                name, 
                cnpj, 
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
