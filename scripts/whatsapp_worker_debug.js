            // DEBUG HOOK: Dump do pacote Baileys para o usuário ver
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
            } catch {}
