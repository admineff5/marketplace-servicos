"use client";

import { useState, useEffect } from "react";
import { 
    CheckSquare, Plus, PlusCircle, Check, MoreVertical, 
    Star, Trash2, Edit2, ChevronDown, ChevronRight, 
    Folders, ClipboardList, Clock, AlertCircle
} from "lucide-react";

export default function TarefasPage() {
    // 1. Estados de Categorias (Listas)
    const [listas, setListas] = useState<any[]>([]);
    const [newListName, setNewListName] = useState("");
    const [isCreatingList, setIsCreatingList] = useState(false);

    // 2. Estados de Tarefas
    const [tarefas, setTarefas] = useState<any[]>([]);

    const [activeTab, setActiveTab] = useState("all"); // 'all', 'starred'
    const [activeListId, setActiveListId] = useState<number | null>(null); // null = Todas
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [addingTaskToListId, setAddingTaskToListId] = useState<number | null>(null);
    const [showCompletedMap, setShowCompletedMap] = useState<{[key: number]: boolean}>({});

    // --- CARREGAR E SALVAR DO LOCALSTORAGE ---
    useEffect(() => {
        const savedListas = localStorage.getItem("agenda_tasks_listas");
        const savedTarefas = localStorage.getItem("agenda_tasks_items");
        
        if (savedListas) {
            setListas(JSON.parse(savedListas));
        } else {
            setListas([
                { id: 1, name: "As minhas tarefas" },
                { id: 2, name: "Pendencia - Teste" }
            ]);
        }

        if (savedTarefas) {
            setTarefas(JSON.parse(savedTarefas));
        } else {
            setTarefas([
                { id: 1, title: "Adicionar uma tarefa", completed: false, listId: 1, star: false },
                { id: 2, title: "Teste o que fazer 1", completed: true, listId: 1, star: false, completedAt: "segunda, 16/03" }
            ]);
        }
    }, []);

    useEffect(() => {
        if (listas.length > 0) {
            localStorage.setItem("agenda_tasks_listas", JSON.stringify(listas));
        }
    }, [listas]);

    useEffect(() => {
        localStorage.setItem("agenda_tasks_items", JSON.stringify(tarefas));
    }, [tarefas]);

    // --- Auxiliares ---
    const addList = () => {
        if (!newListName.trim()) return;
        const newList = {
            id: Date.now(),
            name: newListName
        };
        setListas([...listas, newList]);
        setNewListName("");
        setIsCreatingList(false);
    };

    const addTask = (listId: number) => {
        if (!newTaskTitle.trim()) return;
        const newTask = {
            id: Date.now(),
            title: newTaskTitle,
            completed: false,
            listId: listId,
            star: false
        };
        setTarefas([newTask, ...tarefas]);
        setNewTaskTitle("");
        setAddingTaskToListId(null);
    };

    const toggleComplete = (taskId: number) => {
        setTarefas(tarefas.map(t => {
            if (t.id === taskId) {
                return {
                    ...t,
                    completed: !t.completed,
                    completedAt: !t.completed ? new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' }) : undefined
                };
            }
            return t;
        }));
    };

    const toggleStar = (taskId: number) => {
         setTarefas(tarefas.map(t => t.id === taskId ? { ...t, star: !t.star } : t));
    };

    const deleteList = (listId: number) => {
        if (window.confirm("Deseja excluir esta lista inteira?")) {
            setListas(listas.filter(l => l.id !== listId));
            setTarefas(tarefas.filter(t => t.listId !== listId));
        }
    };

    const deleteTask = (taskId: number) => {
        setTarefas(tarefas.filter(t => t.id !== taskId));
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-8 bg-gray-50/50 dark:bg-[#0a0a0a] flex gap-6">
            
            {/* Sidebar Esquerda (Internal) */}
            <div className="w-full md:w-64 shrink-0 flex flex-col bg-white dark:bg-[#111112] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm h-full max-h-[calc(100vh-8rem)]">
                <button
                    onClick={() => {
                        if (listas.length > 0) setAddingTaskToListId(listas[0].id);
                    }}
                    className="flex items-center justify-center gap-2 w-full bg-cyan-700 hover:bg-cyan-800 dark:bg-primary dark:hover:bg-cyan-400 text-white dark:text-gray-900 rounded-xl px-4 py-3 font-bold shadow-lg shadow-cyan-500/10 hover:scale-[1.02] transition-all mb-6"
                >
                    <PlusCircle className="w-5 h-5" />
                    <span>Criar Tarefa</span>
                </button>

                <div className="space-y-1">
                    <button
                        onClick={() => { setActiveTab("all"); setActiveListId(null); }}
                        className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === "all" && activeListId === null ? "bg-cyan-50 text-cyan-700 dark:bg-primary/10 dark:text-primary" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                    >
                        <div className="flex items-center gap-3">
                            <ClipboardList className="w-4 h-4" /> Todas as tarefas
                        </div>
                    </button>
                    <button
                        onClick={() => { setActiveTab("starred"); setActiveListId(null); }}
                        className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === "starred" ? "bg-cyan-50 text-cyan-700 dark:bg-primary/10 dark:text-primary" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                    >
                        <div className="flex items-center gap-3">
                            <Star className="w-4 h-4" /> Marcadas com estrela
                        </div>
                    </button>
                </div>

                <div className="mt-8 flex-1 overflow-y-auto">
                    <p className="px-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 border-b border-gray-100 dark:border-gray-800 pb-1">Listas</p>
                    <div className="space-y-1">
                        {listas.map((list) => {
                            const taskCount = tarefas.filter(t => t.listId === list.id && !t.completed).length;
                            const isListActive = activeListId === list.id && activeTab === "list";
                            return (
                                <button
                                    key={list.id}
                                    onClick={() => { setActiveListId(list.id); setActiveTab("list"); }}
                                    className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isListActive ? "bg-cyan-50 text-cyan-700 dark:bg-primary/10 dark:text-primary" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <CheckSquare className="w-4 h-4" color="#0891b2" /> {list.name}
                                    </div>
                                    {taskCount > 0 && <span className="bg-cyan-100 dark:bg-primary/20 text-cyan-800 dark:text-primary px-2 py-0.5 rounded-md text-xs font-black">{taskCount}</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    {isCreatingList ? (
                        <div className="px-2 flex items-center gap-2">
                            <input
                                type="text"
                                value={newListName}
                                onChange={e => setNewListName(e.target.value)}
                                placeholder="Nome da lista..."
                                onKeyDown={(e) => { if (e.key === 'Enter') addList(); }}
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-cyan-600 dark:focus:ring-primary"
                            />
                            <button onClick={addList} className="p-1.5 bg-cyan-700 dark:bg-primary text-white dark:text-gray-900 rounded-md"><Check className="w-3 h-3" /></button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsCreatingList(true)}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-cyan-700 hover:text-cyan-800 dark:text-primary dark:hover:text-cyan-400 font-bold w-full"
                        >
                            <Plus className="w-3 h-3" /> Criar nova lista
                        </button>
                    )}
                </div>
            </div>

            {/* Central Area: Grid de Cards das Listas */}
            <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6 items-start overflow-y-auto max-h-[calc(100vh-6rem)]">
                
                {(activeListId === null ? listas : listas.filter(l => l.id === activeListId)).map((lista) => {
                    const listTasks = tarefas.filter(t => t.listId === lista.id && (activeTab !== "starred" || t.star));
                    const openTasks = listTasks.filter(t => !t.completed);
                    const completedTasks = listTasks.filter(t => t.completed);

                    if (activeTab === "starred" && listTasks.length === 0) return null;

                    return (
                        <div key={lista.id} className="bg-white dark:bg-[#111112] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden flex flex-col max-h-[500px]">
                            
                            {/* Header do Card */}
                            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-[#161618]">
                                <h3 className="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <CheckSquare className="w-4 h-4 text-cyan-700 dark:text-primary" />
                                    {lista.name}
                                </h3>
                                <button onClick={() => deleteList(lista.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Conteúdo do Card (Lista de Tarefas) */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                
                                {/* Botão Rápido de Inserção */}
                                {addingTaskToListId === lista.id ? (
                                    <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3 mt-1">
                                        <div className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center"></div>
                                        <input
                                            type="text"
                                            value={newTaskTitle}
                                            onChange={e => setNewTaskTitle(e.target.value)}
                                            onBlur={() => addTask(lista.id)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') addTask(lista.id); }}
                                            autoFocus
                                            placeholder="O que precisa ser feito?"
                                            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white"
                                        />
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setAddingTaskToListId(lista.id)}
                                        className="flex items-center gap-2 w-full text-left text-sm text-gray-400 hover:text-cyan-700 dark:hover:text-primary font-medium py-1.5 cursor-pointer border-b border-dashed border-gray-100 dark:border-gray-800 pb-3"
                                    >
                                        <PlusCircle className="w-4 h-4 text-cyan-500" /> Adicionar uma tarefa
                                    </button>
                                )}

                                {/* Open Tasks */}
                                <div className="space-y-1">
                                    {openTasks.length > 0 ? openTasks.map(task => (
                                        <div key={task.id} className="flex items-center justify-between group py-2 px-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-all">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <button onClick={() => toggleComplete(task.id)} className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-cyan-50 dark:hover:bg-gray-700 transition-all shrink-0">
                                                </button>
                                                <span className="text-sm text-gray-900 dark:text-gray-200 truncate">{task.title}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => toggleStar(task.id)} className={`opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md ${task.star ? "text-yellow-500" : "text-gray-400 hover:text-gray-600"}`}>
                                                    <Star className="w-4 h-4" fill={task.star ? "currentColor" : "none"} />
                                                </button>
                                                <button onClick={() => deleteTask(task.id)} className="opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-red-500 rounded-md">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )) : (
                                        activeTab === "starred" ? null : <p className="text-xs text-gray-400 text-center py-4">Nenhuma tarefa em aberto.</p>
                                    )}
                                </div>

                                {/* Completed Tasks Accordion */}
                                {completedTasks.length > 0 && (
                                    <div className="mt-4">
                                        <button
                                            onClick={() => setShowCompletedMap(prev => ({ ...prev, [lista.id]: !prev[lista.id] }))}
                                            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 py-1"
                                        >
                                            {showCompletedMap[lista.id] ? <ChevronDown className="w-3" /> : <ChevronRight className="w-3" />}
                                            Concluídas ({completedTasks.length})
                                        </button>
                                        
                                        {showCompletedMap[lista.id] && (
                                            <div className="space-y-1 mt-1 pl-4 border-l border-gray-100 dark:border-gray-800">
                                                {completedTasks.map(task => (
                                                    <div key={task.id} className="flex items-center justify-between group py-1.5 px-2 hover:bg-gray-50 dark:hover:bg-gray-800/20 rounded-lg transition-all">
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <button onClick={() => toggleComplete(task.id)} className="w-5 h-5 rounded-full bg-cyan-100 dark:bg-primary/20 flex items-center justify-center text-cyan-700 dark:text-primary shrink-0">
                                                                <Check className="w-3 h-3" />
                                                            </button>
                                                            <div className="min-w-0">
                                                                <span className="text-sm text-gray-400 dark:text-gray-500 line-through truncate block">{task.title}</span>
                                                                <span className="text-[10px] text-gray-400 block">{task.completedAt}</span>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-red-500 rounded-md">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

            </div>

        </div>
    );
}
