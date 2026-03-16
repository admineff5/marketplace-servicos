const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const titleOld = `<h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Store className="w-6 h-6 text-cyan-700 dark:text-primary" /> Visão Geral
                    </h2>`;

const titleNew = `<h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Store className="w-6 h-6 text-cyan-700 dark:text-primary" /> Visão Geral (TESTE DE DIAGNOSTICO ATIVO)
                    </h2>`;

if (content.indexOf('Visão Geral') !== -1) {
    content = content.replace(titleOld, titleNew);
    console.log("Título da Dashboard alterado para Teste de Cache definitivo!");
    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("Título 'Visão Geral' não encontrado para teste.");
}
