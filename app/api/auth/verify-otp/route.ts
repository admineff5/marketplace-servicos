import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, code } = body;

        if (!email || !code) {
            return NextResponse.json({ error: "E-mail e código são obrigatórios" }, { status: 400 });
        }

        // 1. Buscar usuário pelo email e token
        const user = await prisma.user.findFirst({
            where: { 
                email: email.trim().toLowerCase(),
                verificationToken: code.trim()
            }
        });

        if (!user) {
            return NextResponse.json({ error: "Código inválido ou expirado" }, { status: 400 });
        }

        // 2. Marcar como verificado e limpar token
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                verificationToken: null // Token consumido
            }
        });

        // 🌟 3. Emitir Sessão Imediata (Autenticação automática)
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

        // 4. Determinar URL de redirecionamento
        const redirectUrl = updatedUser.role === "CLIENT" ? "/cliente" : "/dashboard";

        return NextResponse.json({ 
            success: true, 
            redirectUrl 
        });

    } catch (error) {
        console.error("Verify OTP Error:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Erro interno no servidor" }, { status: 500 });
    }
}
