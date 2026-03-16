const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Injetar a função de Tradução de Status logo acima do getStatusStyle
const searchFn = `const getStatusStyle = (status: string) => {`;
const insertFn = `const translateStatus = (status: string) => {
    const s = status ? status.toUpperCase() : 'CONFIRMADO';
    const dict: any = {
        'PENDING': 'PENDENTE',
        'CONFIRMED': 'CONFIRMADO',
        'CANCELLED': 'CANCELADO',
        'COMPLETED': 'FINALIZADO',
        'DONE': 'FINALIZADO'
    };
    return dict[s] || s;
};

const getStatusStyle = (status: string) => {`;

if (content.indexOf('const translateStatus =') === -1 && content.indexOf(searchFn) !== -1) {
    content = content.replace(searchFn, insertFn);
    console.log("Função translateStatus injetada!");
}

// 2. Atualizar o texto do Span para usar o translateStatus
const oldSpan = `{apt.status || 'Confirmado'}`;
const newSpan = `{translateStatus(apt.status || 'Confirmado')}`;

if (content.indexOf('{translateStatus(apt.status') === -1) {
    // Procurar `{apt.status || 'Confirmado'}` dentro do span de status
    content = content.replace(/\{apt\.status \|\| 'Confirmado'\}/g, newSpan);
    console.log("Span de Status atualizado para Português!");
}

fs.writeFileSync(path, content, 'utf8');
