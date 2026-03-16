const fs = require('fs');
const path = 'c:\\Antigravity\\app\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const searchStr = 'fullDateStr: d.toISOString().split("T")[0],';
const replaceStr = "fullDateStr: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,";

if (content.indexOf(searchStr) !== -1) {
    content = content.replace(searchStr, replaceStr);
    fs.writeFileSync(path, content, 'utf8');
    console.log("Variável fullDateStr corrigida para fuso local!");
} else {
    console.log("Cadeia fullDateStr não encontrada!");
}
