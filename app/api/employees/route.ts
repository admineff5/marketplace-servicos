import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const employees = await prisma.employee.findMany({
            include: {
                location: true
            },
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(employees);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar profissionais" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, role, days, hours, image, locationId, companyId } = body;

        const employee = await prisma.employee.create({
            data: {
                name,
                role,
                days,
                hours,
                image,
                locationId,
                companyId,
            },
        });

        return NextResponse.json(employee);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao criar profissional" }, { status: 500 });
    }
}
