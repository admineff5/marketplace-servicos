import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get("token");

        if (!token) {
            return NextResponse.json({ error: "Token não fornecido" }, { status: 400 });
        }

        // 1. Buscar usuário pelo token
        const user = await prisma.user.findFirst({
            where: { verificationToken: token }
        });

        if (!user) {
            return NextResponse.json({ error: "Token de verificação inválido ou expirado" }, { status: 400 });
        }

        // 2. Marcar como verificado e limpar token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                verificationToken: null // Token consumido
            }
        });

        // 3. Redirecionar para o Login com flag de sucesso
        const baseUrl = new URL(request.url).origin;
        return NextResponse.redirect(new URL(`/login?verified=true`, baseUrl));

    } catch (error) {
        console.error("Verify Email Error:", error);
        return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
    }
}
