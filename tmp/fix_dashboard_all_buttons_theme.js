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
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Regex para achar botões de Destaque / Adição que têm bg-primary
    const btnRegex = /<button([\s\S]*?)className="([^"]*?bg-primary[^"]*?)"([\s\S]*?)>([\s\S]*?(Novo Serviço|Novo Profissional|Adicionar Produto|Adicionar Lead|Adicionar Cliente)[\s\S]*?)<\/button>/g;

    if (btnRegex.test(content)) {
        content = content.replace(btnRegex, (match, beforeClass, classAttr, afterClass, buttonInner) => {
            let classes = classAttr;
            
            // 1. Remover bg-primary e hover:bg-cyan-... e text-black se houver
            classes = classes.replace(/\s*bg-primary\s*/g, ' ');
            classes = classes.replace(/\s*hover:bg-cyan-\d+\s*/g, ' ');
            classes = classes.replace(/\s*text-black\s*/g, ' ');

            // 2. Injetar novo padrão de Botão Active Light/Dark
            classes += ' bg-cyan-700 hover:bg-cyan-800 text-white dark:bg-primary dark:hover:bg-cyan-400 dark:text-black';

            // Limpar espaços extras
            classes = classes.replace(/\s+/g, ' ').trim();

            console.log(`Corrigido botão em: ${filePath}`);
            return `<button${beforeClass}className="${classes}"${afterClass}>${buttonInner}</button>`;
        });
        changed = true;
    }

    // Correção isolada para Relatórios (Filtros de Departamento)
    if (filePath.endsWith('relatorios\\page.tsx')) {
        const searchReport = `'bg-primary text-black border-primary shadow-sm'`;
        const replaceReport = `'bg-cyan-700 hover:bg-cyan-800 text-white border-cyan-700 dark:bg-primary dark:hover:bg-cyan-400 dark:text-black dark:border-primary shadow-sm'`;
        if (content.indexOf(searchReport) !== -1) {
            content = content.replace(searchReport, replaceReport);
            changed = true;
            console.log("Corrigida aba de Departamentos em Relatórios!");
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
});
