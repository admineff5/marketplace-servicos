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
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                verificationToken: null // Token consumido
            }
        });

        // 🌟 3. Emitir Sessão Imediata (Autenticação automática pelo clique)
        const { SignJWT } = await import("jose");
        const secretText = process.env.AUTH_SECRET;
        if (!secretText) throw new Error("AUTH_SECRET não configurada");
        const secret = new TextEncoder().encode(secretText);

        const tokenJWT = await new SignJWT({ id: updatedUser.id, role: updatedUser.role })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("7d")
            .sign(secret);

        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        cookieStore.set("auth_session", tokenJWT, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60, // 7 dias
            path: "/",
        });

        // 4. Redirecionar direto para o Painel correspondente
        const baseUrl = new URL(request.url).origin;
        const redirectUrl = updatedUser.role === "CLIENT" ? "/cliente" : "/dashboard";
        return NextResponse.redirect(new URL(redirectUrl, baseUrl));

    } catch (error) {
        console.error("Verify Email Error:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Erro interno no servidor" }, { status: 500 });
    }
}
