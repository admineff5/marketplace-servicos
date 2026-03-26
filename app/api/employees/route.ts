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

        const employees = await prisma.employee.findMany({
            where: { companyId: company.id },
            include: {
                location: true
            },
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(employees);
    } catch (error) {
        console.error("GET Employees Error:", error);
        return NextResponse.json({ error: "Erro ao buscar profissionais" }, { status: 500 });
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
        const { name, role, hours, image, locationId } = body;

        const employee = await prisma.employee.create({
            data: {
                name,
                role,
                hours,
                image,
                locationId: locationId || null,
                companyId: company.id,
            },
        });

        return NextResponse.json(employee);
    } catch (error) {
        console.error("POST Employee Error:", error);
        return NextResponse.json({ error: "Erro ao criar profissional" }, { status: 500 });
    }
}
