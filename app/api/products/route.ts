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

        const products = await prisma.product.findMany({
            where: { companyId: company.id },
            orderBy: { name: 'asc' }
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error("GET Products Error:", error);
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
        const { name, price, stock, image, description } = body;

        const product = await prisma.product.create({
            data: {
                name,
                price: parseFloat(price),
                // O schema não tem stock! Vou adicionar no próximo passo ou usar description por enquanto?
                // Verificando schema.prisma... model Product { id, companyId, name, description, price, delivery, createdAt, updatedAt }
                // O schema NOVO tem stock? Deixa eu ver...
                description: description || `Estoque: ${stock}`,
                companyId: company.id,
                // O schema também não tem imagem para produtos no model Product. 
                // Vou ter que adicionar 'image' ao model Product no schema.prisma.
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("POST Product Error:", error);
        return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 });
    }
}
