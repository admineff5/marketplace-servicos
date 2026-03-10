const https = require('https');

const LIVE_WEBHOOK_URL = 'https://discord.com/api/webhooks/1480043644504506379/TEFrIKBSHQ6aGYhBZ7DUOy28Jx1DH6wcFk7H6Yj42dwfrHSym9uNj2qydgS3gBCeBZ4v';

function sendLiveStatus(status, taskName) {
    const data = JSON.stringify({
        embeds: [{
            title: status === 'start' ? "🚧 Iniciando Nova Tarefa" : "✅ Tarefa Concluída",
            description: `**Atividade:** ${taskName}\n**Responsável:** Antigravity (IA)`,
            color: status === 'start' ? 0xFFA500 : 0x00FF00, // Laranja ou Verde
            footer: {
                text: "Monitoramento em Tempo Real • EFF5"
            },
            timestamp: new Date().toISOString()
        }]
    });

    const url = new URL(LIVE_WEBHOOK_URL);
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
            console.log('✅ Status enviado para o canal #projeto-ao-vivo.');
        }
    });

    req.on('error', (err) => console.error('Erro:', err));
    req.write(data);
    req.end();
}

const action = process.argv[2]; // 'start' ou 'done'
const name = process.argv.slice(3).join(' ');

if (action && name) {
    sendLiveStatus(action, name);
} else {
    console.log('Uso: node scripts/status-discord.js [start|done] [Nome da Tarefa]');
}
