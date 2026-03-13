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
        const { name, role, hours, image, locationId } = body;

        const employee = await prisma.employee.create({
            data: {
                name,
                role,
                hours,
                image,
                locationId,
                companyId: company.id,
            },
        });

        return NextResponse.json(employee);
    } catch (error) {
        console.error("POST Employee Error:", error);
        return NextResponse.json({ error: "Erro ao criar profissional" }, { status: 500 });
    }
}
