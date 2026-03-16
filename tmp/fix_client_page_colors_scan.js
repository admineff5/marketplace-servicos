const fs = require('fs');
const path = 'c:\\Antigravity\\app\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

let count = 0;

// 1. Corrigir focus:border-primary/50
if (content.indexOf('focus:border-primary/50') !== -1) {
    content = content.replace(/focus:border-primary\/50/g, 'focus:border-cyan-800/80 dark:focus:border-primary/50');
    count++;
}

// 2. Corrigir focus:ring-primary/50
if (content.indexOf('focus:ring-primary/50') !== -1) {
    content = content.replace(/focus:ring-primary\/50/g, 'focus:ring-cyan-800/80 dark:focus:ring-primary/50');
    count++;
}

// 3. Corrigir hover:border-primary/40
if (content.indexOf('hover:border-primary/40') !== -1) {
    content = content.replace(/hover:border-primary\/40/g, 'hover:border-cyan-800/80 dark:hover:border-primary/50');
    count++;
}

// 4. Corrigir bg-primary/20 border-primary
if (content.indexOf('bg-primary/20 border-primary') !== -1) {
    content = content.replace(/bg-primary\/20 border-primary/g, 'bg-cyan-800/10 border-cyan-800 dark:bg-primary/20 dark:border-primary');
    count++;
}

if (count > 0) {
    fs.writeFileSync(path, content, 'utf8');
    console.log("Cores de foco e hover corrigidas em todo o arquivo /app/page.tsx!");
} else {
    console.log("Nenhuma inconsistência de primary encontrada no arquivo.");
}
