const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\tarefas\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const checkFunc = `const saveListName = (listId: number) => {`;

if (content.indexOf(checkFunc) !== -1) {
    console.log("Sucesso: A função saveListName está no arquivo.");
} else {
    console.log("Erro: A função saveListName NÃO está no arquivo. Inserindo agora...");
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
    
    content = content.replace(funcOld, funcNew);
    fs.writeFileSync(path, content, 'utf8');
    console.log("Função saveListName inserida com script de backup!");
}
