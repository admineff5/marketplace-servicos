const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const fetchOld = `const aptRes = await fetch('/api/appointments?limit=10&fromToday=true');
                const aptData = await aptRes.json();`;

const fetchNew = `const aptRes = await fetch('/api/appointments?limit=10&fromToday=true');
                const aptData = await aptRes.json();
                console.log("=== DEBUG HOME APPOINTMENTS ===");
                console.log("Filtro: limit=10, fromToday=true");
                console.log("Resultados recebidos da API:", Array.isArray(aptData) ? aptData.length : "Nao e array");
                if (Array.isArray(aptData)) {
                    aptData.forEach(a => console.log(\`- ID: \${a.id} | Data: \${a.date} | Status: \${a.status} | Titulo: \${a.title}\`));
                }`;

if (content.indexOf('const aptRes = await fetch') !== -1) {
    content = content.replace(fetchOld, fetchNew);
    console.log("Console.log de Depuração injetado na Dashboard Home!");
    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("Trecho de fetch não encontrado.");
}
