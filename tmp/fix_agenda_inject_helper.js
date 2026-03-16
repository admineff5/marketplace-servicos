const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const searchStr = 'export default function AgendaPage() {';
const replaceStr = `const formatTimeLocal = (dateStr: any) => {
    if (!dateStr) return '--:--';
    return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const formatEndTimeLocal = (dateStr: any, duration: number = 30) => {
    if (!dateStr) return '--:--';
    const d = new Date(dateStr);
    return new Date(d.getTime() + duration * 60000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

export default function AgendaPage() {`;

if (content.indexOf(searchStr) !== -1) {
    content = content.replace(searchStr, replaceStr);
    console.log("Variáveis formatTimeLocal injetadas com sucesso!");
} else {
    console.log("String de AgendaPage não encontrada!");
}

fs.writeFileSync(path, content, 'utf8');
