const fs = require('fs');
const path = 'c:\\Antigravity\\app\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const hoverOld = `: "bg-gray-50 dark:bg-black border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-primary/50"`;
const hoverNew = `: "bg-gray-50 dark:bg-black border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-cyan-800 hover:bg-cyan-800 hover:text-white dark:hover:bg-primary dark:hover:border-primary dark:hover:text-black"`;

if (content.indexOf('hover:border-primary/50') !== -1) {
    content = content.replace(hoverOld, hoverNew);
    console.log("Hover do botão de horário ajustado para as cores de alinhamento!");
    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("String de hover antigo não encontrada no arquivo.");
}
