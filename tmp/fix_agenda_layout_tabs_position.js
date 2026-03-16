const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Alterar Default layout para 'list'
const stateOld = `const [agendaLayout, setAgendaLayout] = useState<"calendar" | "list">(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('view') === 'list') return 'list';
        }
        return 'calendar';
    });`;

const stateNew = `const [agendaLayout, setAgendaLayout] = useState<"calendar" | "list">(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('view') === 'list') return 'list';
            if (params.get('view') === 'calendar') return 'calendar';
        }
        return 'list';
    });`;

if (content.indexOf('return \'calendar\';') !== -1) {
    content = content.replace(stateOld, stateNew);
    console.log("Default AgendaLayout alterado para Lista!");
}

// 2. Reposicionar e Ajustar Design dos Botões de Alternância
const headerOld = `<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                        <CalendarIcon className="w-6 h-6 text-cyan-700 dark:text-primary" />
                        Agenda
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Gerencie seus horários e acompanhe os agendamentos.
                    </p>
                </div>

                
                <div className="flex bg-gray-200 dark:bg-gray-800/80 rounded-lg p-1 shadow-sm border border-gray-300 dark:border-gray-700">
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
                </div>
            </div>`;

const headerNew = `<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
                <div className="flex items-center gap-4">
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
                </div>

                <p className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
                    Gerencie seus horários e acompanhe os agendamentos.
                </p>
            </div>`;

if (content.indexOf('setAgendaLayout("calendar")') !== -1) {
    content = content.replace(headerOld, headerNew);
    console.log("Header da Agenda reposicionado com sucesso!");
    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("Header antigo não encontrado para substituição direta.");
}
