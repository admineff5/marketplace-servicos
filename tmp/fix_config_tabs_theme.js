const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\config\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Atualizar as Abas Laterais de Perfil/Configurações
const searchTabs = `"bg-primary text-gray-900 dark:text-gray-900"`;
const replaceTabs = `"bg-cyan-700 hover:bg-cyan-800 text-white dark:bg-primary dark:hover:bg-cyan-400 dark:text-gray-900"`;

if (content.indexOf(searchTabs) !== -1) {
    content = content.replace(searchTabs, replaceTabs);
    console.log("Abas de Configurações corrigidas para Azul Petróleo!");
    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("Abas de Configurações não encontradas para correção.");
}
