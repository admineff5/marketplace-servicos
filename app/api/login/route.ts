import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: "E-mail e senha são obrigatórios" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
        }

        // Nota: Em produção usaremos BCrypt. Comparação direta por enquanto para manter paridade com o register.
        if (user.password !== password) {
            return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
        }

        // Criar Sessão (Expires em 15 min)
        const cookieStore = await cookies();
        cookieStore.set("auth_session", JSON.stringify({ id: user.id, role: user.role }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60, // 15 minutos
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
