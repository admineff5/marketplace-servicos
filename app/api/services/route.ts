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
            where: { ownerId: userId }
        });

        if (!company) {
            return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
        }

        const services = await prisma.service.findMany({
            where: { companyId: company.id },
            orderBy: { name: 'asc' }
        });

        return NextResponse.json(services);
    } catch (error) {
        console.error("GET Services Error:", error);
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
        const company = await prisma.company.findUnique({
            where: { ownerId: userId }
        });

        if (!company) {
            return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
        }

        const body = await request.json();
        const { name, price, duration, description } = body;

        const service = await prisma.service.create({
            data: {
                name,
                price: parseFloat(price),
                duration: parseInt(duration),
                companyId: company.id
            }
        });

        return NextResponse.json(service);
    } catch (error) {
        console.error("POST Service Error:", error);
        return NextResponse.json({ error: "Erro ao criar serviço" }, { status: 500 });
    }
}
