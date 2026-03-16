const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldCss = `\${isToday(dt) && selectedMiniDate !== dt ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-semibold' : ''}
                                        \${selectedMiniDate === dt ? 'bg-cyan-700 hover:bg-cyan-800 text-white dark:bg-primary dark:hover:bg-cyan-400 dark:text-black font-bold shadow-md scale-105' : ''}`;

const newCss = `\${isToday(dt) && dt !== null && selectedMiniDate !== dt ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-semibold' : ''}
                                        \${selectedMiniDate === dt && dt !== null ? 'bg-cyan-700 hover:bg-cyan-800 text-white dark:bg-primary dark:hover:bg-cyan-400 dark:text-black font-bold shadow-md scale-105' : ''}`;

if (content.indexOf(oldCss) !== -1) {
    content = content.replace(oldCss, newCss);
    console.log("Bug de seleção em dias vazios corrigido!");
    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("Trecho de CSS não encontrado. Tentando Regex...");
    
    const regexOld = /\$\{isToday\(dt\) && selectedMiniDate !== dt[^]*?bg-cyan-700[^]*?scale-105' : ''\}/g;
    const regexNew = `\${isToday(dt) && dt !== null && selectedMiniDate !== dt ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-semibold' : ''}
                                        \${selectedMiniDate === dt && dt !== null ? 'bg-cyan-700 hover:bg-cyan-800 text-white dark:bg-primary dark:hover:bg-cyan-400 dark:text-black font-bold shadow-md scale-105' : ''}`;

    content = content.replace(regexOld, regexNew);
    if (content.indexOf('&& dt !== null') !== -1) {
         console.log("Bug de seleção em dias vazios corrigido via Regex!");
         fs.writeFileSync(path, content, 'utf8');
    }
}
