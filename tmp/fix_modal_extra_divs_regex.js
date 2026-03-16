const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const regexClean = /<div className="absolute bottom-0 left-8 w-12 h-16 bg-\[#E6D19C\][\s\S]*?<div className="absolute bottom-10 right-20 w-8 h-12 bg-white\/40[\s\S]*?<\/div>\s*<\/div>/g;

if (regexClean.test(content)) {
    content = content.replace(regexClean, '');
    console.log("Sobras do Modal limpadas via Regex!");
    fs.writeFileSync(path, content, 'utf8');
} else {
    // Tentativa mais flexível
    const regexCleanFlex = /<div className="absolute bottom-0 left-8 w-12 h-16[\s\S]*?bg-\[#FFA5DA\][\s\S]*?<\/div>\s*<\/div>/g;
    if (regexCleanFlex.test(content)) {
        content = content.replace(regexCleanFlex, '');
        console.log("Sobras do Modal limpadas via Regex Flexível!");
        fs.writeFileSync(path, content, 'utf8');
    } else {
        console.log("Regex de Limpeza falhou em dar Match!");
    }
}
