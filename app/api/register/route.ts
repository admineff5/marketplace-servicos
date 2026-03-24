import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { SignJWT } from "jose";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email: rawEmail, password, role, cpf, phone } = body;
        const email = rawEmail?.trim().toLowerCase();

        if (!email || !password || !name || !cpf || !phone) {
            return NextResponse.json({ error: "Campos obrigatórios ausentes (Nome, E-mail, Senha, CPF e Telefone)" }, { status: 400 });
        }

        const cleanCPF = cpf.replace(/\D/g, "");
        const cleanPhone = phone.replace(/\D/g, "");

        if (cleanCPF.length !== 11) {
            return NextResponse.json({ error: "CPF inválido. Deve conter 11 dígitos." }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: "A senha deve ter no mínimo 6 caracteres." }, { status: 400 });
        }

        // 🔗 Normalização do Telefone para Parear com o WhatsApp (Adiciona 55 se faltar)
        const hasPlus = phone.trim().startsWith("+");
        let normalizedPhone = cleanPhone;
        
        if (!hasPlus && normalizedPhone.length <= 11 && !normalizedPhone.startsWith("55")) {
            normalizedPhone = `55${normalizedPhone}`;
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        // 🔍 1. Verifica se já existe uma conta com esse telefone (Pode ser o robô)
        const existingPhone = await prisma.user.findFirst({ where: { phone: normalizedPhone } });

        if (existingPhone) {
            if (existingPhone.email.includes("@whatsapp.com")) {
                // 🧠 O cliente já tem uma conta de rascunho criada pelo Whatsapp!
                // Nós atualizamos ela com os dados reais do site para não duplicar!
                const verificationToken = crypto.randomUUID();
                const user = await prisma.user.update({
                    where: { id: existingPhone.id },
                    data: {
                        name,
                        email,
                        password: hashedPassword,
                        cpf: cleanCPF,
                        verificationToken,
                    }
                });

                const secretText = process.env.AUTH_SECRET;
                if (!secretText) throw new Error("AUTH_SECRET não configurada");
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
                    maxAge: 7 * 24 * 60 * 60,
                    path: "/",
                });

                // Disparar e-mail de verificação
                await sendVerificationEmail(email, verificationToken);

                return NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
            } else {
                return NextResponse.json({ error: "Celular / WhatsApp já cadastrado no sistema" }, { status: 400 });
            }
        }

        // 🔍 2. Verifica se o E-mail de cadastro já existe
        const existingEmail = await prisma.user.findUnique({ where: { email } });
        if (existingEmail) {
            return NextResponse.json({ error: "E-mail já cadastrado" }, { status: 400 });
        }

        const verificationToken = crypto.randomUUID();
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || "CLIENT",
                cpf: cleanCPF,
                phone: normalizedPhone,
                verificationToken,
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

        // Sessão segura — JWT assinado com jose
        const secretText = process.env.AUTH_SECRET;
        if (!secretText) throw new Error("AUTH_SECRET não configurada");
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

        // Disparar e-mail de verificação
        if (user.verificationToken) {
            await sendVerificationEmail(user.email, user.verificationToken);
        }

        return NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error("Register API Error:", error);
        return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
    }
}
