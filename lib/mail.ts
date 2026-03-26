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

    const smtpport = Number(process.env.SMTP_PORT) || 587;
    const transporter = nodemailer.createTransport({
        host,
        port: smtpport,
        secure: smtpport === 465 || process.env.SMTP_SECURE === "true", // STARTTLS friendly
        auth: { user, pass },
        tls: { rejectUnauthorized: false }, // Previne rejeição se o certificado do cPanel for self-signed
        family: 4, // FORÇA O USO DE IPV4 PARA EVITAR ERROS DE REDE/V6 EM SERVIDORES VPS
        logger: true, // 🔴 EXTREME LOGGING ACTIVE
        debug: true   // 🔴 MOSTRA MENSAGENS SMTP NA INTEGRA
    } as any);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verifyLink = `${baseUrl}/api/auth/verify-email?token=${token}`;

    const fromEmail = process.env.SMTP_FROM || user;

    const mailOptions = {
        from: `"AgendaJá" <${fromEmail}>`,
        to: email,
        subject: "Verifique seu E-mail - AgendaJá",
        // Fallback em Texto Puro obrigatório para passar pelo AntiSpam do Gmail e Hotmail
        text: `Bem-vindo ao AgendaJá!\n\nSeu código de verificação é: ${token}\n\nDigite este código na tela de verificação do site.\n\nSe você não solicitou este cadastro, desconsidere.`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #333; text-align: center;">Bem-vindo ao AgendaJá!</h2>
                <p style="text-align: center; color: #555;">Obrigado por se cadastrar. Use o código abaixo para verificar sua conta:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <span style="display: inline-block; background-color: #f4f4f4; border: 2px dashed #ccc; padding: 15px 30px; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; border-radius: 8px;">
                        ${token}
                    </span>
                </div>
                
                <p style="text-align: center; color: #666; font-size: 14px;">Digite este código na tela de verificação do site.</p>
                <hr style="border-top: 1px solid #eee; margin-top: 30px;" />
                <p style="color: #999; font-size: 11px; text-align: center;">Se você não solicitou este cadastro, desconsidere este e-mail.</p>
            </div>
        `,
    };

    try {
        console.log(`\n[MAIL-DIAGNOSTIC] 🟡 Iniciando Transmissão de E-mail para ${email}...`);
        console.log(`[MAIL-DIAGNOSTIC] Configs: HOST=${host} | PORT=${smtpport} | SECURE=${smtpport === 465 || process.env.SMTP_SECURE === "true"}`);
        
        const info = await transporter.sendMail(mailOptions);
        console.log(`[MAIL-DIAGNOSTIC] ✅ Sucesso absoluto! Resposta SMTP:`, info.response);
    } catch (error: any) {
        console.error(`\n======================================================`);
        console.error(`[MAIL-CRITICAL-ERROR] ❌ DETALHES DA FALHA DE ENVIO`);
        console.error(`======================================================`);
        console.error(`Status de Erro:`, error.message);
        console.error(`Código de Erro do SMTP:`, error.code);
        console.error(`Comando que Falhou:`, error.command);
        console.error(`Stack Trace:`, error.stack);
        console.error(`======================================================\n`);
    }
}
