const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { PrismaClient } = require('@prisma/client');
const { GoogleGenAI } = require('@google/genai');
const pino = require('pino');
const fs = require('fs');
const path = require('path');

if (typeof process.loadEnvFile === 'function') {
    try {
        process.loadEnvFile(path.join(__dirname, '../.env'));
    } catch (e) {}
}

const prisma = new PrismaClient();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const sessions = new Map(); 

async function consultarDisponibilidade(employeeId, dateStr) {
    try {
        const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
        if (!employee) return "Erro: profissional não encontrado.";

        // 📅 Verificar Dias da Semana (Ex: Segunda a Sexta)
        const date = new Date(`${dateStr}T00:00:00.000Z`);
        const dayOfWeek = date.getUTCDay(); // 0=Dom, 1=Seg, ..., 6=Sab
        
        function worksOn(hoursStr, day) {
             const h = hoursStr.toLowerCase();
             if (h.includes("segunda a sexta")) return day >= 1 && day <= 5;
             if (h.includes("segunda a sábado")) return day >= 1 && day <= 6;
             if (h.includes("terça a sábado")) return day >= 2 && day <= 6;
             if (h.includes("terça a domingo")) return day >= 2 || day === 0;
             if (h.includes("sábado e domingo")) return day === 0 || day === 6;
             return true;
        }

        if (employee.hours && !worksOn(employee.hours, dayOfWeek)) {
             return `❌ Este profissional não atende neste dia da semana (${dateStr}).`;
        }

        let minTime = "09:00";
        let maxTime = "18:00";
        
        if (employee.hours && employee.hours.includes("|")) {
             const h = employee.hours.split("|")[1] || employee.hours;
             const match = h.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
             if (match) {
                  minTime = match[1];
                  maxTime = match[2];
             }
        }

        const intervalMinutes = 30; 
        
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

        let list = [];
        let current = new Date(`${dateStr}T${minTime}:00.000Z`);
        let end = new Date(`${dateStr}T${maxTime}:00.000Z`);

        while (current < end) {
            const timeStr = current.getUTCHours().toString().padStart(2, '0') + ":" + current.getUTCMinutes().toString().padStart(2, '0');
            if (!busyTimes.includes(timeStr)) { list.push(timeStr); }
            current.setUTCMinutes(current.getUTCMinutes() + intervalMinutes);
        }

        if (list.length === 0) return "Nenhum horário disponível";
        return `Horários livres em ${dateStr}: ${list.join(", ")}`;
    } catch (err) { return `Erro: ${err.message}`; }
}

async function registrarCliente(nome, clientPhone) {
    try {
        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { phone: clientPhone },
                    { phone: { startsWith: clientPhone.substring(0, 11) } }
                ],
                role: 'CLIENT'
            }
        });

        if (user) {
            return `✅ Cadastro vinculado ao seu perfil existente **${nome}**!`;
        }

        await prisma.user.create({
            data: {
                name: nome,
                email: `${clientPhone}@whatsapp.com`,
                phone: clientPhone,
                role: 'CLIENT',
                password: 'whatsapp_generated_temp_pass'
            }
        });

        return `✅ Cadastro realizado com sucesso para **${nome}**!`;
    } catch (err) { return `Erro: ${err.message}`; }
}

async function criarAgendamento(employeeId, serviceId, locationId, clientPhone, dateTimeStr, companyId) {
    try {
        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { phone: clientPhone },
                    { phone: { startsWith: clientPhone.substring(0, 11) } }
                ],
                role: 'CLIENT'
            }
        });

        if (!user) {
            return "Erro: Você não possui cadastro no site com este telefone. Por favor, escreva seu nome completo para que eu possa te registrar!";
        }

        await prisma.appointment.create({
            data: {
                companyId, employeeId, serviceId, locationId, userId: user.id,
                date: new Date(`${dateTimeStr}:00.000Z`),
                status: 'PENDING' // 👈 Agora cai como pendente para aprovação no painel
            }
        });

        return `✅ Agendamento realizado com sucesso para ${dateTimeStr}!`;
    } catch (err) { return `Erro: ${err.message}`; }
}

async function startSession(companyId) {
    if (sessions.has(companyId)) {
        const current = sessions.get(companyId);
        if (current.status !== 'DISCONNECTED' && current.status !== 'ERROR') return;
    }

    console.log(`[WhatsApp] Iniciando sessão para Company: ${companyId}`);
    const authDir = path.join(__dirname, `../.whatsapp_sessions/${companyId}`);
    if (!fs.existsSync(path.join(__dirname, '../.whatsapp_sessions'))) { fs.mkdirSync(path.join(__dirname, '../.whatsapp_sessions')); }

    const { state, saveCreds } = await useMultiFileAuthState(authDir);
    const { version } = await fetchLatestBaileysVersion(); 

    const sock = makeWASocket({
        auth: state, version, printQRInTerminal: false,
        browser: ['Chrome (Linux)', 'Chrome', '120.0.0'], 
        logger: pino({ level: 'error' }), 
    });

    sessions.set(companyId, { sock, status: 'INITIALIZING', retries: (sessions.get(companyId)?.retries || 0) });
    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            try {
                const qrImage = await require('qrcode').toDataURL(qr, { width: 300 });
                await prisma.whatsappSession.upsert({
                    where: { companyId },
                    update: { qrCode: qrImage, status: 'QRCODE' },
                    create: { companyId, qrCode: qrImage, status: 'QRCODE' }
                });
            } catch {}
        }

        if (connection === 'open') {
            const myNumber = sock.user.id.split(':')[0];
            await prisma.whatsappSession.update({ where: { companyId }, data: { status: 'CONNECTED', qrCode: null, number: myNumber } });
            sessions.set(companyId, { sock, status: 'CONNECTED', retries: 0 }); 
        }

        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut; 
            const currentSession = sessions.get(companyId) || { retries: 0 };
            const currentRetries = currentSession.retries + 1;

            console.log(`[WhatsApp] [${companyId}] Conexão fechada. Status: ${statusCode}`);

            if (shouldReconnect && currentRetries <= 3) {
                sessions.set(companyId, { ...currentSession, status: 'DISCONNECTED', retries: currentRetries });
                setTimeout(() => { startSession(companyId); }, 5000);
            } else {
                console.log(`[WhatsApp] [${companyId}] ❌ Forçando reset de sessão para gerar novo QR Code.`);
                
                await prisma.whatsappSession.update({ where: { companyId }, data: { status: 'QRCODE', qrCode: null } });
                
                if (fs.existsSync(authDir)) {
                    try { fs.rmSync(authDir, { recursive: true, force: true }); } catch {}
                }
                
                // 🛑 CORREÇÃO: Mantém no Map para que o loop de monitoramento não duplique a conexão!
                sessions.set(companyId, { status: 'RESTARTING', retries: 0 }); 

                setTimeout(() => { 
                    const check = sessions.get(companyId);
                    if (check && check.status === 'RESTARTING') {
                        sessions.delete(companyId); 
                        startSession(companyId); 
                    }
                }, 3000); 
            }
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
        if (m.type !== 'notify') return;
        const message = m.messages[0];
        if (!message.message || message.key.fromMe) return;

        const senderJid = message.remoteJid || message.key.remoteJid;
        const altJid = message.key && message.key.remoteJidAlt;
        const senderNum = altJid ? altJid.split('@')[0] : senderJid.split('@')[0].split(':')[0];
        const senderName = message.pushName || "Cliente";
        let text = message.message.conversation || message.message.extendedTextMessage?.text;
        if (!text) return;

        await prisma.whatsappMessage.create({ data: { companyId, from: 'CLIENT', senderName, senderNum, content: text } });

        // 🔬 DEBUG HOOK: Dump do pacote Baileys para verificação
        try {
            const fs = require('fs');
            const path = require('path');
            const debugPath = path.join(__dirname, 'baileys_debug.txt');
            const debugData = {
                timestamp: new Date().toISOString(),
                senderJid: message.remoteJid || message.key.remoteJid,
                pushName: message.pushName,
                messageContent: text,
                fullPacket: message
            };
            fs.appendFileSync(debugPath, JSON.stringify(debugData, null, 2) + '\n');
            console.log(`[DEBUG] Pacote logado em ${debugPath}`);
        } catch {}

        try {
            const company = await prisma.company.findUnique({ where: { id: companyId }, include: { locations: true, services: true, employees: true } });
            if (!company) return;

            let dbUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { phone: senderNum },
                        { phone: { startsWith: senderNum.substring(0, 11) } }
                    ],
                    role: 'CLIENT'
                }
            });

            // 🚀 Automatização: Cria Lead se não for Clietne cadastrado
            if (!dbUser) {
                const existingLead = await prisma.lead.findFirst({
                    where: { phone: senderNum, companyId }
                });
                if (!existingLead) {
                    await prisma.lead.create({
                        data: {
                            companyId,
                            name: senderName,
                            phone: senderNum,
                            interest: "Contato via WhatsApp",
                            converted: false
                        }
                    });
                }
            }

            let rulesContext = `Você é uma secretária virtual educada da empresa "${company.name}".\n`;
            rulesContext += `Nicho: ${company.niche}\n\n`;
            rulesContext += `Data de Hoje: ${new Date().toLocaleDateString('pt-BR')} (Use para deduzir o ano)\n\n`;

            if (dbUser) { rulesContext += `O cliente atual é **${dbUser.name}**. Trate-o pelo nome.\n`; } 
            else { rulesContext += `Este cliente não possui cadastro com o telefone ${senderNum}. Pergunte o nome dele primeiro para registrá-lo.\n`; }

            rulesContext += `Instruções rigorosas:\n`;
            rulesContext += `- **ASSUMA O ANO**: Se o cliente disser "20/03", assuma o ano atual ${new Date().getFullYear()}. Não pergunte o ano.\n`;
            rulesContext += `- **PASSO A PASSO**: Faça APENAS UMA pergunta por vez. Aguarde a resposta antes de prosseguir.\n`;
            rulesContext += `- **CADASTRO**: Se o cliente te informar o Nome Completo e não tiver cadastro, você **DEVE** acionar a ferramenta \`registrarCliente\` com o nome dele imediatamente! **NUNCA** responda recusando o agendamento antes de tentar cadastrá-lo.\n`;
            rulesContext += `- **Sinalização de Listas**: Se for oferecer opções (Serviço, Unidade ou Profissional), responda usando o prefixo "LISTA:" seguido dos nomes exatos separados por vírgula no final da mensagem.\n`;
            rulesContext += `- **VÍNCULO DE UNIDADE**: Ao oferecer profissionais, mostre APENAS os que pertencem à Unidade/Localização que o cliente escolheu.\n`;
            rulesContext += `- **ENDEREÇO**: Se o cliente perguntar o endereço ou local, você deve informar o endereço ou local completo E o link do Google Maps (se disponível).\n`;
            rulesContext += `Exemplo: "Qual profissional deseja? LISTA: Thiago, Olivia"\n\n`;

            rulesContext += `--- 📍 DADOS DA EMPRESA ---\n\n`;
            if (company.locations.length > 0) {
                rulesContext += `Unidades/Localizações:\n`;
                company.locations.forEach(l => { 
                    rulesContext += `- ${l.name} (id: ${l.id}): ${l.address}, ${l.number} - ${l.neighborhood}, ${l.city}/${l.state}${l.mapsLink ? ` | Link do Google Maps: ${l.mapsLink}` : ''}\n`; 
                });
            }
            if (company.services.length > 0) {
                rulesContext += `\nServiços:\n`;
                const uniqueServices = Array.from(new Map(company.services.map(s => [s.name, s])).values());
                uniqueServices.forEach(s => { rulesContext += `- ${s.name} (id: ${s.id}): R$ ${s.price}\n`; });
            }
            if (company.employees.length > 0) {
                rulesContext += `\nEquipe:\n`;
                company.employees.forEach(e => { 
                    const loc = company.locations.find(l => l.id === e.locationId);
                    rulesContext += `- ${e.name} (id: ${e.id}) - Unidade: ${loc ? loc.name : 'Qualquer'}${e.hours ? ` - Horário: ${e.hours}` : ''}\n`; 
                });
            }
            rulesContext += `\n--- FIM DOS DADOS ---\n`;

            const toolDeclarations = [{
                functionDeclarations: [
                    { name: "consultarDisponibilidade", description: "Consulta os horários livres de um profissional (YYYY-MM-DD)", parameters: { type: "OBJECT", properties: { employeeId: { type: "STRING" }, date: { type: "STRING", description: "Formato YYYY-MM-DD" } }, required: ["employeeId", "date"] } },
                    { name: "registrarCliente", description: "Cadastra ou Atualiza o nome do cliente no banco de dados.", parameters: { type: "OBJECT", properties: { nome: { type: "STRING", description: "Nome completo do cliente" } }, required: ["nome"] } },
                    { name: "criarAgendamento", description: "Reserva um horário para o cliente.", parameters: { type: "OBJECT", properties: { employeeId: { type: "STRING" }, serviceId: { type: "STRING" }, locationId: { type: "STRING" }, dateTime: { type: "STRING", description: "ISO YYYY-MM-DDTHH:MM" } }, required: ["employeeId", "serviceId", "locationId", "dateTime"] } }
                ]
            }];

            const history = await prisma.whatsappMessage.findMany({ where: { companyId, senderNum }, orderBy: { timestamp: 'desc' }, take: 15 });
            let contents = history.reverse().map(m => ({ role: m.from === 'CLIENT' ? 'user' : 'model', parts: [{ text: m.content }] }));
            if (contents.length === 0 || contents[contents.length - 1].parts[0].text !== text) { contents.push({ role: 'user', parts: [{ text: text }] }); }

            let response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents, config: { systemInstruction: rulesContext, tools: toolDeclarations } });

            while (response.functionCalls && response.functionCalls.length > 0) {
                contents.push(response.candidates[0].content);
                for (const call of response.functionCalls) {
                    let resData = "";
                    if (call.name === 'consultarDisponibilidade') { resData = await consultarDisponibilidade(call.args.employeeId, call.args.date); }
                    else if (call.name === 'registrarCliente') { resData = await registrarCliente(call.args.nome, senderNum); }
                    else if (call.name === 'criarAgendamento') { resData = await criarAgendamento(call.args.employeeId, call.args.serviceId, call.args.locationId, senderNum, call.args.dateTime, companyId); }
                    contents.push({ role: 'function', parts: [{ functionResponse: { name: call.name, response: { result: resData } } }] });
                }
                response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents, config: { systemInstruction: rulesContext, tools: toolDeclarations } });
            }

            const reply = response.text;

            if (reply.includes("LISTA:")) {
                const parts = reply.split("LISTA:");
                const textBefore = parts[0].trim();
                const options = parts[1].split(",").map(o => o.trim()).filter(Boolean);

                if (options.length > 0) {
                    let numberedList = options.map((opt, i) => `${i + 1}️⃣  ${opt}`).join("\n");
                    const finalList = `${textBefore}\n\n${numberedList}\n\n*Responda apenas com o número da opção desejada!*`;
                    await sock.sendMessage(senderJid, { text: finalList });
                    await prisma.whatsappMessage.create({ data: { companyId, from: 'AI', senderName: 'Assistente IA', senderNum: senderNum, content: finalList } });
                    return;
                }
            }

            await sock.sendMessage(senderJid, { text: reply });
            await prisma.whatsappMessage.create({ data: { companyId, from: 'AI', senderName: 'Assistente IA', senderNum: senderNum, content: reply } });

        } catch (error) { console.error(`[WhatsApp] [${companyId}] Erro:`, error); }
    });
}

let hasMigrated = false;

async function monitorSessions() {
    // 🧹 Migração Automática Rodrigo Machado (Um por início do Robô)
    if (!hasMigrated) {
        hasMigrated = true;
        try {
            const trueClient = await prisma.user.findFirst({ where: { email: 'rodrigoamac@gmail.com' } });
            const duplicateClient = await prisma.user.findFirst({ 
                where: { 
                    name: 'Rodrigo Machado', 
                    email: { contains: '@whatsapp.com' } 
                } 
            });

            if (trueClient && duplicateClient) {
                await prisma.appointment.updateMany({
                    where: { userId: duplicateClient.id },
                    data: { userId: trueClient.id }
                });
                await prisma.user.delete({ where: { id: duplicateClient.id } });
                await prisma.user.update({
                    where: { id: trueClient.id },
                    data: { phone: '20505111720572' }
                });
                console.log('✅ [Migration] Rodrigo Machado migrado com sucesso!');
            }
        } catch (e) { console.error('❌ [Migration] Erro:', e.message); }
    }

    // 🧹 Limpa os QR Codes antigos do banco ao iniciar o script para evitar exibir imagem quebrada
    try {
        await prisma.whatsappSession.updateMany({
            where: { status: 'QRCODE' },
            data: { qrCode: null }
        });
        console.log('[WhatsApp] Limpeza inicial de QR Codes concluída.');
    } catch (err) { }

    setInterval(async () => {
        try {
            const db = await prisma.whatsappSession.findMany();

            // 🛑 Sincroniza Memória com DB: Para sessões que foram deslogadas fora do worker
            for (const [companyId, session] of sessions.entries()) {
                const dbSession = db.find(r => r.companyId === companyId);
                if (!dbSession || dbSession.status === 'DISCONNECTED') {
                    console.log(`[WhatsApp] [${companyId}] Parando sessão em memória (Status DB).`);
                    if (session.sock) { 
                        try { await session.sock.logout(); } catch {} 
                    }
                    sessions.delete(companyId);
                }
            }

            for (const r of db) {
                if (r.status === 'DISCONNECTING') { 
                    const a = sessions.get(r.companyId); 
                    if (a?.sock) { 
                        try { await a.sock.logout(); } catch {} 
                    } 
                    await prisma.whatsappSession.update({ 
                        where: { companyId: r.companyId }, 
                        data: { status: 'DISCONNECTED', qrCode: null } 
                    });
                    sessions.delete(r.companyId);
                } 
                else if (r.status === 'QRCODE') {
                    // ⏱️ Timeout de QR Code: 2 minutos sem atualização (updatedAt)
                    const updatedAtTime = new Date(r.updatedAt).getTime();
                    const now = Date.now();
                    const diffMinutes = (now - updatedAtTime) / 1000 / 60;

                    if (diffMinutes > 2) {
                        console.log(`[WhatsApp] [${r.companyId}] QR Code expirado por inatividade.`);
                        await prisma.whatsappSession.update({
                            where: { id: r.id },
                            data: { status: 'DISCONNECTED', qrCode: null }
                        });
                        const a = sessions.get(r.companyId);
                        if (a?.sock) { try { await a.sock.logout(); } catch {} }
                        sessions.delete(r.companyId);
                        continue; // Pula para o próximo
                    }

                    if (!sessions.has(r.companyId)) startSession(r.companyId); 
                }
                else if (r.status === 'CONNECTED') { 
                    if (!sessions.has(r.companyId)) startSession(r.companyId); 
                }
            }
        } catch (err) { }
    }, 5000);
}

const notifiedAppointments = new Set();
let isPollingActive = false;

async function startNotificationPolling() {
    if (isPollingActive) return;
    isPollingActive = true;
    console.log("[Notification] 🔔 Iniciando monitoramento de aprovações/recusas...");

    try {
        // 1. Carrega os agendamentos já existentes como CONFIRMED/CANCELLED para não disparar antigos ao reiniciar o worker
        const existing = await prisma.appointment.findMany({
            where: { status: { in: ['CONFIRMED', 'CANCELLED'] } },
            select: { id: true }
        });
        existing.forEach(a => notifiedAppointments.add(a.id));
        console.log(`[Notification] ${notifiedAppointments.size} agendamentos antigos ignorados de notificação.`);
    } catch (err) {
        console.error("[Notification] Erro ao carregar agendamentos antigos:", err);
    }

    // 2. Loop de verificação a cada 7 segundos para evitar estresse no banco
    setInterval(async () => {
        try {
            const pending = await prisma.appointment.findMany({
                where: {
                    status: { in: ['CONFIRMED', 'CANCELLED'] },
                    id: { notIn: Array.from(notifiedAppointments) }
                },
                include: {
                    user: true,
                    company: true,
                    service: true,
                    employee: true
                }
            });

            for (const app of pending) {
                const clientPhone = app.user.phone;
                if (!clientPhone) {
                     notifiedAppointments.add(app.id); // Evita loopar caso não tenha fone
                     continue;
                }

                const companyId = app.companyId;
                const companySession = sessions.get(companyId);
                if (!companySession || companySession.status !== 'CONNECTED') continue;

                const isApproved = app.status === 'CONFIRMED';
                const statusText = isApproved ? '✅ CONFIRMADO' : '❌ RECUSADO';
                const footerText = isApproved ? 'Aguardamos você!' : 'Infelizmente não foi possível confirmar este horário no momento.';
                const message = `Olá **${app.user.name}**!\n\nSeu agendamento para **${app.service.name}** com **${app.employee.name}** no dia **${new Date(app.date).toLocaleDateString('pt-BR')}** foi **${statusText}** pelo estabelecimento.\n\n${footerText}`;

                try {
                    await companySession.sock.sendMessage(`${clientPhone}@s.whatsapp.net`, { text: message });
                    notifiedAppointments.add(app.id);
                    console.log(`[Notification] Cliente ${clientPhone} notificado para agendamento ${app.id} (${app.status}).`);
                } catch (sendErr) {
                    console.error(`[Notification] Falha ao enviar msg para ${clientPhone} (${app.id}):`, sendErr);
                }
            }
        } catch (pollErr) {
            console.error("[Notification] Erro no polling de aprovações:", pollErr);
        }
    }, 7000);
}

monitorSessions();
startNotificationPolling();
