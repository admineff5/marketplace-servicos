const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Corrigir o Filtro do useEffect via Regex
const filterRegex = /const activeApts = Array\.isArray\(aptData\)[\s\S]*?\? aptData\.filter\(\(a: any\) => a\.status !== 'CANCELLED'[\s\S]*?\)\s+: \[\];/;

const newFilter = `const activeApts = Array.isArray(aptData) 
                    ? aptData.filter((a: any) => {
                        const isCancelled = a.status === 'CANCELLED' || a.status === 'CANCELADO' || a.status === 'CANCEL';
                        if (isCancelled) return false;
                        
                        const aptDate = new Date(a.date);
                        const now = new Date();
                        now.setHours(0,0,0,0); // Considera hoje o dia inteiro
                        return aptDate >= now;
                    })
                    : [];`;

if (filterRegex.test(content)) {
    content = content.replace(filterRegex, newFilter);
    console.log("Filtro de datas do Fetch atualizado via Regex!");
} else {
    console.log("Regex de Filtro não bateu no arquivo!");
}

// 2. Corrigir o Texto e o Href do Link
if (content.indexOf('Ver agenda completa') !== -1) {
    content = content.replace('Ver agenda completa', 'Ver lista completa');
    console.log("Texto do Link corrigido!");
}

if (content.indexOf('href="/dashboard/agenda"') !== -1) {
    content = content.replace('href="/dashboard/agenda"', 'href="/dashboard/agenda?view=list"');
    console.log("Href do Link corrigido!");
}

// 3. Garantir Remoção de Click do Card (Se houver)
const clickStr = `onClick={() => setSelectedAppointment(apt)}`;
const clickStrWithSpace = `onClick={() => setSelectedAppointment(apt)} `;

if (content.indexOf(clickStr) !== -1) {
    content = content.split(clickStr).join('');
    console.log("Clicks de modal removidos!");
}

fs.writeFileSync(path, content, 'utf8');
