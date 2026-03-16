const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Injetar Estado
if (content.indexOf('selectedMiniDate') === -1) {
    content = content.replace(
        'const [listFilter, setListFilter] = useState<"Proximos" | "Todos">("Proximos");',
        'const [listFilter, setListFilter] = useState<"Proximos" | "Todos">("Proximos");\n    const [selectedMiniDate, setSelectedMiniDate] = useState<number | null>(null);'
    );
}

// 2. Corrigir com Regex Flexível o loop do Mini-Calendário
const miniCalRegex = /\{miniCalendarGrid\.map\(\(dt, i\) => \([\s\S]*?<div[\s\S]*?className=\{([^]*?)\}[\s\S]*?>[\s\S]*?\{dt\}[\s\S]*?<\/div>[\s\S]*?\)\)\}/g;

const miniCalNew = `{miniCalendarGrid.map((dt, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => dt && setSelectedMiniDate(dt === selectedMiniDate ? null : dt)}
                                    className={\`w-6 h-6 flex items-center justify-center rounded-full mx-auto cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all
                                        \${isToday(dt) && selectedMiniDate !== dt ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-semibold' : ''}
                                        \${selectedMiniDate === dt ? 'bg-cyan-700 hover:bg-cyan-800 text-white dark:bg-primary dark:hover:bg-cyan-400 dark:text-black font-bold shadow-md scale-105' : ''}
                                    \`}
                                >
                                    {dt}
                                </div>
                            ))}`;

if (miniCalRegex.test(content)) {
    content = content.replace(miniCalRegex, miniCalNew);
    console.log("Substituição do Mini-Calendário OK!");
} else {
    console.log("Regex do Mini-Calendário falhou.");
}

// 3. Injetar Filtragem no lists.filter
const filterRegex = /if \(listFilter === "Proximos"\) \{[\s\S]*?return aptDate >= now;[\s\S]*?\}/g;
const filterNew = `if (selectedMiniDate) {
                                                const aptDate = new Date(apt.date);
                                                const aptDay = aptDate.getUTCDate();
                                                const aptMonth = aptDate.getUTCMonth();
                                                const aptYear = aptDate.getUTCFullYear();
                                                if (aptDay !== selectedMiniDate || aptMonth !== month || aptYear !== year) {
                                                    return false;
                                                }
                                            }
                                            if (listFilter === "Proximos") {
                                                const aptDate = new Date(apt.date);
                                                const now = new Date();
                                                now.setHours(0,0,0,0);
                                                return aptDate >= now;
                                            }`;

if (filterRegex.test(content)) {
    content = content.replace(filterRegex, filterNew);
    console.log("Substituição da Filtragem OK!");
} else {
    console.log("Regex da Filtragem falhou.");
}

// 4. Injetar Header Título
const headerRegex = /\{agendaLayout === "list" && <h2 className="text-xl font-normal text-gray-800 dark:text-gray-200 ml-2">Próximos Agendamentos<\/h2>\}/g;
const headerNew = `{agendaLayout === "list" && (
                                <h2 className="text-xl font-normal text-gray-800 dark:text-gray-200 ml-2">
                                    {selectedMiniDate ? \`Agendamentos - \${selectedMiniDate} de \${MONTHS[month]}\` : "Próximos Agendamentos"}
                                </h2>
                            )}`;

if (headerRegex.test(content)) {
    content = content.replace(headerRegex, headerNew);
    console.log("Substituição do Header OK!");
} else {
    console.log("Regex do Header falhou.");
}

fs.writeFileSync(path, content, 'utf8');
