import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { code, preAuthToken } = body;

        if (!code || !preAuthToken) {
            return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
        }

        const secretText = process.env.AUTH_SECRET;
        if (!secretText) throw new Error("AUTH_SECRET não configurada");
        const secret = new TextEncoder().encode(secretText);

        // 1. Validar preAuthToken
        let payload;
        try {
            const result = await jwtVerify(preAuthToken, secret);
            payload = result.payload;
        } catch (e) {
            return NextResponse.json({ error: "Token de autenticação expirado ou inválido" }, { status: 401 });
        }

        if (payload.mfa !== "PENDING") {
            return NextResponse.json({ error: "Ação não permitida" }, { status: 400 });
        }

        const userId = payload.id as string;

        // 2. Buscar Usuário
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user || !user.twoFactorSecret || !user.twoFactorEnabled) {
            return NextResponse.json({ error: "2FA não habilitado" }, { status: 400 });
        }

        // 3. Validar Código 2FA
        const otplib = require("otplib");
        const isValid = otplib.verify({ token: code, secret: user.twoFactorSecret });

        if (!isValid) {
            return NextResponse.json({ error: "Código 2FA incorreto ou expirado" }, { status: 400 });
        }

        // 4. Emitir Cookie Final de Sessão
        const token = await new SignJWT({ id: user.id, role: user.role })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("7d")
            .sign(secret);

        const cookieStore = await cookies();
        cookieStore.set("auth_session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60, // 7 dias
            path: "/",
        });

        return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });

    } catch (error) {
        console.error("2FA Login Error:", error);
        return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
    }
}
