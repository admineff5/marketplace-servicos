const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Injetar os novos estados
if (content.indexOf('const [startDate, setStartDate]') === -1) {
    content = content.replace(
        'const [selectedMiniDate, setSelectedMiniDate] = useState<number | null>(null);',
        'const [selectedMiniDate, setSelectedMiniDate] = useState<number | null>(null);\n    const [startDate, setStartDate] = useState<string>("");\n    const [endDate, setEndDate] = useState<string>("");'
    );
}

// 2. Atualizar o useEffect para escutar as datas
const oldUseEffect = `useEffect(() => {
        fetchData();
    }, [currentDate, viewMode]);`;

const newUseEffect = `useEffect(() => {
        fetchData();
    }, [currentDate, viewMode, startDate, endDate, agendaLayout]);`;

content = content.replace(oldUseEffect, newUseEffect);

// 3. Atualizar a lógica do fetchData na API
const oldFetch = `const dateStr = currentDate.toISOString().split('T')[0];
            const apptRes = await fetch(viewMode === "Mês" ? '/api/appointments' : \`/api/appointments?date=\${dateStr}\`);`;

const newFetch = `const dateStr = currentDate.toISOString().split('T')[0];
            let url = viewMode === "Mês" ? '/api/appointments' : \`/api/appointments?date=\${dateStr}\`;
            if (agendaLayout === "list" && startDate && endDate) {
                url = \`/api/appointments?startDate=\${startDate}&endDate=\${endDate}\`;
            }
            const apptRes = await fetch(url);`;

content = content.replace(oldFetch, newFetch);

// 4. Substituir o Select de Próximos/Todos por Inputs de Datas no Header
const oldSelect = `{agendaLayout === "list" && (
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
                            )}`;

const newSelect = `{agendaLayout === "list" && (
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1 bg-transparent hover:border-cyan-600 dark:hover:border-primary transition-all">
                                        <input 
                                            type="date" 
                                            value={startDate} 
                                            onChange={e => setStartDate(e.target.value)} 
                                            className="bg-transparent outline-none text-gray-700 dark:text-gray-300 text-xs font-semibold cursor-pointer" 
                                        />
                                    </div>
                                    <span className="text-gray-500 text-xs">até</span>
                                    <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1 bg-transparent hover:border-cyan-600 dark:hover:border-primary transition-all">
                                        <input 
                                            type="date" 
                                            value={endDate} 
                                            onChange={e => setEndDate(e.target.value)} 
                                            className="bg-transparent outline-none text-gray-700 dark:text-gray-300 text-xs font-semibold cursor-pointer" 
                                        />
                                    </div>
                                    {(startDate || endDate) && (
                                        <button 
                                            onClick={() => { setStartDate(""); setEndDate(""); }} 
                                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 rounded-full transition-colors"
                                            title="Limpar Filtro"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            )}`;

content = content.replace(oldSelect, newSelect);

fs.writeFileSync(path, content, 'utf8');
console.log("Interface da Agenda atualizada para suportar Filtros por Período de Range!");
