const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const searchEffect = `    useEffect(() => {
        fetchData();
    }, [currentDate, viewMode]);`;

const injectViewCheck = `    useEffect(() => {
        fetchData();
    }, [currentDate, viewMode]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('view') === 'list') {
            setAgendaLayout('list');
        }
    }, []);`;

if (content.indexOf(searchEffect) !== -1) {
    content = content.replace(searchEffect, injectViewCheck);
    console.log("Check de visualização automática injetado na Agenda!");
    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("Erro: useEffect de AgendaPage não encontrado!");
}
