const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\tarefas\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Adicionar o Estado Superior
const stateAddOld = `const [addingTaskToListId, setAddingTaskToListId] = useState<number | null>(null);`;
const stateAddNew = `const [addingTaskToListId, setAddingTaskToListId] = useState<number | null>(null);
    const [showCompletedMap, setShowCompletedMap] = useState<{[key: number]: boolean}>({});`;

if (content.indexOf('setAddingTaskToListId') !== -1 && content.indexOf('showCompletedMap') === -1) {
    content = content.replace(stateAddOld, stateAddNew);
    console.log("Estado showCompletedMap adicionado no topo!");
}

// 2. Remover o useState quebrado de dentro do loop
const innerStateOld = `                    const openTasks = listTasks.filter(t => !t.completed);
                    const completedTasks = listTasks.filter(t => t.completed);
                    const [showCompleted, setShowCompleted] = useState(false);`;

const innerStateNew = `                    const openTasks = listTasks.filter(t => !t.completed);
                    const completedTasks = listTasks.filter(t => t.completed);`;

if (content.indexOf('const [showCompleted, setShowCompleted] = useState(false);') !== -1) {
    content = content.replace(innerStateOld, innerStateNew);
    console.log("useState removido de dentro do loop!");
}

// 3. Atualizar o acionador e vizualizador no Accordion do Loop
const accordionOld = `<button
                                            onClick={() => setShowCompleted(!showCompleted)}
                                            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 py-1"
                                        >
                                            {showCompleted ? <ChevronDown className="w-3" /> : <ChevronRight className="w-3" />}
                                            Concluídas ({completedTasks.length})
                                        </button>
                                        
                                        {showCompleted && (`;

const accordionNew = `<button
                                            onClick={() => setShowCompletedMap(prev => ({ ...prev, [lista.id]: !prev[lista.id] }))}
                                            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 py-1"
                                        >
                                            {showCompletedMap[lista.id] ? <ChevronDown className="w-3" /> : <ChevronRight className="w-3" />}
                                            Concluídas ({completedTasks.length})
                                        </button>
                                        
                                        {showCompletedMap[lista.id] && (`;

if (content.indexOf('onClick={() => setShowCompleted(!showCompleted)}') !== -1) {
    content = content.replace(accordionOld, accordionNew);
    console.log("Accordion do card atualizado com sucesso!");
}

fs.writeFileSync(path, content, 'utf8');
