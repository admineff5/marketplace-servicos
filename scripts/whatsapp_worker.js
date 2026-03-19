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

const sessions = new Map(); // Mapa para gerenciar múltiplas lojas/sessões ativas

/**
 * 🟢 Inicia ou recupera uma conexão de WhatsApp para uma empresa
 */
async function startSession(companyId) {
    if (sessions.has(companyId)) return;

    console.log(`[WhatsApp] Iniciando sessão para Company: ${companyId}`);

    const authDir = path.join(__dirname, `../.whatsapp_sessions/${companyId}`);
    if (!fs.existsSync(path.join(__dirname, '../.whatsapp_sessions'))) {
        fs.mkdirSync(path.join(__dirname, '../.whatsapp_sessions'));
    }

    const { state, saveCreds } = await useMultiFileAuthState(authDir);

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false, // Desativado para não poluir o terminal, salvamos no banco
        logger: pino({ level: 'silent' }),
    });

    // Salva o socket e o status no mapa em memória
    sessions.set(companyId, { sock, status: 'INITIALIZING' });

    // Atualiza credenciais sempre que houver alteração (tokens de sessão)
    sock.ev.on('creds.update', saveCreds);

    // 🔄 Monitorar Mudanças de Conexão (QR Code, Conectado, Caiu)
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;



        if (connection === 'open') {
            const myNumber = sock.user.id.split(':')[0]; // Ex: 5511999998888
            console.log(`[WhatsApp] [${companyId}] ✅ Conectado com Sucesso! Numero: ${myNumber}`);

            await prisma.whatsappSession.update({
                where: { companyId },
                data: { status: 'CONNECTED', qrCode: null, number: myNumber }
            });

            sessions.set(companyId, { sock, status: 'CONNECTED' });
        }

        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

            console.log(`[WhatsApp] [${companyId}] Conexão fechada. Motivo: ${statusCode}. Reconectando: ${shouldReconnect}`);

            if (shouldReconnect) {
                // Tenta reconectar em 5 segundos
                sessions.delete(companyId);
                setTimeout(() => startSession(companyId), 5000);
            } else {
                // Foi logout (Usuário desconectou pelo Dashboard)
                console.log(`[WhatsApp] [${companyId}] ❌ Desconectado permanentemente.`);
                await prisma.whatsappSession.update({
                    where: { companyId },
                    data: { status: 'DISCONNECTED', qrCode: null }
                });

                // Deleta pasta de credenciais localmente
                if (fs.existsSync(authDir)) {
                    fs.rmSync(authDir, { recursive: true, force: true });
                }
                sessions.delete(companyId);
            }
        }
    });

    // 📩 Monitorar Mensagens Recebidas (Interação com a IA)
    sock.ev.on('messages.upsert', async (m) => {
        if (m.type !== 'notify') return;

        const message = m.messages[0];
        if (!message.message || message.key.fromMe) return;

        const senderJid = message.key.remoteJid;
        const senderNum = senderJid.split('@')[0];
        const senderName = message.pushName || "Cliente";

        let text = message.message.conversation || message.message.extendedTextMessage?.text;

        if (!text) return; // Se for áudio, imagem, ignora por agora para não quebrar a lógica

        console.log(`[WhatsApp] [${companyId}] Mensagem de ${senderName} (${senderNum}): ${text}`);

        // Salva a mensagem do Cliente no banco (Para o Dashboard)
        await prisma.whatsappMessage.create({
            data: {
                companyId,
                from: 'CLIENT',
                senderName,
                senderNum,
                content: text
            }
        });

        // 🧠 Chamar OpenAI para Responder
        try {
            // 1. Busca Perguntas e Respostas do FAQ salva pela empresa
            const answers = await prisma.companyAnswer.findMany({
                where: { companyId },
                include: { question: true }
            });

            // 2. Constrói o Prompt com as regras que o empresário respondeu
            let rulesContext = `Você é um assistente de IA da empresa. Você deve responder educadamente no WhatsApp.
Aqui estão as regras, dúvidas e procedimentos da nossa empresa que você DEVE seguir rigorosamente:\n`;

            if (answers.length > 0) {
                answers.forEach(ans => {
                    rulesContext += `- ${ans.question.question}: ${ans.answer}\n`;
                });
            } else {
                rulesContext += "- Nenhuma regra cadastrada. Seja educado e pegue os dados para retornarmos mais tarde.\n";
            }

            // 3. Executa a requisição do GPT-4o
            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: rulesContext },
                    { role: "user", content: text }
                ],
                max_tokens: 500
            });

            const reply = completion.choices[0].message.content;

            console.log(`[WhatsApp] [${companyId}] 🤖 Resposta da IA: ${reply}`);

            // Envia no WhatsApp de volta
            await sock.sendMessage(senderJid, { text: reply });

            // Salva a resposta da IA no Dashboard
            await prisma.whatsappMessage.create({
                data: {
                    companyId,
                    from: 'AI',
                    senderName: 'Assistente IA',
                    senderNum: 'AI',
                    content: reply
                }
            });

        } catch (error) {
            console.error(`[WhatsApp] [${companyId}] Erro ao chamar OpenAI ou enviar mensagem:`, error);
        }
    });
}

/**
 * 🔄 Loop global de rastreamento de sessões no banco de dados
 */
async function monitorSessions() {
    console.log("[WhatsApp] Monitorando sessões no banco de dados...");

    setInterval(async () => {
        try {
            const dbSessions = await prisma.whatsappSession.findMany();

            for (const row of dbSessions) {
                const { companyId, status } = row;

                // 1. Se o banco diz para desconectar
                if (status === 'DISCONNECTING' || status === 'DISCONNECTED') {
                    const active = sessions.get(companyId);
                    if (active && active.status === 'CONNECTED') {
                        console.log(`[WhatsApp] [${companyId}] Desconectando via ordem do banco...`);
                        await active.sock.logout();
                    }
                } 
                // 2. Se a sessão está habilitada no banco mas não está ativa na memória
                else if (status === 'QRCODE' || status === 'CONNECTED' || status === 'DISCONNECTED') {
                    // Se não está na memória (worker caiu e voltou) ou empresário mandou ligar
                    if (!sessions.has(companyId)) {
                        startSession(companyId);
                    }
                }
            }
        } catch (error) {
            console.error("[WhatsApp] Erro no Loop de monitoramento:", error);
        }
    }, 5000); // Roda a cada 5 segundos
}

// Inicia o processo
monitorSessions();
