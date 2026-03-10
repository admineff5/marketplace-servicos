import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const locations = await prisma.location.findMany({
            orderBy: { createdAt: 'asc' }
        });
        return NextResponse.json(locations);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar unidades" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, cep, address, number, neighborhood, city, state, mapsLink, companyId } = body;

        const location = await prisma.location.create({
            data: {
                name,
                cep,
                address,
                number,
                neighborhood,
                city,
                state,
                mapsLink,
                companyId, // Em um cenário real, isso viria do contexto do usuário logado
            },
        });

        return NextResponse.json(location);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao criar unidade" }, { status: 500 });
    }
}
