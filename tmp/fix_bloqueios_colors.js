const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\bloqueios\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Mudar Botão Verde para Estilo Site (Cyan/Primary)
const searchButton = `bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700`;
const replaceButton = `bg-primary hover:bg-cyan-400 dark:bg-primary dark:hover:bg-cyan-400 text-black`;

if (content.indexOf(searchButton) !== -1) {
    content = content.replace(searchButton, replaceButton);
    console.log("Botão verde atualizado de volta à paleta de Core!");
}

// 2. Mudar Ícone de Laranja para Cyan-600
const searchIcon = `text-orange-500`;
const replaceIcon = `text-cyan-600 dark:text-primary`;

if (content.indexOf(searchIcon) !== -1) {
    content = content.replace(searchIcon, replaceIcon);
    console.log("Ícone de datas atualizado de volta à paleta de Core!");
}

// 3. Mudar Condicional de Badges
const searchBadges = `\${row.situation === 'Feriado' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' :
                                                row.situation === 'Final de semana' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' :
                                                row.situation === 'Atestado' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20' :
                                                    'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20'}`;

const replaceBadges = `\${row.situation === 'Feriado' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' :
                                                row.situation === 'Final de semana' ? 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700' :
                                                row.situation === 'Atestado' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20' :
                                                    'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20'}`;

if (content.indexOf(searchBadges) !== -1) {
    content = content.replace(searchBadges, replaceBadges);
    console.log("Badges de layouts atualizados!");
} else {
    // Regex pra garantir que vai dar replace se as quebras de linha variarem
    const regexBadges = /\$\{row\.situation === 'Feriado'[\s\S]*?bg-yellow-50[\s\S]*?border-yellow-500\/20'\}/;
    if (regexBadges.test(content)) {
        content = content.replace(regexBadges, replaceBadges);
        console.log("Badges de layouts atualizados via Regex!");
    } else {
        console.log("Regex de Badges falhou.");
    }
}

fs.writeFileSync(path, content, 'utf8');
