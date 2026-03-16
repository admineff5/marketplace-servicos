const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

if (content.indexOf('const [selectedMiniDate, setSelectedMiniDate]') === -1) {
    // 1. Injetar o novo estado
    content = content.replace(
        'const [listFilter, setListFilter] = useState<"Proximos" | "Todos">("Proximos");',
        'const [listFilter, setListFilter] = useState<"Proximos" | "Todos">("Proximos");\n    const [selectedMiniDate, setSelectedMiniDate] = useState<number | null>(null);'
    );
}

// 2. Aplicar o onClick e estilo dinâmico no mini-calendário
const miniCalOld = `{miniCalendarGrid.map((dt, i) => (
                                <div key={i} className={\`w-6 h-6 flex items-center justify-center rounded-full mx-auto cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 \${isToday(dt) ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold' : ''}\`}>
                                    {dt}
                                </div>
                            ))}`;

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

if (content.indexOf('{miniCalendarGrid.map') !== -1) {
    content = content.replace(/\{miniCalendarGrid\.map[^]*?\}\)\)\}/, miniCalNew);
}

// 3. Atualizar o Título da Lista
const headerOld = `{agendaLayout === "list" && <h2 className="text-xl font-normal text-gray-800 dark:text-gray-200 ml-2">Próximos Agendamentos</h2>}`;
const headerNew = `{agendaLayout === "list" && (
                                <h2 className="text-xl font-normal text-gray-800 dark:text-gray-200 ml-2">
                                    {selectedMiniDate ? \`Agendamentos - \${selectedMiniDate} de \${MONTHS[month]}\` : "Próximos Agendamentos"}
                                </h2>
                            )}`;

if (content.indexOf('Próximos Agendamentos</h2>') !== -1) {
    content = content.replace(headerOld, headerNew);
}

// 4. Injetar filtragem por selectedMiniDate no appointments.filter() da Lista
const filterOld = `if (listFilter === "Proximos") {
                                                const aptDate = new Date(apt.date);
                                                const now = new Date();
                                                now.setHours(0,0,0,0);
                                                return aptDate >= now;
                                            }`;

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

if (content.indexOf(filterOld) !== -1) {
    content = content.replace(filterOld, filterNew);
}

fs.writeFileSync(path, content, 'utf8');
console.log("Integração do Mini-Calendário com modo lista aplicada com sucesso!");
