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
            return NextResponse.json([]);
        }

        const locations = await prisma.location.findMany({
            where: { companyId: company.id },
            orderBy: { createdAt: 'asc' }
        });
        return NextResponse.json(locations);
    } catch (error) {
        console.error("GET Locations Error:", error);
        return NextResponse.json({ error: "Erro ao buscar unidades" }, { status: 500 });
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
        const { name, cep, address, number, neighborhood, city, state, mapsLink, cnpj } = body;

        if (!name || !cep || !address) {
            return NextResponse.json({ error: "Nome, CEP e Endereço são obrigatórios" }, { status: 400 });
        }

        const location = await prisma.location.create({
            data: {
                name,
                cep,
                address,
                number: number || "",
                neighborhood: neighborhood || "",
                city: city || "",
                state: state || "",
                mapsLink: mapsLink || "",
                cnpj: cnpj || null, // null is safe for unique constraints if not provided, or empty string if allowed
                companyId: company.id,
            },
        });

        return NextResponse.json(location);
    } catch (error) {
        console.error("POST Location Error:", error);
        return NextResponse.json({ error: "Erro ao criar unidade" }, { status: 500 });
    }
}
