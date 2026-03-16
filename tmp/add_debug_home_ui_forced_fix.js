const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const fetchOld = `const aptRes = await fetch('/api/appointments?limit=10&fromToday=true');
                const aptData = await aptRes.json();`;

const fetchNew = `const aptRes = await fetch('/api/appointments?limit=10&fromToday=true');
                const aptData = await aptRes.json();
                
                // DIAGNOSTICO FORCADO:
                if (Array.isArray(aptData)) {
                    setDebugText(JSON.stringify(aptData.map((a: any) => ({
                        id: a.id,
                        date: a.date,
                        status: a.status,
                        title: a.title
                    })), null, 2));
                }`;

if (content.indexOf('const aptRes = await fetch') !== -1) {
    content = content.replace(fetchOld, fetchNew);
    console.log("Comando setDebugText INJETADO COM SUCESSO na Home!");
    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("Comando fetch não encontrado para substituição direta.");
}
