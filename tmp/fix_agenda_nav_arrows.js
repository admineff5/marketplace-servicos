const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const navPrevOld = `const navPrev = () => {
        const newDate = new Date(currentDate);
        if (viewMode === "Mês") newDate.setMonth(newDate.getMonth() - 1);
        if (viewMode === "Semana") newDate.setDate(newDate.getDate() - 7);
        if (viewMode === "Dia") newDate.setDate(newDate.getDate() - 1);
        setCurrentDate(newDate);
    };`;

const navPrevNew = `const navPrev = () => {
        if (agendaLayout === "list" && selectedMiniDate !== null) {
            if (selectedMiniDate <= 1) {
                const newDate = new Date(currentDate);
                newDate.setMonth(newDate.getMonth() - 1);
                const daysInPrev = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
                setSelectedMiniDate(daysInPrev);
                setCurrentDate(newDate);
            } else {
                setSelectedMiniDate(selectedMiniDate - 1);
            }
            return;
        }
        const newDate = new Date(currentDate);
        if (viewMode === "Mês") newDate.setMonth(newDate.getMonth() - 1);
        if (viewMode === "Semana") newDate.setDate(newDate.getDate() - 7);
        if (viewMode === "Dia") newDate.setDate(newDate.getDate() - 1);
        setCurrentDate(newDate);
    };`;

const navNextOld = `const navNext = () => {
        const newDate = new Date(currentDate);
        if (viewMode === "Mês") newDate.setMonth(newDate.getMonth() + 1);
        if (viewMode === "Semana") newDate.setDate(newDate.getDate() + 7);
        if (viewMode === "Dia") newDate.setDate(newDate.getDate() + 1);
        setCurrentDate(newDate);
    };`;

const navNextNew = `const navNext = () => {
        if (agendaLayout === "list" && selectedMiniDate !== null) {
            const daysInCurr = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
            if (selectedMiniDate >= daysInCurr) {
                const newDate = new Date(currentDate);
                newDate.setMonth(newDate.getMonth() + 1);
                setSelectedMiniDate(1);
                setCurrentDate(newDate);
            } else {
                setSelectedMiniDate(selectedMiniDate + 1);
            }
            return;
        }
        const newDate = new Date(currentDate);
        if (viewMode === "Mês") newDate.setMonth(newDate.getMonth() + 1);
        if (viewMode === "Semana") newDate.setDate(newDate.getDate() + 7);
        if (viewMode === "Dia") newDate.setDate(newDate.getDate() + 1);
        setCurrentDate(newDate);
    };`;

const jumpOld = `const jumpToToday = () => setCurrentDate(new Date());`;
const jumpNew = `const jumpToToday = () => {
        const now = new Date();
        if (agendaLayout === "list") setSelectedMiniDate(now.getDate());
        setCurrentDate(now);
    };`;

if (content.indexOf('const navPrev = () =>') !== -1) {
    content = content.replace(navPrevOld, navPrevNew);
    content = content.replace(navNextOld, navNextNew);
    content = content.replace(jumpOld, jumpNew);
    console.log("Navegação da Agenda atualizada para dar suporte ao Dia a Dia!");
    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("Funções navPrev/navNext não encontradas para substituição.");
}
