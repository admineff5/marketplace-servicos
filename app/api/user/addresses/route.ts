import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

async function getUserId() {
    const cookieStore = await cookies();
    const session = cookieStore.get("auth_session");
    if (!session) return null;
    try {
        const userData = JSON.parse(session.value);
        return userData.id;
    } catch {
        return null;
    }
}

export async function GET() {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    try {
        const addresses = await prisma.address.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(addresses);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar endereços" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    try {
        const body = await request.json();
        const { cep, street, number, complement, neighborhood, city, state, isDefault } = body;

        // Se for o primeiro endereço ou for marcado como padrão, desmarcar outros
        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false }
            });
        }

        const address = await prisma.address.create({
            data: {
                userId,
                cep,
                street,
                number,
                complement,
                neighborhood,
                city,
                state,
                isDefault: isDefault || false
            }
        });

        return NextResponse.json(address);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao criar endereço" }, { status: 500 });
    }
}
