const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { PrismaClient } = require('@prisma/client');
const { OpenAI } = require('openai');
const pino = require('pino');
const fs = require('fs');
const path = require('path');

// Inicializa Prisma e OpenAI
const prisma = new PrismaClient();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Exige OPENAI_API_KEY no .env
});

const sessions = new Map(); // Mapa para gerenciar múltiplas lojas: { companyId: { sock, status, retries } }

/**
 * 🟢 Inicia ou recupera uma conexão de WhatsApp para uma empresa
 */
async function startSession(companyId) {
    if (sessions.has(companyId)) {
        const current = sessions.get(companyId);
        if (current.status !== 'DISCONNECTED' && current.status !== 'ERROR') return;
    }

    console.log(`[WhatsApp] Iniciando sessão para Company: ${companyId}`);

    const authDir = path.join(__dirname, `../.whatsapp_sessions/${companyId}`);
    if (!fs.existsSync(path.join(__dirname, '../.whatsapp_sessions'))) {
        fs.mkdirSync(path.join(__dirname, '../.whatsapp_sessions'));
    }

    const { state, saveCreds } = await useMultiFileAuthState(authDir);

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'error' }), // Continua logando erros reais
    });

    const sessionData = { sock, status: 'INITIALIZING', retries: (sessions.get(companyId)?.retries || 0) };
    sessions.set(companyId, sessionData);

    sock.ev.on('creds.update', saveCreds);

    // 🔄 Monitorar Mudanças de Conexão
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log(`[WhatsApp] [${companyId}] Novo QR Code Gerado.`);
            try {
                const qrImage = await require('qrcode').toDataURL(qr, { width: 300 });
                await prisma.whatsappSession.upsert({
                    where: { companyId },
                    update: { qrCode: qrImage, status: 'QRCODE' },
                    create: { companyId, qrCode: qrImage, status: 'QRCODE' }
                });
            } catch (qrErr) {
                console.error("[WhatsApp] Erro ao gerar Imagem do QR Code:", qrErr);
            }
        }

        if (connection === 'open') {
            const myNumber = sock.user.id.split(':')[0];
            console.log(`[WhatsApp] [${companyId}] ✅ Conectado! Numero: ${myNumber}`);

            await prisma.whatsappSession.update({
                where: { companyId },
                data: { status: 'CONNECTED', qrCode: null, number: myNumber }
            });

            sessions.set(companyId, { sock, status: 'CONNECTED', retries: 0 }); // Reseta Contador
        }

        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

            console.log(`[WhatsApp] [${companyId}] Conexão fechada. Motivo: ${statusCode}.`);

            const currentSession = sessions.get(companyId) || { retries: 0 };
            const currentRetries = currentSession.retries + 1;

            if (shouldReconnect && currentRetries <= 3) {
                console.log(`[WhatsApp] [${companyId}] Tentando reconectar (${currentRetries}/3) em 5s...`);
                sessions.set(companyId, { ...currentSession, retries: currentRetries });
                
                setTimeout(() => {
                    // Limpa instâncias velhas antes de reconectar
                    sessions.delete(companyId);
                    startSession(companyId);
                }, 5000);
            } else {
                // Esgotou tentativas ou foi Logout
                const finalStatus = shouldReconnect ? 'ERROR' : 'DISCONNECTED';
                console.log(`[WhatsApp] [${companyId}] ❌ Parando tentativas. Status Final: ${finalStatus}`);

                await prisma.whatsappSession.update({
                    where: { companyId },
                    data: { status: finalStatus, qrCode: null }
                });

                if (finalStatus === 'DISCONNECTED' && fs.existsSync(authDir)) {
                    fs.rmSync(authDir, { recursive: true, force: true });
                }
                sessions.delete(companyId);
            }
        }
    });

    // 📩 Monitorar Mensagens
    sock.ev.on('messages.upsert', async (m) => {
        if (m.type !== 'notify') return;

        const message = m.messages[0];
        if (!message.message || message.key.fromMe) return;

        const senderJid = message.key.remoteJid;
        const senderNum = senderJid.split('@')[0];
        const senderName = message.pushName || "Cliente";

        let text = message.message.conversation || message.message.extendedTextMessage?.text;
        if (!text) return;

        await prisma.whatsappMessage.create({
            data: { companyId, from: 'CLIENT', senderName, senderNum, content: text }
        });

        try {
            const answers = await prisma.companyAnswer.findMany({
                where: { companyId },
                include: { question: true }
            });

            let rulesContext = `Você é um assistente de IA. Responda educadamente:\n`;
            if (answers.length > 0) {
                answers.forEach(ans => { rulesContext += `- ${ans.question.question}: ${ans.answer}\n`; });
            }

            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{ role: "system", content: rulesContext }, { role: "user", content: text }],
                max_tokens: 500
            });

            const reply = completion.choices[0].message.content;
            await sock.sendMessage(senderJid, { text: reply });

            await prisma.whatsappMessage.create({
                data: { companyId, from: 'AI', senderName: 'Assistente IA', senderNum: 'AI', content: reply }
            });

        } catch (error) {
            console.error(`[WhatsApp] [${companyId}] Erro OpenAI:`, error);
        }
    });
}

async function monitorSessions() {
    console.log("[WhatsApp] Monitorando sessões no banco de dados...");

    setInterval(async () => {
        try {
            const dbSessions = await prisma.whatsappSession.findMany();

            for (const row of dbSessions) {
                const { companyId, status } = row;

                if (status === 'DISCONNECTING' || status === 'DISCONNECTED') {
                    const active = sessions.get(companyId);
                    if (active && active.sock) {
                        try { await active.sock.logout(); } catch {}
                    }
                } 
                else if (status === 'QRCODE' || status === 'CONNECTED') {
                    if (!sessions.has(companyId)) {
                        startSession(companyId);
                    }
                }
            }
        } catch (error) {
            console.error("[WhatsApp] Erro monitoramento:", error);
        }
    }, 5000);
}

monitorSessions();
