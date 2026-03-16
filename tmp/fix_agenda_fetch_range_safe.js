const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Atualizar o useEffect para escutar as datas
const useEffectRegex = /useEffect\(\(\) => \{[\s\S]*?fetchData\(\);[\s\S]*?\}, \[currentDate, viewMode\]\);/g;
const useEffectNew = `useEffect(() => {
        fetchData();
    }, [currentDate, viewMode, startDate, endDate, agendaLayout]);`;

if (useEffectRegex.test(content)) {
    content = content.replace(useEffectRegex, useEffectNew);
    console.log("useEffect da Agenda atualizado!");
}

// 2. Atualizar a lógica do fetchData na API
const fetchRegex = /const dateStr = currentDate\.toISOString\(\)\.split\('T'\)\[0\];[\s\S]*?const apptRes = await fetch\([^]*?\);/g;
const fetchNew = `const dateStr = currentDate.toISOString().split('T')[0];
            let url = viewMode === "Mês" ? '/api/appointments' : \`/api/appointments?date=\${dateStr}\`;
            if (agendaLayout === "list" && startDate && endDate) {
                url = \`/api/appointments?startDate=\${startDate}&endDate=\${endDate}\`;
            }
            const apptRes = await fetch(url);`;

if (fetchRegex.test(content)) {
    content = content.replace(fetchRegex, fetchNew);
    console.log("FetchData da Agenda atualizado para range!");
} else {
    console.log("Regex do FetchData falhou.");
}

fs.writeFileSync(path, content, 'utf8');
