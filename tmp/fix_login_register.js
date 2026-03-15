const fs = require('fs');

function updateFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Botão Submit (bg-primary text-black)
    // Exemplo em register: text-black bg-primary hover:bg-cyan-400
    content = content.replace(
        /text-black bg-primary hover:bg-cyan-400/g,
        'text-white dark:text-black bg-cyan-700 dark:bg-primary hover:bg-cyan-800 dark:hover:bg-cyan-400'
    );

    // 2. Links text-cyan-700 ou text-blue-600 que precisam de dark toggle
    content = content.replace(
        /text-cyan-700 dark:text-primary hover:text-cyan-700/g,
        'text-cyan-700 dark:text-primary hover:text-cyan-800 dark:hover:text-cyan-400'
    );

    // 3. Inputs focus:ring-primary focus:border-primary
    content = content.replace(
        /focus:ring-primary focus:border-primary/g,
        'focus:ring-cyan-600 focus:border-cyan-600 dark:focus:ring-primary dark:focus:border-primary'
    );
    
    // 4. Input shadow/focus ring isolado (ex: focus:ring-1 focus:ring-primary)
    content = content.replace(
        /focus:ring-1 focus:ring-primary/g,
        'focus:ring-1 focus:ring-cyan-600 dark:focus:ring-primary'
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Arquivo atualizado: ${filePath}`);
}

updateFile('c:\\Antigravity\\app\\register\\page.tsx');
updateFile('c:\\Antigravity\\app\\login\\page.tsx');
