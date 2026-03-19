const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { PrismaClient } = require('@prisma/client');
const { GoogleGenAI } = require('@google/genai');
const pino = require('pino');
const fs = require('fs');
const path = require('path');

// 🛠️ Carrega variáveis do arquivo .env nativamente (Node 20+)
if (typeof process.loadEnvFile === 'function') {
    try {
        process.loadEnvFile(path.join(__dirname, '../.env'));
    } catch (e) {
        // Ignora se não houver .env ou outro erro
    }
}

// Inicializa Prisma e Gemini
const prisma = new PrismaClient();
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY, 
});

const sessions = new Map(); 

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
    const { version } = await fetchLatestBaileysVersion(); 

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        version, 
        browser: ['Chrome (Linux)', 'Chrome', '120.0.0'], 
        logger: pino({ level: 'error' }), 
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

            sessions.set(companyId, { sock, status: 'CONNECTED', retries: 0 }); 
        }

        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

            console.log(`[WhatsApp] [${companyId}] Conexão fechada. Motivo: ${statusCode}.`);
            
            if (lastDisconnect?.error) {
                console.log(`[WhatsApp] [${companyId}] Erro Técnico Detalhado:`, lastDisconnect?.error);
            }

            const currentSession = sessions.get(companyId) || { retries: 0 };
            const currentRetries = currentSession.retries + 1;

            if (shouldReconnect && currentRetries <= 3) {
                console.log(`[WhatsApp] [${companyId}] Tentando reconectar (${currentRetries}/3) em 5s...`);
                
                sessions.set(companyId, { ...currentSession, status: 'DISCONNECTED', retries: currentRetries });
                
                setTimeout(() => {
                    startSession(companyId);
                }, 5000);
            } else {
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

            let rulesContext = `Você é um assistente de IA. Responda educadamente utilizando este FAQ como base:\n`;
            if (answers.length > 0) {
                answers.forEach(ans => { rulesContext += `- ${ans.question.question}: ${ans.answer}\n`; });
            }

            // 🤖 Chamada ao Gemini 2.5 Flash
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: text,
                config: {
                    systemInstruction: rulesContext,
                }
            });



        } catch (error) {
            console.error(`[WhatsApp] [${companyId}] Erro Gemini:`, error);
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
