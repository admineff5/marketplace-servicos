const fs = require('fs');
const https = require('https');

// NOVO WEBHOOK PARA O CANAL DEDICADO #CHANGELOG
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1480041430293417984/l-4GWzsa1N9DagQbkbBQ_6lIWaEh8QtIGMlys14roC1KO-uhEXR2AxYbRc-mZtNUFziR';

function getChangelogSections() {
    try {
        const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
        // Separar por divisores '---' e filtrar vazios
        return changelog.split(/\n---\s*\n/).map(s => s.trim()).filter(s => s.length > 0);
    } catch (err) {
        console.error('Erro ao ler CHANGELOG.md:', err);
        return [];
    }
}

async function sendToDiscord(section) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            embeds: [{
                title: "🚀 Registro de Alteração - Marketplace",
                description: section.substring(0, 4000), // Limite de segurança do Embed do Discord
                color: 0x00FFFF,
                footer: {
                    text: "EFF5 reFresh • eFFiciency • Freedom"
                },
                timestamp: new Date().toISOString()
            }]
        });

        const url = new URL(DISCORD_WEBHOOK_URL);
        const options = {
            hostname: url.hostname,
            path: url.pathname + url.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = https.request(options, (res) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                resolve();
            } else {
                reject(new Error(`Erro Status ${res.statusCode}`));
            }
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function syncAll() {
    const sections = getChangelogSections();
    console.log(`Iniciando sincronização de ${sections.length} seções do Changelog...`);

    // Enviar do mais antigo para o mais novo para manter a ordem no chat
    const reversedSections = sections.reverse();

    for (const section of reversedSections) {
        try {
            await sendToDiscord(section);
            console.log(`✅ Seção enviada com sucesso.`);
            // Pequeno delay para evitar Rate Limit do Discord
            await new Promise(r => setTimeout(r, 1000));
        } catch (err) {
            console.error(`❌ Falha ao enviar seção: ${err.message}`);
        }
    }
    console.log('Sincronização concluída!');
}

// Se rodar com argumento "all", envia tudo. Senão, só a última.
if (process.argv.includes('--all')) {
    syncAll();
} else {
    const last = getChangelogSections()[0];
    if (last) {
        sendToDiscord(last)
            .then(() => console.log('✅ Última atualização enviada.'))
            .catch(err => console.error('❌ Erro:', err));
    }
}
