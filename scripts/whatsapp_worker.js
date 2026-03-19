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
 * 📅 Helper: Consulta Horários Disponíveis
 */
async function consultarDisponibilidade(employeeId, dateStr) {
    try {
        const minTime = "09:00";
        const maxTime = "18:00";
        const intervalMinutes = 30; // 30min padrão de slot de agendamento
        
        // 1. Busca agendamentos desse profissional nesta data
        const appointments = await prisma.appointment.findMany({
            where: {
                employeeId,
                date: {
                    gte: new Date(`${dateStr}T00:00:00.000Z`),
                    lte: new Date(`${dateStr}T23:59:59.999Z`)
                },
                status: { not: 'CANCELLED' }
            }
        });

        const busyTimes = appointments.map(app => {
            const d = new Date(app.date);
            return d.getUTCHours().toString().padStart(2, '0') + ":" + d.getUTCMinutes().toString().padStart(2, '0');
        });

        // 2. Gera os slots possíveis
        let list = [];
        let current = new Date(`${dateStr}T${minTime}:00.000Z`);
        let end = new Date(`${dateStr}T${maxTime}:00.000Z`);

        while (current < end) {
            const timeStr = current.getUTCHours().toString().padStart(2, '0') + ":" + current.getUTCMinutes().toString().padStart(2, '0');
            if (!busyTimes.includes(timeStr)) {
                list.push(timeStr);
            }
            current.setUTCMinutes(current.getUTCMinutes() + intervalMinutes);
        }

        if (list.length === 0) return "Nenhum horário disponível para esta data.";
        return `Horários disponíveis em ${dateStr}: ${list.join(", ")}`;

    } catch (err) {
        return `Erro ao consultar disponibilidade: ${err.message}`;
    }
}

/**
 * 📝 Helper: Cria um Agendamento
 */
async function criarAgendamento(employeeId, serviceId, locationId, clientPhone, dateTimeStr, companyId) {
    try {
        // Busca usuário pelo telefone
        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { phone: clientPhone },
                    { phone: `+55${clientPhone}` },
                    { phone: `${clientPhone.substring(2)}` } // fallback sem ddd se salvo sem ddd
                ]
            }
        });

        if (!user) {
            return "Falha ao agendar: Seu telefone não possui cadastro prévio no nosso sistema. Por favor, cadastre-se no site para poder agendar diretamente pelo WhatsApp!";
        }

        const appointment = await prisma.appointment.create({
            data: {
                companyId,
                employeeId,
                serviceId,
                locationId,
                userId: user.id,
                date: new Date(`${dateTimeStr}:00.000Z`), // formato de entrada esperado: YYYY-MM-DDTHH:MM
                status: 'CONFIRMED'
            }
        });

        return `✅ Agendamento realizado com sucesso para o dia e hora ${dateTimeStr}. Atendimento confirmado!`;

    } catch (err) {
        return `Erro ao criar agendamento: ${err.message}`;
    }
}

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
                setTimeout(() => { startSession(companyId); }, 5000);
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
            // 🏢 Busca os Dados Completos da Empresa
            const company = await prisma.company.findUnique({
                where: { id: companyId },
                include: { locations: true, services: true, employees: true }
            });

            // ❓ Busca o FAQ (Respostas Personalizadas)
            const answers = await prisma.companyAnswer.findMany({
                where: { companyId },
                include: { question: true }
            });

            if (!company) return;

            // 🧠 Constrói as regras e o contexto da IA
            let rulesContext = `Você é uma secretária e assistente virtual educada representeando a empresa "${company.name}".\n`;
            rulesContext += `Nicho de atuação: ${company.niche}\n\n`;

            rulesContext += `Siga rigorosamente as seguintes instruções para responder:\n`;
            rulesContext += `- **Seja curta e objetiva**: Não mande textos gigantescos.\n`;
            rulesContext += `- **Agendamentos**: Se o cliente quiser agendar, use a ferramenta de consulta para ver horários livres e DEPOIS a ferramenta de criação de agendamento se ele confirmar.\n`;
            rulesContext += `- **Informações**: Use os dados abaixo para fundamentar as suas respostas.\n\n`;

            rulesContext += `--- 📍 DADOS DA EMPRESA ---\n\n`;

            if (company.locations.length > 0) {
                rulesContext += `Endereços / Localizações:\n`;
                company.locations.forEach(loc => {
                    rulesContext += `- ${loc.name} (id: ${loc.id}): ${loc.address}, ${loc.number} - ${loc.neighborhood}, ${loc.city}/${loc.state}\n`;
                });
                rulesContext += `\n`;
            }

            if (company.services.length > 0) {
                rulesContext += `Serviços e Preços:\n`;
                company.services.forEach(svc => {
                    rulesContext += `- ${svc.name} (id: ${svc.id}): R$ ${svc.price}${svc.duration ? ` (${svc.duration} min)` : ''}\n`;
                });
                rulesContext += `\n`;
            }

            if (company.employees.length > 0) {
                rulesContext += `Profissionais / Equipe:\n`;
                company.employees.forEach(emp => {
                    rulesContext += `- ${emp.name} (id: ${emp.id})${emp.role ? ` (${emp.role})` : ''}${emp.hours ? ` - Horário: ${emp.hours}` : ''}${emp.locationId ? ` [Unidade: ${emp.locationId}]` : ''}\n`;
                });
                rulesContext += `\n`;
            }

            if (answers.length > 0) {
                rulesContext += `Informações Adicionais (FAQ):\n`;
                answers.forEach(ans => { rulesContext += `- ${ans.question.question}: ${ans.answer}\n`; });
                rulesContext += `\n`;
            }

            rulesContext += `\n--- FIM DOS DADOS ---\n`;

            // 🤖 Configuração de Ferramentas (Tools) para o Gemini
            const toolDeclarations = [{
                functionDeclarations: [
                    {
                        name: "consultarDisponibilidade",
                        description: "Consulta os horários livres de um profissional na data especificada (formato YYYY-MM-DD)",
                        parameters: {
                            type: "OBJECT",
                            properties: {
                                employeeId: { type: "STRING", description: "O ID do funcionário obtido nos dados da empresa" },
                                date: { type: "STRING", description: "Data no formato YYYY-MM-DD" },
                            },
                            required: ["employeeId", "date"],
                        },
                    },
                    {
                        name: "criarAgendamento",
                        description: "Reserva um horário para o cliente.",
                        parameters: {
                            type: "OBJECT",
                            properties: {
                                employeeId: { type: "STRING", description: "O ID do funcionário consultado" },
                                serviceId: { type: "STRING", description: "O ID do serviço escolhido" },
                                locationId: { type: "STRING", description: "O ID da localização/unidade" },
                                dateTime: { type: "STRING", description: "Data e Hora no formato ISO (YYYY-MM-DDTHH:MM)" },
                            },
                            required: ["employeeId", "serviceId", "locationId", "dateTime"],
                        },
                    }
                ]
            }];

            let contents = [
                { role: 'user', parts: [{ text: text }] }
            ];

            let response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: contents,
                config: {
                    systemInstruction: rulesContext,
                    tools: toolDeclarations
                }
            });

            // 🔁 Loop de Function Calling
            while (response.functionCalls && response.functionCalls.length > 0) {
                contents.push(response.candidates[0].content); // Salva a intenção da IA no histórico

                for (const call of response.functionCalls) {
                    let functionResponse;

                    if (call.name === 'consultarDisponibilidade') {
                        const data = await consultarDisponibilidade(call.args.employeeId, call.args.date);
                        functionResponse = { name: call.name, response: { result: data } };
                    } 
                    else if (call.name === 'criarAgendamento') {
                        const data = await criarAgendamento(call.args.employeeId, call.args.serviceId, call.args.locationId, senderNum, call.args.dateTime, companyId);
                        functionResponse = { name: call.name, response: { result: data } };
                    }

                    contents.push({
                        role: 'function',
                        parts: [{ functionResponse: functionResponse }]
                    });
                }

                // Chama o Gemini novamente com a resposta da função
                response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: contents,
                    config: {
                        systemInstruction: rulesContext,
                        tools: toolDeclarations
                    }
                });
            }

            const reply = response.text;
            await sock.sendMessage(senderJid, { text: reply });

            await prisma.whatsappMessage.create({
                data: { companyId, from: 'AI', senderName: 'Assistente IA', senderNum: senderNum, content: reply }
            });

        } catch (error) {
            console.error(`[WhatsApp] [${companyId}] Erro Gemini/Tools:`, error);
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
                    if (active && active.sock) { try { await active.sock.logout(); } catch {} }
                } else if (status === 'QRCODE' || status === 'CONNECTED') {
                    if (!sessions.has(companyId)) { startSession(companyId); }
                }
            }
        } catch (error) { console.error("[WhatsApp] Erro monitoramento:", error); }
    }, 5000);
}

monitorSessions();
