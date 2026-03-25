const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf8');
            content.split('\n').forEach(line => {
                const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
                if (match) {
                    const key = match[1];
                    let value = match[2] || "";
                    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
                    process.env[key] = value.trim();
                }
            });
        }
    } catch (e) {}
}

loadEnv();

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
        family: 4, // 🔴 FORÇA O USO DE IPV4 PARA EVITAR ERROS DE REDE/V6
        tls: {
            rejectUnauthorized: false // 🔴 Ignora erros de SSL para diagnóstico
        }
    });

    try {
        await transporter.verify();
        console.log("✅ Conexão SMTP estabelecida com SUCESSO!");

        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: process.argv[2] || process.env.SMTP_USER, // 🔴 Permite testar com um email externo pelo terminal
            subject: "📩 Teste de SMTP - AgendaJá",
            text: "Seu teste de e-mail corporativo funcionou perfeitamente!"
        });

        console.log("✅ Email de teste enviado com sucesso!", info.messageId);
    } catch (error) {
        console.error("❌ ERRO NO SMTP:", error);
    }
}

run();
