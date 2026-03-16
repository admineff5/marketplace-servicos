const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Injetar Helpers e Arrays no topo
const searchTop = `// 1. KPI Mocks`;
const injectHelpers = `const WEEKDAYS = ["DOM.", "SEG.", "TER.", "QUA.", "QUI.", "SEX.", "SÁB."];
const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const formatTimeLocal = (dateStr: any) => {
    if (!dateStr) return '--:--';
    return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const formatEndTimeLocal = (dateStr: any, duration: number = 30) => {
    if (!dateStr) return '--:--';
    const d = new Date(dateStr);
    return new Date(d.getTime() + duration * 60000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

// 1. KPI Mocks`;

if (content.indexOf(searchTop) !== -1) {
    content = content.replace(searchTop, injectHelpers);
    console.log("Helpers Functions injetadas!");
}

// 2. Injetar state e closeModal
const searchState = `const [isLoading, setIsLoading] = useState(true);`;
const injectState = `const [isLoading, setIsLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
    const closeModal = () => setSelectedAppointment(null);`;

if (content.indexOf(searchState) !== -1) {
    content = content.replace(searchState, injectState);
}

// 3. Substituir o Bloco de Cards (Seção de Próximos Horários)
const searchOldCards = `recentAppointments.map((apt: any) => (
                            <div key={apt.id} className="flex gap-4 p-3 sm:p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#161618] hover:bg-gray-50 dark:hover:bg-[#1a1a1c] transition-colors group">`;

const replaceWithNewCards = `recentAppointments.map((apt: any) => (
                            <div key={apt.id} onClick={() => setSelectedAppointment(apt)} className="bg-white dark:bg-[#161618] border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-cyan-600/30 transition-shadow cursor-pointer flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                                <div className="flex items-start sm:items-center gap-4">
                                    <div className="hidden sm:flex flex-col items-center justify-center w-14 h-14 bg-gray-50 dark:bg-[#1e1f22] rounded-lg border border-gray-200 dark:border-gray-800 shrink-0">
                                        <span className="text-xs font-semibold text-gray-500 uppercase">{WEEKDAYS[new Date(apt.date).getUTCDay()].replace('.', '')}</span>
                                        <span className="text-lg font-bold text-gray-900 dark:text-white leading-none mt-0.5">{new Date(apt.date).getUTCDate()}</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-base font-bold text-gray-900 dark:text-white">{formatTimeLocal(apt.date)} - {apt.title?.split(' - ')[0] || apt.title || 'Serviço'}</h3>
                                            <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                                            <p className="flex items-center gap-1">Profissional: <span className="font-semibold text-gray-800 dark:text-gray-200">{apt.employee?.name || apt.prof}</span></p>
                                            <p className="flex items-center gap-1">Cliente: <span className="font-semibold text-gray-800 dark:text-gray-200">{apt.user?.name || apt.client}</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="shrink-0 flex items-center justify-center">
                                    <span className={\`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider \${apt.status === 'CONFIRMED' || apt.status === 'COMPLETED' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400'}\`}>
                                        {apt.status === 'CONFIRMED' ? 'Confirmado' : 'Pendente'}
                                    </span>
                                </div>
                            </div>`;

// Para não cansar as quebras de linha com indices falhos no map inteiro, vou usar Regex de engolir do map até o final de : (
const regexLoop = /recentAppointments\.map\(\(apt: any\) => \(\s+<div key=\{apt\.id\} className="flex gap-4 p-3[\s\S]*?<\/div>\s+\)\)/g;

if (regexLoop.test(content)) {
    content = content.replace(regexLoop, replaceWithNewCards + ')');
    console.log("Cards substituidos com sucesso debaixo de Regex!");
} else {
    console.log("Regex de Cards falhou.");
}

// 4. Injetar o Modal no FINAL do arquivo (Antes do último </div>)
const modalBlock = `                {selectedAppointment && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm" onClick={closeModal}>
                        <div className="relative w-full max-w-[420px] bg-white dark:bg-[#111] shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-gray-200 dark:border-gray-800 flex flex-col rounded-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
                            <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                                <button onClick={closeModal} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-gray-700 dark:text-gray-300 transition-colors"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="h-[120px] bg-[#FFF1B8] dark:bg-[#1a1a1a] relative overflow-hidden flex items-end px-6 border-b border-gray-100 dark:border-gray-800/50">
                                <div className="absolute bottom-0 left-8 w-24 h-20 bg-[#FFE59E] rounded-t-xl border border-[#DCC78A]"></div>
                                <div className="absolute bottom-0 right-16 w-36 h-24 bg-[#FFE59E] rounded-t-xl border border-[#DCC78A]"></div>
                                <div className="absolute bottom-0 left-12 w-6 h-14 bg-[#1E1A35] rounded-t"></div>
                                <div className="absolute bottom-0 left-24 w-10 h-14 bg-[#FFBADB] rounded-lg"></div>
                                <div className="absolute bottom-0 right-32 w-11 h-12 bg-white/40 border border-white/30 rounded-t-md"></div>
                            </div>
                            <div className="p-6">
                                <h2 className="text-[22px] font-normal text-gray-900 dark:text-gray-100 leading-tight">{selectedAppointment.service?.name || selectedAppointment.title || 'Agendamento'}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatTimeLocal(selectedAppointment.date)} - {formatEndTimeLocal(selectedAppointment.date)}</p>
                            </div>
                        </div>
                    </div>
                )}`;

// Injetar logo acima de </header> ou as tags de retorno finais?
if (content.indexOf(`</div>\n    );\n}`) !== -1) {
    content = content.replace(`</div>\n    );\n}`, `\n${modalBlock}\n        </div>\n    );\n}`);
} else if (content.indexOf(`</div>\r\n    );\r\n}`) !== -1) {
    content = content.replace(`</div>\r\n    );\r\n}`, `\n${modalBlock}\n        </div>\r\n    );\r\n}`);
} else {
    console.log("Não achou final do arquivo para injetar o Modal.");
}

fs.writeFileSync(path, content, 'utf8');
