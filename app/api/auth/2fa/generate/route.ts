import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";
import QRCode from "qrcode";

export async function GET(request: Request) {
    try {
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

        if (!user) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        // 3. Gerar Segredo 2FA (se não existir um ou se quiser zerar)
        let twoFactorSecret = user.twoFactorSecret;
        const otplib = require("otplib");

        if (!twoFactorSecret) {
            twoFactorSecret = otplib.generateSecret();
            // Salvar no banco (desabilitado até verificar)
            await prisma.user.update({
                where: { id: userId },
                data: { twoFactorSecret, twoFactorEnabled: false }
            });
        }

        // 4. Criar OTP Auth URI e QR Code
        const appName = "AgendaJá";
        const otpAuthUrl = otplib.generateURI(user.email, appName, twoFactorSecret);
        const qrCodeDataUrl = await QRCode.toDataURL(otpAuthUrl);

        return NextResponse.json({
            success: true,
            qrCode: qrCodeDataUrl,
            secret: twoFactorSecret // Opcional: mostrar chave de texto se falhar QR Code
        });

    } catch (error) {
        console.error("2FA Generate Error:", error);
        return NextResponse.json({ error: "Erro ao gerar 2FA" }, { status: 500 });
    }
}
