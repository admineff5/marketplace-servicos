const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Injetar a função de estilo de Status no topo (fora do componente ou no início)
if (content.indexOf('const getStatusStyle =') === -1) {
    const fnInsert = `const getStatusStyle = (status: string) => {
    const s = status ? status.toUpperCase() : 'CONFIRMADO';
    if (s === 'CANCELADO' || s === 'CANCELLED') return 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400';
    if (s === 'PENDENTE' || s === 'PENDING') return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400';
    if (s === 'FINALIZADO' || s === 'DONE') return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400';
    return 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400';
};

export default function AgendaPage() {`;

    content = content.replace('export default function AgendaPage() {', fnInsert);
    console.log("Função getStatusStyle injetada!");
}

// 2. Substituir o Span estático por dinâmico
const oldSpan = `<span className={\`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md \${apt.dot.replace('bg-', 'text-').replace('500', '600')} bg-opacity-10 dark:bg-opacity-20 bg-current\`}>
                                                                Confirmado
                                                            </span>`;

const newSpan = `<span className={\`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md \${getStatusStyle(apt.status)}\`}>
                                                                {apt.status || 'Confirmado'}
                                                            </span>`;

if (content.indexOf('apt.dot.replace(\'bg-\'') !== -1) {
    content = content.replace(/<span className=\{\`px-2 py-0\.5[^]*?Confirmado[^]*?<\/span>/g, newSpan);
    console.log("Tag de Status da Lista atualizada para dinâmica!");
} else {
    console.log("Trecho do Span não encontrado. Tentando Regex flexível que dê match.");
    
    // Regex flexível para achar <span com "Confirmado" e fechar tag </span>
    const flexRegex = /<span className=\{\`px-2 py-0\.5[^]*?>[\s\S]*?Confirmado[\s\S]*?<\/span>/;
    
    if (flexRegex.test(content)) {
        content = content.replace(flexRegex, newSpan);
         console.log("Tag de Status da Lista atualizada via Regex flexível!");
    } else {
        console.log("Regex flexível também falhou.");
    }
}

fs.writeFileSync(path, content, 'utf8');
