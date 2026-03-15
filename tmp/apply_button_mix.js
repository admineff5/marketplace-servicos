const fs = require('fs');
const path = 'c:\\Antigravity\\app\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Cadastrar Navbar
content = content.replace(
    /bg-primary px-3 sm:px-4 py-1\.5 sm:py-2 text-xs sm:text-sm font-semibold text-black/g,
    'bg-cyan-700 text-white dark:bg-primary dark:text-black hover:bg-cyan-800 dark:hover:bg-cyan-400 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold'
);

// 2. Limpar Filtros
content = content.replace(
    /bg-primary px-6 py-3 text-sm font-semibold text-black hover:bg-cyan-400/g,
    'bg-cyan-700 text-white dark:bg-primary dark:text-black hover:bg-cyan-800 dark:hover:bg-cyan-400 px-6 py-3 text-sm font-bold'
);

// 3. Cadastrar minha Empresa
content = content.replace(
    /className="bg-primary text-black font-bold py-4 px-8 rounded-xl shadow-\[0_4px_20px_rgba\(0,255,255,0\.25\)\] hover:bg-cyan-400/g,
    'className="bg-cyan-700 text-white dark:bg-primary dark:text-black font-bold py-4 px-8 rounded-xl shadow-[0_4px_20px_rgba(6,182,212,0.15)] dark:shadow-[0_4px_20px_rgba(0,255,255,0.25)] hover:bg-cyan-800 dark:hover:bg-cyan-400'
);

// 4. Seletor Carousel
content = content.replace(
    /showcaseIndex === i\s*\?\s*'bg-primary text-black'\s*:\s*'bg-gray-200 dark:bg-gray-800 text-gray-500/g,
    "showcaseIndex === i ? 'bg-cyan-500/10 text-cyan-700 dark:bg-primary/20 dark:text-primary' : 'bg-gray-200 dark:bg-gray-800 text-gray-500"
);

// 5. Badge Grátis
content = content.replace(
    /className="absolute -top-3 -right-3 bg-primary text-black text-\[10px\] font-bold uppercase tracking-widest px-3 py-1\.5 rounded-full shadow-lg"/g,
    'className="absolute -top-3 -right-3 bg-cyan-500/10 text-cyan-700 dark:bg-primary/20 dark:text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-cyan-600/30 dark:border-primary/30 shadow-md"'
);

// 6. Botão Checkout Modal
content = content.replace(
    /className="w-full bg-primary text-black font-bold py-4 rounded-xl shadow-\[0_0_20px_rgba\(0,255,255,0\.3\)\] hover:bg-cyan-400/g,
    'className="w-full bg-cyan-700 text-white dark:bg-primary dark:text-black font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.2)] dark:shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:bg-cyan-800 dark:hover:bg-cyan-400'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Botões atualizados!');
