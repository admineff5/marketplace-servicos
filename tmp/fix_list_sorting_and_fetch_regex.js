const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Regex de Sort e Filtro
const searchListStartRegex = /\.filter\(\(apt: any\) => \(selectedPros\.includes\(apt\.employeeId\) \|\| selectedPros\.includes\(apt\.employee\?\.id\) \|\| selectedPros\.includes\(apt\.prof\)\)\)[\s\S]*?\/\/[\s\S]*?\.sort\(\(a: any, b: any\) => a\.date - b\.date\)/m;

const newListStart = `.filter((apt: any) => apt.status !== 'CANCELLED' && apt.status !== 'CANCELADO' && (selectedPros.includes(apt.employeeId) || selectedPros.includes(apt.employee?.id) || selectedPros.includes(apt.prof)))\n                                        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())`;

if (content.match(searchListStartRegex)) {
    content = content.replace(searchListStartRegex, newListStart);
    console.log("Sort e Filtro da Lista corrigidos via Regex!");
}

// 2. Regex de Exibidores de Data
const searchDateViewRegex = /<span className="text-xs font-semibold text-gray-500 uppercase">\{WEEKDAYS\[new Date\(apt\.year, apt\.month, apt\.date\)\.getDay\(\)\]\.replace\('\.', ''\)\}<\/span>[\s\S]*?<span className="text-lg font-bold text-gray-900 dark:text-white leading-none mt-0.5">\{apt\.date\}<\/span>/m;

const newDateView = `<span className="text-xs font-semibold text-gray-500 uppercase">{WEEKDAYS[new Date(apt.date).getUTCDay()].replace('.', '')}</span>\n                                                        <span className="text-lg font-bold text-gray-900 dark:text-white leading-none mt-0.5">{new Date(apt.date).getUTCDate()}</span>`;

if (content.match(searchDateViewRegex)) {
    content = content.replace(searchDateViewRegex, newDateView);
    console.log("Exibidores de Data corrigidos via Regex!");
}

fs.writeFileSync(path, content, 'utf8');
console.log("Lotes finais corrigidos!");
