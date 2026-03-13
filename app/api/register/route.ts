import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email: rawEmail, password, role, cpf } = body;
        const email = rawEmail?.trim().toLowerCase();

        if (!email || !password || !name || !cpf) {
            return NextResponse.json({ error: "Campos obrigatórios ausentes (Nome, E-mail, Senha e CPF)" }, { status: 400 });
        }

        // Validação básica de CPF (11 dígitos)
        const cleanCPF = cpf.replace(/\D/g, "");
        if (cleanCPF.length !== 11) {
            return NextResponse.json({ error: "CPF inválido. Deve conter 11 dígitos." }, { status: 400 });
        }

        // Validação mínima de senha
        if (password.length < 6) {
            return NextResponse.json({ error: "A senha deve ter no mínimo 6 caracteres." }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: "E-mail já cadastrado" }, { status: 400 });
        }

        // Hash da senha com bcrypt (cost factor 12)
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || "CLIENT",
                cpf: cleanCPF,
            },
        });

        // Se for BUSINESS, cria automaticamente o registro da Empresa
        if (user.role === "BUSINESS") {
            await prisma.company.create({
                data: {
                    ownerId: user.id,
                    name: `Empresa de ${user.name.split(' ')[0]}`,
                    niche: "Serviços",
                }
            });
            console.log(`[SYSTEM] Empresa auto-criada para novo usuário BUSINESS: ${user.id}`);
        }

        // Sessão segura — 7 dias, httpOnly, sameSite lax
        const cookieStore = await cookies();
        cookieStore.set("auth_session", JSON.stringify({ id: user.id, role: user.role }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60, // 7 dias
            path: "/",
        });

        return NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error("Register API Error:", error);
        return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
    }
}
