const fs = require('fs');
const pathLayout = 'c:\\Antigravity\\app\\dashboard\\layout.tsx';

// 1. Adicionar na Sidebar
if (fs.existsSync(pathLayout)) {
    let layoutContent = fs.readFileSync(pathLayout, 'utf8');
    
    // Importar ListTodo
    if (layoutContent.indexOf('ListTodo') === -1) {
        layoutContent = layoutContent.replace('Settings,', 'Settings,\n    ListTodo,');
    }
    
    const linkOld = `{ name: "Agenda", href: "/dashboard/agenda", icon: Calendar },`;
    const linkNew = `{ name: "Agenda", href: "/dashboard/agenda", icon: Calendar },
    { name: "Tarefas", href: "/dashboard/tarefas", icon: ListTodo },`;
    
    if (layoutContent.indexOf(linkOld) !== -1 && layoutContent.indexOf('/dashboard/tarefas') === -1) {
        layoutContent = layoutContent.replace(linkOld, linkNew);
        console.log("Módulo Tarefas adicionado na Sidebar!");
        fs.writeFileSync(pathLayout, layoutContent, 'utf8');
    }
}
