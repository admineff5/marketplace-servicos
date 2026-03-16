const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const navPrevRegex = /const navPrev = \(\) => {[^]*?setCurrentDate\(newDate\);\s*};/;
const navNextRegex = /const navNext = \(\) => {[^]*?setCurrentDate\(newDate\);\s*};/;

const navPrevNew = `const navPrev = () => {
        const isList = agendaLayout === "list";
        if (isList) {
            setSelectedMiniDate(prev => {
                const currentDay = prev !== null ? prev : currentDate.getUTCDate();
                if (currentDay <= 1) {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setCurrentDate(newDate);
                    const daysInPrev = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
                    return daysInPrev;
                }
                return currentDay - 1;
            });
            return;
        }
        const newDate = new Date(currentDate);
        if (viewMode === "Mês") newDate.setMonth(newDate.getMonth() - 1);
        if (viewMode === "Semana") newDate.setDate(newDate.getDate() - 7);
        if (viewMode === "Dia") newDate.setDate(newDate.getDate() - 1);
        setCurrentDate(newDate);
    };`;

const navNextNew = `const navNext = () => {
        const isList = agendaLayout === "list";
        if (isList) {
            setSelectedMiniDate(prev => {
                const currentDay = prev !== null ? prev : currentDate.getUTCDate();
                const daysInCurr = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
                if (currentDay >= daysInCurr) {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setCurrentDate(newDate);
                    return 1;
                }
                return currentDay + 1;
            });
            return;
        }
        const newDate = new Date(currentDate);
        if (viewMode === "Mês") newDate.setMonth(newDate.getMonth() + 1);
        if (viewMode === "Semana") newDate.setDate(newDate.getDate() + 7);
        if (viewMode === "Dia") newDate.setDate(newDate.getDate() + 1);
        setCurrentDate(newDate);
    };`;

if (navPrevRegex.test(content)) {
    content = content.replace(navPrevRegex, navPrevNew);
    content = content.replace(navNextRegex, navNextNew);
    console.log("Navegação da Agenda atualizada para Functional State de segurança (RegEx)!");
    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("Regex do navPrev não deu match no arquivo.");
}
