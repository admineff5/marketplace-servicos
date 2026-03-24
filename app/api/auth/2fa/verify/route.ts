import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";
// import { authenticator } from "otplib";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { code } = body;

        if (!code || code.length !== 6) {
            return NextResponse.json({ error: "Código de 6 dígitos inválido" }, { status: 400 });
        }

        const cookieStore = await cookies();
        const session = cookieStore.get("auth_session");

        if (!session) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        // 1. Validar Sessão
        const secretText = process.env.AUTH_SECRET;
        if (!secretText) throw new Error("AUTH_SECRET não configurada");
        const secret = new TextEncoder().encode(secretText);
        
        let payload;
        try {
            const result = await jwtVerify(session.value, secret);
            payload = result.payload;
        } catch (e) {
            return NextResponse.json({ error: "Sessão inválida" }, { status: 401 });
        }

        const userId = payload.id as string;

        // 2. Buscar usuário
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user || !user.twoFactorSecret) {
            return NextResponse.json({ error: "2FA não configurado para este usuário" }, { status: 400 });
        }

        // 3. Verificar o código inserido
        const otplib = require("otplib");
        const isValid = otplib.verify({ token: code, secret: user.twoFactorSecret });

        if (!isValid) {
            return NextResponse.json({ error: "Código 2FA incorreto ou expirado" }, { status: 400 });
        }

        // 4. Habilitar 2FA
        await prisma.user.update({
            where: { id: userId },
            data: { twoFactorEnabled: true }
        });

        return NextResponse.json({ success: true, message: "Autenticação de 2 fatores habilitada com sucesso!" });

    } catch (error) {
        console.error("2FA Verify Error:", error);
        return NextResponse.json({ error: "Erro ao verificar 2FA" }, { status: 500 });
    }
}
