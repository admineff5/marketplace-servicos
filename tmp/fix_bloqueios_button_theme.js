const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\bloqueios\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const searchBtn = `className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-cyan-400 dark:bg-primary dark:hover:bg-cyan-400 text-black rounded-xl shadow-sm transition-colors shrink-0"`;
const replaceBtn = `className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold bg-cyan-700 hover:bg-cyan-800 text-white dark:bg-primary dark:hover:bg-cyan-400 dark:text-black rounded-xl shadow-sm transition-colors shrink-0"`;

if (content.indexOf(searchBtn) !== -1) {
    content = content.replace(searchBtn, replaceBtn);
    console.log("Estilos dos modos Light e Dark do Botão corrigidos!");
    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("Botão não encontrado para correção!");
}
