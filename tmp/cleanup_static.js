const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Regex Flexível para a Visão de Dia / Semana (Onde o `.split` e `.replace` estão no JSX)
const regexDayBlock = /return\s*\(\s*<div\s+key=\{apt\.id\}[\s\S]*?className=\{\`absolute left-\[5%\] w-\[90%\][\s\S]*?\$\{apt\.dot\.replace\([\s\S]*?\}\`\}[\s\S]*?\{\(apt\.service\?\.name \|\| apt\.title\?\.split\('-'\)\[0\]\?\.trim\(\) \|\| 'Serviço'\)\}<\/p>[\s\S]*?<\/div>\s*\)/m;

// Para não arriscar quebras de Regex, vou usar um substituto de tags e de replace cirúrgico de strings simples:
// Vamos limpar o arquivo e deixar sem as condicionais `apt.service` dentro do JSX

// Substituições diretas de string
content = content.replace(/\{apt\.service\?\.name \|\| apt\.title\?\.split\('-'\)\[0\]\?\.trim\(\) \|\| 'Serviço'\}/g, "apt.title || 'Serviço'");
content = content.replace(/\$\{apt\.dot\.replace\('bg-', 'border-'\)\.replace\('500', '600'\)\}/g, "apt.dot");

fs.writeFileSync(path, content, 'utf8');
console.log("Limpeza estática (2) aplicada!");
