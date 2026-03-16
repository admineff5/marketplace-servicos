const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Injetar as Helpers Functions
const searchHelperInjections = `const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

export default function AgendaPage() {`;

const newHelperInjections = `const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const formatTimeLocal = (dateStr: any) => {
    if (!dateStr) return '--:--';
    return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const formatEndTimeLocal = (dateStr: any, duration: number = 30) => {
    if (!dateStr) return '--:--';
    const d = new Date(dateStr);
    return new Date(d.getTime() + duration * 60000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

export default function AgendaPage() {`;

if (content.indexOf(searchHelperInjections) !== -1) {
    content = content.replace(searchHelperInjections, newHelperInjections);
    console.log("Helpers Functions injetadas!");
}

// 2. Substituir {apt.start} na Grade de Mês e na Visão Lista
content = content.replace(/\{apt\.start\}/g, "{formatTimeLocal(apt.date)}");
console.log("Substituições de {apt.start} aplicadas!");

// 3. Substituir no Modal (Se houver)
content = content.replace(/\{selectedAppointment\?\.start \|\| '--:--'\}/g, "{formatTimeLocal(selectedAppointment?.date)}");
content = content.replace(/\{selectedAppointment\?\.end \|\| '--:--'\}/g, "{formatEndTimeLocal(selectedAppointment?.date)}");
console.log("Substituições de Modal aplicadas!");

fs.writeFileSync(path, content, 'utf8');
console.log("Regra de Fuso Local front-end aplicada com sucesso!");
