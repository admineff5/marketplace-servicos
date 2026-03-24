const nodemailer = require("nodemailer");
require("dotenv").config(); // Carrega o .env

async function run() {
    console.log("=== INICIANDO TESTE SMTP ===");
    console.log("SMTP_HOST:", process.env.SMTP_HOST);
    console.log("SMTP_PORT:", process.env.SMTP_PORT);
    console.log("SMTP_SECURE:", process.env.SMTP_SECURE);
    console.log("SMTP_USER:", process.env.SMTP_USER);
    console.log("SMTP_FROM:", process.env.SMTP_FROM);
    console.log("----------------------------");

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        await transporter.verify();
        console.log("✅ Conexão SMTP estabelecida com SUCESSO!");

        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: process.env.SMTP_USER, // Envia para ele mesmo como teste
            subject: "📩 Teste de SMTP - AgendaJá",
            text: "Seu teste de e-mail corporativo funcionou perfeitamente!"
        });

        console.log("✅ Email de teste enviado com sucesso!", info.messageId);
    } catch (error) {
        console.error("❌ ERRO NO SMTP:", error);
    }
}

run();
