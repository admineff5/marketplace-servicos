const fs = require('fs');
const path = 'c:\\Antigravity\\app\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Botões principais (bg-primary com text-black)
// Exemplo: bg-primary text-black -> bg-cyan-700 text-white dark:bg-primary dark:text-black
const solidPattern = /bg-primary text-black/g;

if (solidPattern.test(content)) {
    content = content.replace(solidPattern, 'bg-cyan-700 text-white dark:bg-primary dark:text-black');
    fs.writeFileSync(path, content, 'utf8');
    console.log('Botões sólidos atualizados com sucesso para o modo light!');
} else {
    console.log('Nenhum botão sólido com "bg-primary text-black" encontrado. Tentando regex mais flexível...');
    
    // Regex flexível para espaços indesejados
    const flexPattern = /bg-primary([\s\S]*?)text-black/g;
    content = content.replace(flexPattern, 'bg-cyan-700 text-white dark:bg-primary dark:text-black$1');
    fs.writeFileSync(path, content, 'utf8');
    console.log('Substituição de fallback flexível aplicada.');
}
