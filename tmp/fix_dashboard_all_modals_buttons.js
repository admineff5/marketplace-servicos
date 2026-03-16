const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory && f !== 'node_modules' && f !== '.next') {
            walkDir(dirPath, callback);
        } else if (!isDirectory && (f.endsWith('.tsx') || f.endsWith('.ts'))) {
            callback(dirPath);
        }
    });
}

const rootApp = 'c:\\Antigravity\\app\\dashboard';

walkDir(rootApp, (filePath) => {
    // Evitar mexer no layout geral para não bugar topbars ou sidebars decorativas se houver
    if (filePath.endsWith('layout.tsx')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // 1. Regex para <button className="...bg-primary..."
    const buttonRegex = /(<button[\s\S]*?className=")([^"]*?bg-primary[^"]*?)("[\s\S]*?>)/g;

    if (buttonRegex.test(content)) {
        content = content.replace(buttonRegex, (match, p1, classAttr, p3) => {
            // Se já tiver dark:bg-primary ou bg-primary/10 (opacidade), ignorar
            if (classAttr.indexOf('dark:bg-primary') !== -1 || classAttr.indexOf('bg-primary/') !== -1) {
                return match;
            }

            let classes = classAttr;
            
            // Remover antigas
            classes = classes.replace(/\s*bg-primary\s*/g, ' ');
            classes = classes.replace(/\s*hover:bg-cyan-\d+\s*/g, ' ');
            classes = classes.replace(/\s*text-black\s*/g, ' ');
            classes = classes.replace(/\s*text-gray-\d+\s*/g, ' '); // Caso houver

            // Injetar padrão: Light = bg-cyan-700, Dark = bg-primary
            classes += ' bg-cyan-700 hover:bg-cyan-800 text-white dark:bg-primary dark:hover:bg-cyan-400 dark:text-black';

            // Limpar espaços extras
            classes = classes.replace(/\s+/g, ' ').trim();

            changed = true;
            console.log(`Botão corrigido em: ${filePath}`);
            return `${p1}${classes}${p3}`;
        });
    }

    // 2. Regex para <Link className="...bg-primary..."
    const linkRegex = /(<Link[\s\S]*?className=")([^"]*?bg-primary[^"]*?)("[\s\S]*?>)/g;

    if (linkRegex.test(content)) {
        content = content.replace(linkRegex, (match, p1, classAttr, p3) => {
            if (classAttr.indexOf('dark:bg-primary') !== -1 || classAttr.indexOf('bg-primary/') !== -1) {
                return match;
            }

            let classes = classAttr;
            classes = classes.replace(/\s*bg-primary\s*/g, ' ');
            classes = classes.replace(/\s*hover:bg-cyan-\d+\s*/g, ' ');
            classes = classes.replace(/\s*text-black\s*/g, ' ');

            classes += ' bg-cyan-700 hover:bg-cyan-800 text-white dark:bg-primary dark:hover:bg-cyan-400 dark:text-black';
            classes = classes.replace(/\s+/g, ' ').trim();

            changed = true;
            console.log(`Link corrigido em: ${filePath}`);
            return `${p1}${classes}${p3}`;
        });
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
});
