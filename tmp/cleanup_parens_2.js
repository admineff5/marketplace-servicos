const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// O script colocou parênteses extras `{(apt.service ...)}` que quebraram a sintaxe interpretada
content = content.replace(/\{\(apt\.service/g, "{apt.service");
content = content.replace(/\|\| 'Serviço'\)\}/g, "|| 'Serviço'}");

fs.writeFileSync(path, content, 'utf8');
console.log("Remoção de parênteses extras (1-level) aplicada!");
