const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Bloco de botões de alternância para remoção
const buttonsOld = `<div className="flex bg-gray-200 dark:bg-gray-800/80 rounded-lg p-1 shadow-sm border border-gray-300 dark:border-gray-700">
                    <button
                        onClick={() => setAgendaLayout("calendar")}
                        className={\`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 \${agendaLayout === "calendar" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}\`}
                    >
                        <CalendarIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Calendário</span>
                    </button>
                    <button
                        onClick={() => setAgendaLayout("list")}
                        className={\`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 \${agendaLayout === "list" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}\`}
                    >
                        <LayoutList className="w-4 h-4" />
                        <span className="hidden sm:inline">Lista</span>
                    </button>
                </div>`;

// 2. Título "Agenda" onde deve ser injetado o novo bloco
const titleOld = `<h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                        <CalendarIcon className="w-6 h-6 text-cyan-700 dark:text-primary" />
                        Agenda
                    </h1>`;

const titleNew = `<div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                        <CalendarIcon className="w-6 h-6 text-cyan-700 dark:text-primary" />
                        Agenda
                    </h1>
                    
                    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 shadow-inner border border-gray-200 dark:border-gray-700/50">
                        <button
                            onClick={() => setAgendaLayout("calendar")}
                            className={\`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 \${agendaLayout === "calendar" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}\`}
                        >
                            <CalendarIcon className="w-4 h-4" />
                            {agendaLayout === "calendar" && <span className="text-xs font-bold">Calendário</span>}
                        </button>
                        <button
                            onClick={() => setAgendaLayout("list")}
                            className={\`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 \${agendaLayout === "list" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}\`}
                        >
                            <LayoutList className="w-4 h-4" />
                            {agendaLayout === "list" && <span className="text-xs font-bold">Lista</span>}
                        </button>
                    </div>
                </div>`;

if (content.indexOf('Agenda') !== -1) {
    // Substituir o Titulo para colocar os botões ao lado
    if (content.indexOf(titleOld) !== -1) {
        content = content.replace(titleOld, titleNew);
        console.log("Título atualizado com botões de alternância!");
    } else {
        console.log("Título old não encontrado.");
    }

    // Remover o Bloco de botões antigo do lado direito
    if (content.indexOf(buttonsOld) !== -1) {
        content = content.replace(buttonsOld, '<!-- Botões removidos -->');
        console.log("Bloco antigo de botões removido!");
    } else {
         console.log("Bloco buttonsOld não encontrado.");
    }

    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("Texto Agenda não encontrado no arquivo.");
}
