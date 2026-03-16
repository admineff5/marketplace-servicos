const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Regex para o Bloco de Botões Antigo (Do lado direito)
const buttonsRegex = /<div className="flex bg-gray-200[^]*?<CalendarIcon[^]*?<LayoutList[^]*?<\/div>/;

// 2. Regex para o Título (Canto Esquerdo)
const titleRegex = /<h1 className="text-2xl font-bold[^]*?<CalendarIcon[^]*?Agenda\s*<\/h1>/;

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

if (titleRegex.test(content)) {
    content = content.replace(titleRegex, titleNew);
    console.log("Título atualizado com Botões de Alternância no Cabeçalho!");
} else {
    console.log("Regex do Título não deu match.");
}

if (buttonsRegex.test(content)) {
    content = content.replace(buttonsRegex, '<!-- Botões removidos -->');
    console.log("Bloco de Botões antigo removido da Direita!");
} else {
    console.log("Regex dos Botões antigos não deu match.");
}

fs.writeFileSync(path, content, 'utf8');
