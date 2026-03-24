import nodemailer from "nodemailer";

export async function sendVerificationEmail(email: string, token: string) {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    // Se as credenciais não estiverem configuradas, loga o link para o desenvolvedor testar
    if (!host || !user || !pass) {
        console.log(`\n[MAIL-MOCK] 🚨 SMTP não configurado no .env!`);
        console.log(`[MAIL-MOCK] Para simular o clique, acesse:`);
        console.log(`http://localhost:3000/api/auth/verify-email?token=${token}\n`);
        return;
    }

    const transporter = nodemailer.createTransport({
        host,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: { user, pass },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verifyLink = `${baseUrl}/api/auth/verify-email?token=${token}`;

    const fromEmail = process.env.SMTP_FROM || user;

    const mailOptions = {
        from: `"AgendaJá" <${fromEmail}>`,
        to: email,
        subject: "Verifique seu E-mail - AgendaJá",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #333;">Bem-vindo ao AgendaJá!</h2>
                <p>Obrigado por se cadastrar. Clique no botão abaixo para verificar sua conta:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verifyLink}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verificar Conta</a>
                </div>
                <p style="color: #666; font-size: 12px;">Se o botão não funcionar, cole o link abaixo no seu navegador:</p>
                <p style="color: #888; font-size: 11px;">${verifyLink}</p>
                <hr style="border-top: 1px solid #eee;" />
                <p style="color: #999; font-size: 11px;">Se você não solicitou este cadastro, desconsidere este e-mail.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[MAIL] E-mail de verificação enviado para ${email}`);
    } catch (error) {
        console.error("[MAIL] Erro ao enviar e-mail:", error);
    }
}
