const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const errorText = `<!-- Botões removidos -->`;

if (content.indexOf(errorText) !== -1) {
    content = content.replace(errorText, '{/* Botões removidos */}');
    console.log("Comentário HTML substituído por Comentário JSX com sucesso!");
    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("Comentário HTML de erro não encontrado.");
}
