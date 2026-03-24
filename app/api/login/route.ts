import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email: rawEmail, password } = body;
        const email = rawEmail?.trim().toLowerCase();

        if (!email || !password) {
            return NextResponse.json({ error: "E-mail e senha são obrigatórios" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json({ error: "E-mail e/ou senha inválidos" }, { status: 401 });
        }

        // Comparação segura com bcrypt
        // Suporta fallback para senhas ainda não migradas (texto puro legado)
        let isValidPassword = false;
        if (user.password.startsWith("$2b$") || user.password.startsWith("$2a$")) {
            // Senha já hashada com bcrypt
            isValidPassword = await bcrypt.compare(password, user.password);
        } else {
            // Senha legada (texto puro) — comparar e migrar para bcrypt
            if (user.password === password) {
                isValidPassword = true;
                // Migrar senha para bcrypt automaticamente
                const hashedPassword = await bcrypt.hash(password, 12);
                await prisma.user.update({
                    where: { id: user.id },
                    data: { password: hashedPassword }
                });
                console.log(`[SECURITY] Senha migrada para bcrypt: user ${user.id}`);
            }
        }

        if (!isValidPassword) {
            return NextResponse.json({ error: "E-mail e/ou senha inválidos" }, { status: 401 });
        }

        // Sessão segura — JWT assinado com jose
        const secretText = process.env.AUTH_SECRET;
        if (!secretText) {
            throw new Error("AUTH_SECRET não está definida no ambiente");
        }
        const secret = new TextEncoder().encode(secretText);
        
        const { SignJWT } = await import("jose");

        // 🚨 Verificar se E-mail está verificado
        if (user.emailVerified === false) {
            return NextResponse.json({ error: "Por favor, verifique seu e-mail para acessar a conta." }, { status: 403 });
        }

        // 🚨 Verificar se Autenticação de 2 Fatores está ativada
        if (user.twoFactorEnabled) {
            const preAuthToken = await new SignJWT({ id: user.id, role: user.role, mfa: "PENDING" })
                .setProtectedHeader({ alg: "HS256" })
                .setIssuedAt()
                .setExpirationTime("15m") // 15 minutos para digitar o código
                .sign(secret);

            return NextResponse.json({ 
                success: true, 
                mfaRequired: true, 
                preAuthToken // Enviar para o frontend usar na rota /api/auth/2fa/login
            });
        }

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

        return NextResponse.json({ 
            success: true, 
            user: { 
                id: user.id, 
                email: user.email, 
                name: user.name,
                role: user.role 
            } 
        });
    } catch (error) {
        console.error("Login API Error:", error);
        return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
    }
}
