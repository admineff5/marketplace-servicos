const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// O script anterior colocou parênteses extras `((apt.service ...))` que quebraram o Turbopack
content = content.replace(/\{\(\(apt\.service\?\.name/g, "{apt.service?.name");
content = content.replace(/\|\| 'Serviço'\)\)\}/g, "|| 'Serviço'}");

fs.writeFileSync(path, content, 'utf8');
console.log("Remoção de parênteses extras aplicada!");
