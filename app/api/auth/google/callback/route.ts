import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { SignJWT } from "jose";
import bcrypt from "bcrypt";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");
        const state = searchParams.get("state") || "CLIENT"; // Papel (role) do usuário

        if (!code) {
            return NextResponse.json({ error: "Code não fornecido pelo Google" }, { status: 400 });
        }

        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUri = `${new URL(request.url).origin}/api/auth/google/callback`;

        if (!clientId || !clientSecret) {
            return NextResponse.json({ error: "Credenciais do Google não configuradas no servidor" }, { status: 500 });
        }

        // 1. Trocar Code por Token
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: "authorization_code",
            }),
        });

        const tokenData = await tokenResponse.json();
        if (tokenData.error) {
            return NextResponse.json({ error: tokenData.error_description || "Erro ao obter token do Google" }, { status: 400 });
        }

        const accessToken = tokenData.access_token;

        // 2. Obter Dados do Perfil do Usuário
        const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const profile = await profileResponse.json();
        if (profile.error) {
            return NextResponse.json({ error: "Erro ao obter perfil do Google" }, { status: 400 });
        }

        const { sub: googleId, email, name, picture } = profile;

        if (!email) {
            return NextResponse.json({ error: "E-mail não retornado pelo Google" }, { status: 400 });
        }

        // 3. Procurar usuário no banco de dados
        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { googleId },
                    { email: email.toLowerCase() }
                ]
            }
        });

        // 4. Se não existe, cadastrar
        if (!user) {
            const randomPassword = await bcrypt.hash(crypto.randomUUID(), 12);
            user = await prisma.user.create({
                data: {
                    name,
                    email: email.toLowerCase(),
                    googleId,
                    password: randomPassword, // Senha aleatória para conta OAuth
                    role: state === "BUSINESS" ? "BUSINESS" : "CLIENT",
                    imageUrl: picture || null,
                }
            });
        } else if (!user.googleId) {
            // Se o usuário já existia por e-mail, vincular o GoogleId
            user = await prisma.user.update({
                where: { id: user.id },
                data: { googleId, imageUrl: user.imageUrl || picture || null }
            });
        }

        // 5. Emitir Sessão (Cookie JWT assinado)
        const secretText = process.env.AUTH_SECRET;
        if (!secretText) {
            throw new Error("AUTH_SECRET não está definida no ambiente");
        }
        const secret = new TextEncoder().encode(secretText);

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

        // 6. Redirecionar para o Dashboard correspondente
        const redirectUrl = user.role === "CLIENT" ? "/cliente" : "/dashboard";
        return NextResponse.redirect(new URL(redirectUrl, request.url));

    } catch (error) {
        console.error("Google Callback Error:", error);
        return NextResponse.json({ error: "Erro interno ao processar login com Google" }, { status: 500 });
    }
}
