const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Injetar Select de Filtro no Header
const searchHeader = `{agendaLayout === "calendar" && (\r\n                                <div className="hidden sm:flex items-center border border-gray-300`;

const searchHeaderLF = `{agendaLayout === "calendar" && (\n                                <div className="hidden sm:flex items-center border border-gray-300`;

const insertSelect = `{agendaLayout === "list" && (
                                <div className="hidden sm:flex items-center border border-gray-300 dark:border-gray-600 rounded-md bg-transparent mr-2">
                                    <select
                                        value={listFilter}
                                        onChange={(e) => setListFilter(e.target.value as any)}
                                        className="bg-transparent px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 outline-none focus:bg-white dark:focus:bg-gray-900 cursor-pointer"
                                    >
                                        <option value="Proximos">Próximos</option>
                                        <option value="Todos">Todos</option>
                                    </select>
                                </div>
                            )}
                            {agendaLayout === "calendar" && (`;

if (content.indexOf('{agendaLayout === "calendar" && (\r\n') !== -1) {
    content = content.replace('{agendaLayout === "calendar" && (\r\n', insertSelect + '\r\n');
    console.log("Select no Header injetado via CRLF!");
} else if (content.indexOf('{agendaLayout === "calendar" && (\n') !== -1) {
    content = content.replace('{agendaLayout === "calendar" && (\n', insertSelect + '\n');
    console.log("Select no Header injetado via LF!");
}

// 2. Atualizar o Filtro da Lista (.filter)
const filterStr = `.filter((apt: any) => apt.status !== 'CANCELLED' && apt.status !== 'CANCELADO' && (selectedPros.includes(apt.employeeId) || selectedPros.includes(apt.employee?.id) || selectedPros.includes(apt.prof)))`;

const newFilterStr = `.filter((apt: any) => {
                                            const isCancelled = apt.status === 'CANCELLED' || apt.status === 'CANCELADO';
                                            if (isCancelled) return false;
                                            const matchesPro = selectedPros.includes(apt.employeeId) || selectedPros.includes(apt.employee?.id) || selectedPros.includes(apt.prof);
                                            if (!matchesPro) return false;
                                            if (listFilter === "Proximos") {
                                                const aptDate = new Date(apt.date);
                                                const now = new Date();
                                                now.setHours(0,0,0,0);
                                                return aptDate >= now;
                                            }
                                            return true;
                                        })`;

if (content.indexOf(filterStr) !== -1) {
    content = content.replace(filterStr, newFilterStr);
    console.log("Filtro de Lista atualizado!");
} else {
    console.log("Linha do Filtro da Lista não encontrada!");
}

fs.writeFileSync(path, content, 'utf8');
console.log("Filtro de visualização de Lista totalmente aplicado!");
