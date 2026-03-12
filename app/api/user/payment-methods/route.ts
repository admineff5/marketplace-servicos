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
        const methods = await prisma.paymentMethod.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(methods);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar cartões" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    try {
        const body = await request.json();
        const { cardName, lastDigits, brand, expiry, isFavorite } = body;

        if (isFavorite) {
            await prisma.paymentMethod.updateMany({
                where: { userId, isFavorite: true },
                data: { isFavorite: false }
            });
        }

        const method = await prisma.paymentMethod.create({
            data: {
                userId,
                cardName,
                lastDigits,
                brand,
                expiry,
                isFavorite: isFavorite || false
            }
        });

        return NextResponse.json(method);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao cadastrar cartão" }, { status: 500 });
    }
}
