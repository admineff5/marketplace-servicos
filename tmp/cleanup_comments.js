const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Remover TODOS os comentários de bloco `/* ... */` que estejam dentro do JSX
// Exemplo: `{/* ... */}`
// O Turbopack às vezes tem bugs de parser com eles
content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");

// Salvar
fs.writeFileSync(path, content, 'utf8');
console.log("Comentários removidos do JSX successfully!");
