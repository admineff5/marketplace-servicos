const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\layout.tsx';
let content = fs.readFileSync(path, 'utf8');

const importOld = `    Package,
    Settings,
    LogOut,`;

const importNew = `    Package,
    Settings,
    Building,
    LogOut,`;

if (content.indexOf(importOld) !== -1) {
    content = content.replace(importOld, importNew);
    console.log("Building importado no layout.tsx com sucesso!");
    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("Estrutura de importaçoes no layout antiga não encontrada.");
}
