const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\layout.tsx';
let content = fs.readFileSync(path, 'utf8');

const importsRegex = /Package,\s*Settings,\s*LogOut,/;
const importsNew = `Package,
    Settings,
    Building,
    LogOut,`;

if (importsRegex.test(content)) {
    content = content.replace(importsRegex, importsNew);
    console.log("Building importado no layout.tsx com sucesso (RegEx)!");
    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("Regex de importação de icons não deu match no layout.");
}
