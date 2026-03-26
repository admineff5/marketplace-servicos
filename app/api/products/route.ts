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
        const { name, price, stock, image, description, delivery } = body;

        if (!name || !price) {
            return NextResponse.json({ error: "Nome e preço são obrigatórios" }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                price: parseFloat(price),
                stock: stock ? parseInt(stock) : 0,
                image: image || null,
                description: description || null,
                delivery: delivery || false,
                companyId: company.id,
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("POST Product Error:", error);
        return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 });
    }
}
