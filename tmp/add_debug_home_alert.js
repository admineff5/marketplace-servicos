const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const debugOld = `console.log("=== DEBUG HOME APPOINTMENTS ===");
                console.log("Filtro: limit=10, fromToday=true");
                console.log("Resultados recebidos da API:", Array.isArray(aptData) ? aptData.length : "Nao e array");
                if (Array.isArray(aptData)) {
                    aptData.forEach(a => console.log(\`- ID: \${a.id} | Data: \${a.date} | Status: \${a.status} | Titulo: \${a.title}\`));
                }`;

const debugNew = `if (Array.isArray(aptData)) {
                    const debugStr = aptData.map(a => \`\${a.date} - \${a.title} [\${a.status}]\`).join('\\n');
                    alert("⚠️ DIAGNÓSTICO DE AGENDAMENTOS:\\n\\n" + (debugStr || "⚠️ NENHUM AGENDAMENTO RETORNADO DA API !"));
                }`;

if (content.indexOf('=== DEBUG HOME APPOINTMENTS ===') !== -1) {
    content = content.replace(debugOld, debugNew);
    console.log("Alert() de Depuração injetado na Dashboard Home!");
    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("Filtro de debug anterior não encontrado. Procurando fetch p/ injetar.");
    const fetchOld = `const aptRes = await fetch('/api/appointments?limit=10&fromToday=true');
                const aptData = await aptRes.json();`;
    
    const fetchNew = `const aptRes = await fetch('/api/appointments?limit=10&fromToday=true');
                const aptData = await aptRes.json();
                if (Array.isArray(aptData)) {
                    const debugStr = aptData.map(a => \`\${a.date} - \${a.title} [\${a.status}]\`).join('\\n');
                    alert("⚠️ DIAGNÓSTICO DE AGENDAMENTOS:\\n\\n" + (debugStr || "⚠️ NENHUM AGENDAMENTO RETORNADO DA API !"));
                }`;
    
    if (content.indexOf(fetchOld) !== -1) {
        content = content.replace(fetchOld, fetchNew);
        console.log("Alert() injetado no fetch da Dashboard Home!");
        fs.writeFileSync(path, content, 'utf8');
    }
}
