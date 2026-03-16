const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `\n                }\n`;
const targetStrCRLF = `\r\n                }\r\n`;

if (content.indexOf(targetStr) !== -1) {
    content = content.replace(targetStr, '\n');
    console.log("Chave órfã removida via LF!");
} else if (content.indexOf(targetStrCRLF) !== -1) {
    content = content.replace(targetStrCRLF, '\r\n');
    console.log("Chave órfã removida via CRLF!");
}

fs.writeFileSync(path, content, 'utf8');
