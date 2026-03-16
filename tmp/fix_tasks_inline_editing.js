const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\tarefas\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Estados no topo
const stateOld = `const [showCompletedMap, setShowCompletedMap] = useState<{[key: number]: boolean}>({});`;
const stateNew = `const [showCompletedMap, setShowCompletedMap] = useState<{[key: number]: boolean}>({});
    const [editingListId, setEditingListId] = useState<number | null>(null);
    const [editingListName, setEditingListName] = useState("");`;

if (content.indexOf('const [showCompletedMap') !== -1) {
    content = content.replace(stateOld, stateNew);
    console.log("Estados de edição adicionados!");
}

// 2. Função de Salvamento
const funcOld = `const deleteTask = (taskId: number) => {
        setTarefas(tarefas.filter(t => t.id !== taskId));
    };`;
    
const funcNew = `const deleteTask = (taskId: number) => {
        setTarefas(tarefas.filter(t => t.id !== taskId));
    };

    const saveListName = (listId: number) => {
        if (!editingListName.trim()) return;
        setListas(listas.map(l => l.id === listId ? { ...l, name: editingListName } : l));
        setEditingListId(null);
    };`;

if (content.indexOf('const deleteTask =') !== -1) {
    content = content.replace(funcOld, funcNew);
    console.log("Função saveListName adicionada!");
}

// 3. Substituir Cabeçalho
const headerOld = `<h3 className="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <CheckSquare className="w-4 h-4 text-cyan-700 dark:text-primary" />
                                    {lista.name}
                                </h3>`;

const headerNew = `{editingListId === lista.id ? (
                                    <input 
                                        type="text"
                                        value={editingListName}
                                        onChange={e => setEditingListName(e.target.value)}
                                        onBlur={() => saveListName(lista.id)}
                                        onKeyDown={e => { if (e.key === 'Enter') saveListName(lista.id); }}
                                        autoFocus
                                        className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-sm text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-cyan-600 dark:focus:ring-primary"
                                    />
                                ) : (
                                    <h3 
                                        onClick={() => { setEditingListId(lista.id); setEditingListName(lista.name); }}
                                        className="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2 cursor-pointer hover:underline group/title"
                                        title="Clique para editar"
                                    >
                                        <CheckSquare className="w-4 h-4 text-cyan-700 dark:text-primary" />
                                        <span>{lista.name}</span>
                                        <Edit2 className="w-3 h-3 text-gray-400 opacity-0 group-hover/title:opacity-100 transition-opacity" />
                                    </h3>
                                )}`;

if (content.indexOf('<CheckSquare className="w-4 h-4 text-cyan-700 dark:text-primary" />') !== -1) {
    if (content.indexOf(headerOld) !== -1) {
         content = content.replace(headerOld, headerNew);
         console.log("Header de lista atualizado para Edição Inline!");
    } else {
         // Se houver espaçamentos diferentes, usar regex
         const headerRegex = /<h3 className="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2">[^]*?<CheckSquare[^]*?\/>[^]*?{lista\.name}[^]*?<\/h3>/;
         if (headerRegex.test(content)) {
             content = content.replace(headerRegex, headerNew);
             console.log("Header de lista atualizado via Regex!");
         }
    }
    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("Header do card não encontrado.");
}
