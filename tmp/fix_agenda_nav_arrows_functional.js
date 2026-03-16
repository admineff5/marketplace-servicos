const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const navPrevOld = `const navPrev = () => {
        if (agendaLayout === "list") {
            // Se nao houver dia clicado, pegar o dia do contexto do currentDate
            const currentDay = selectedMiniDate !== null ? selectedMiniDate : currentDate.getDate();
            
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
        }
        const newDate = new Date(currentDate);
        if (viewMode === "Mês") newDate.setMonth(newDate.getMonth() - 1);
        if (viewMode === "Semana") newDate.setDate(newDate.getDate() - 7);
        if (viewMode === "Dia") newDate.setDate(newDate.getDate() - 1);
        setCurrentDate(newDate);
    };`;

const navPrevNew = `const navPrev = () => {
        const isList = agendaLayout === "list";
        if (isList) {
            setSelectedMiniDate(prev => {
                const currentDay = prev !== null ? prev : currentDate.getUTCDate();
                if (currentDay <= 1) {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setCurrentDate(newDate);
                    return new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
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

const navNextOld = `const navNext = () => {
        if (agendaLayout === "list") {
            const currentDay = selectedMiniDate !== null ? selectedMiniDate : currentDate.getUTCDate();
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
        }
        const newDate = new Date(currentDate);
        if (viewMode === "Mês") newDate.setMonth(newDate.getMonth() + 1);
        if (viewMode === "Semana") newDate.setDate(newDate.getDate() + 7);
        if (viewMode === "Dia") newDate.setDate(newDate.getDate() + 1);
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

if (content.indexOf('const isList = agendaLayout === "list";') === -1 && content.indexOf('currentDay <= 1') !== -1) {
    content = content.replace(navPrevOld, navPrevNew);
    content = content.replace(navNextOld, navNextNew);
    console.log("Navegação da Agenda atualizada para Functional State de segurança!");
    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("Estrutura navPrev/navNext antiga não encontrada.");
}
