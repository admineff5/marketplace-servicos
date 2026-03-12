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

        const { id } = JSON.parse(session.value);

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                cpf: true,
                address: true,
                // phone não existe no User mas talvez no Profile ou Lead? No feedback ele pediu no cadastro.
                // Vou adicionar phone ao User se não houver. 
            }
        });

        if (!user) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Profile GET Error:", error);
        return NextResponse.json({ error: "Erro ao buscar perfil" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("auth_session");
        
        if (!session) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        const { id } = JSON.parse(session.value);
        const body = await request.json();
        const { address } = body; // CPF e Email não podem ser alterados segundo o feedback

        const updated = await prisma.user.update({
            where: { id },
            data: { address }
        });

        return NextResponse.json({ success: true, user: updated });
    } catch (error) {
        console.error("Profile PUT Error:", error);
        return NextResponse.json({ error: "Erro ao atualizar perfil" }, { status: 500 });
    }
}
