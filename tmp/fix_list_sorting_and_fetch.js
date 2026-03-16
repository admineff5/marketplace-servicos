const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Corrigir o Fetch de dados para retornar tudo no modo "Mês"
const searchFetch = `const apptRes = await fetch(\`/api/appointments?date=\${dateStr}\`);`;
const newFetch = `const apptRes = await fetch(viewMode === "Mês" ? '/api/appointments' : \`/api/appointments?date=\${dateStr}\`);`;

if (content.indexOf(searchFetch) !== -1) {
    content = content.replace(searchFetch, newFetch);
    console.log("Fetch corrigido!");
}

// 2. Corrigir o Sort e Filtro na Visão Lista
const searchListStart = `                                    {appointments
                                        .filter((apt: any) => (selectedPros.includes(apt.employeeId) || selectedPros.includes(apt.employee?.id) || selectedPros.includes(apt.prof)))
                                        // Normally you'd sort by real date here. Just putting them in a fake order based on mock data.
                                        .sort((a: any, b: any) => a.date - b.date)
                                        .map((apt: any) => (`;

const newListStart = `                                    {appointments
                                        .filter((apt: any) => apt.status !== 'CANCELLED' && apt.status !== 'CANCELADO' && (selectedPros.includes(apt.employeeId) || selectedPros.includes(apt.employee?.id) || selectedPros.includes(apt.prof)))
                                        // Sort por timestamp da data real
                                        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                        .map((apt: any) => (`;

if (content.indexOf(searchListStart) !== -1) {
    content = content.replace(searchListStart, newListStart);
    console.log("Sort e Filtro da Lista corrigidos!");
}

// 3. Corrigir os Exibidores de Data dentro do Card de Lista
const searchDateView = `<span className="text-xs font-semibold text-gray-500 uppercase">{WEEKDAYS[new Date(apt.year, apt.month, apt.date).getDay()].replace('.', '')}</span>
                                                        <span className="text-lg font-bold text-gray-900 dark:text-white leading-none mt-0.5">{apt.date}</span>`;

const newDateView = `<span className="text-xs font-semibold text-gray-500 uppercase">{WEEKDAYS[new Date(apt.date).getUTCDay()].replace('.', '')}</span>
                                                        <span className="text-lg font-bold text-gray-900 dark:text-white leading-none mt-0.5">{new Date(apt.date).getUTCDate()}</span>`;

if (content.indexOf(searchDateView) !== -1) {
    content = content.replace(searchDateView, newDateView);
    console.log("Exibidores de Data corrigidos!");
}

// 4. Corrigir o título bugado do Card ({apt.start} - apt.title)
const searchTitleBox = `<h3 className="text-base font-bold text-gray-900 dark:text-white">{apt.start} - apt.title || 'Serviço'</h3>`;
const newTitleBox = `<h3 className="text-base font-bold text-gray-900 dark:text-white">{apt.start} - {apt.title || 'Serviço'}</h3>`;

if (content.indexOf(searchTitleBox) !== -1) {
    content = content.replace(searchTitleBox, newTitleBox);
    console.log("Título do Card na Lista corrigido!");
}

fs.writeFileSync(path, content, 'utf8');
console.log("Correções finais aplicadas com sucesso!");
