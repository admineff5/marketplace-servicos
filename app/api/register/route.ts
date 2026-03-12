import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, role, cpf } = body;

        if (!email || !password || !name || !cpf) {
            return NextResponse.json({ error: "Campos obrigatórios ausentes (Nome, E-mail, Senha e CPF)" }, { status: 400 });
        }

        // Validação básica de CPF (11 dígitos)
        const cleanCPF = cpf.replace(/\D/g, "");
        if (cleanCPF.length !== 11) {
            return NextResponse.json({ error: "CPF inválido. Deve conter 11 dígitos." }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: "E-mail já cadastrado" }, { status: 400 });
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password,
                role: role || "CLIENT",
                cpf: cleanCPF,
            },
        });

        // Criar Sessão (Expires em 15 min)
        const cookieStore = await cookies();
        cookieStore.set("auth_session", JSON.stringify({ id: user.id, role: user.role }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60, // 15 minutos
            path: "/",
        });

        return NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error("Register API Error:", error);
        return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
    }
}
