const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const titleOld = `{agendaLayout === "list" && (
                                <h2 className="text-xl font-normal text-gray-800 dark:text-gray-200 ml-2">
                                    {selectedMiniDate ? \`Agendamentos - \${selectedMiniDate} de \${MONTHS[month]}\` : "Próximos Agendamentos"}
                                </h2>
                            )}`;

const titleNew = `{agendaLayout === "list" && (
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-normal text-gray-800 dark:text-gray-200 ml-2">
                                        {selectedMiniDate ? \`Agendamentos - \${selectedMiniDate} de \${MONTHS[month]}\` : "Próximos Agendamentos"}
                                    </h2>
                                    {selectedMiniDate && (
                                        <button 
                                            onClick={() => setSelectedMiniDate(null)} 
                                            className="px-3 py-1 text-xs font-semibold bg-cyan-700 text-white dark:bg-primary dark:text-black rounded-xl hover:shadow-md transition-all flex items-center gap-1"
                                        >
                                            ✕ Ver Todos
                                        </button>
                                    )}
                                </div>
                            )}`;

if (content.indexOf('{selectedMiniDate ? `Agendamentos - ${selectedMiniDate}') !== -1) {
    content = content.replace(titleOld, titleNew);
    console.log("Botão Ver Todos injetado com sucesso no Modo Lista!");
    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("Título com selectedMiniDate não encontrado para substituição direta.");
}
