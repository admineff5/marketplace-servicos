const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Injetar State do Filtro
const searchState = `const [searchQuery, setSearchQuery] = useState("");`;
const replaceState = `const [searchQuery, setSearchQuery] = useState("");\n    const [listFilter, setListFilter] = useState<"Proximos" | "Todos">("Proximos");`;

if (content.indexOf(searchState) !== -1) {
    content = content.replace(searchState, replaceState);
    console.log("State do Filtro de Lista injetado!");
}

// 2. Injetar Select de Filtro no Header
const searchHeaderRight = `{agendaLayout === "calendar" && (
                                <div className="hidden sm:flex items-center border border-gray-300 dark:border-gray-600 rounded-md bg-transparent">`;

const replaceHeaderRight = `{agendaLayout === "list" && (
                                <div className="hidden sm:flex items-center border border-gray-300 dark:border-gray-600 rounded-md bg-transparent">
                                    <select
                                        value={listFilter}
                                        onChange={(e) => setListFilter(e.target.value as any)}
                                        className="bg-transparent px-3 py-1.5 text-sm font-medium text-gray-700 outline-none dark:text-gray-300 focus:bg-white dark:focus:bg-gray-900 cursor-pointer"
                                    >
                                        <option value="Proximos">Próximos</option>
                                        <option value="Todos">Todos</option>
                                    </select>
                                </div>
                            )}
                            {agendaLayout === "calendar" && (
                                <div className="hidden sm:flex items-center border border-gray-300 dark:border-gray-600 rounded-md bg-transparent">`;

if (content.indexOf(searchHeaderRight) !== -1) {
    content = content.replace(searchHeaderRight, replaceHeaderRight);
    console.log("Select de Filtro no Header injetado!");
}

// 3. Atualizar o Filtro da Lista (.filter)
const searchListFilter = `                                    {appointments
                                        .filter((apt: any) => apt.status !== 'CANCELLED' && apt.status !== 'CANCELADO' && (selectedPros.includes(apt.employeeId) || selectedPros.includes(apt.employee?.id) || selectedPros.includes(apt.prof)))`;

const replaceListFilter = `                                    {appointments
                                        .filter((apt: any) => {
                                            const isCancelled = apt.status === 'CANCELLED' || apt.status === 'CANCELADO';
                                            if (isCancelled) return false;
                                            const matchesPro = selectedPros.includes(apt.employeeId) || selectedPros.includes(apt.employee?.id) || selectedPros.includes(apt.prof);
                                            if (!matchesPro) return false;
                                            
                                            if (listFilter === "Proximos") {
                                                const aptDate = new Date(apt.date);
                                                const now = new Date();
                                                now.setHours(0,0,0,0); // Considera hoje o dia inteiro
                                                return aptDate >= now;
                                            }
                                            return true;
                                        })`;

if (content.indexOf(searchListFilter) !== -1) {
    content = content.replace(searchListFilter, replaceListFilter);
    console.log("Filtro de Lista atualizado!");
}

fs.writeFileSync(path, content, 'utf8');
console.log("Filtro de visualização de Lista aplicado com sucesso!");
