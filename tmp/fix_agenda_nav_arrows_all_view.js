const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const navPrevOld = `const navPrev = () => {
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
        }`;

const navPrevNew = `const navPrev = () => {
        if (agendaLayout === "list") {
            // Se nao houver dia clicado, pegar o dia do contexto do currentDate
            const currentDay = selectedMiniDate !== null ? selectedMiniDate : new Date(currentDate).getUTCDate();
            
            if (currentDay <= 1) {
                const newDate = new Date(currentDate);
                newDate.setMonth(newDate.getMonth() - 1);
                const daysInPrev = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
                setSelectedMiniDate(daysInPrev);
                setCurrentDate(newDate);
            } else {
                setSelectedMiniDate(currentDay - 1);
            }
            return;
        }`;

const navNextOld = `const navNext = () => {
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
        }`;

const navNextNew = `const navNext = () => {
        if (agendaLayout === "list") {
            const currentDay = selectedMiniDate !== null ? selectedMiniDate : new Date(currentDate).getUTCDate();
            const daysInCurr = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
            
            if (currentDay >= daysInCurr) {
                const newDate = new Date(currentDate);
                newDate.setMonth(newDate.getMonth() + 1);
                setSelectedMiniDate(1);
                setCurrentDate(newDate);
            } else {
                setSelectedMiniDate(currentDay + 1);
            }
            return;
        }`;

if (content.indexOf('agendaLayout === "list" && selectedMiniDate !== null') !== -1) {
    content = content.replace(navPrevOld, navPrevNew);
    content = content.replace(navNextOld, navNextNew);
    console.log("Navegação da Agenda atualizada com Fallback diário!");
    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("Funções navPrev/navNext com selectedMiniDate!==null não encontradas.");
}
