const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Injetar a função approveAppointment no topo do componente
const fnInsert = `const closeModal = () => setSelectedAppointment(null);

    const approveAppointment = async (id: string, e: any) => {
        e.stopPropagation();
        try {
            const res = await fetch(\`/api/appointments/\${id}\`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'CONFIRMED' })
            });
            if (res.ok) {
                fetchData(); // Recarregar
            } else {
                alert("Erro ao aprovar o agendamento.");
            }
        } catch (error) {
            console.error("Erro na aprovação:", error);
        }
    };`;

if (content.indexOf('const approveAppointment =') === -1 && content.indexOf('const closeModal = () => setSelectedAppointment(null);') !== -1) {
    content = content.replace('const closeModal = () => setSelectedAppointment(null);', fnInsert);
    console.log("Função approveAppointment injetada!");
}

// 2. Injetar o Botão Aprovar no Modo Lista
const oldButtons = `<div className="flex items-center gap-2 sm:mt-0 mt-2 sm:border-t-0 border-t border-gray-100 dark:border-gray-800 sm:pt-0 pt-3">
                                                    {apt.phone && (`;

const newButtons = `<div className="flex items-center gap-2 sm:mt-0 mt-2 sm:border-t-0 border-t border-gray-100 dark:border-gray-800 sm:pt-0 pt-3">
                                                    {(apt.status === 'PENDING' || apt.status === 'PENDENTE') && (
                                                        <button 
                                                            onClick={(e) => approveAppointment(apt.id, e)} 
                                                            className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 rounded-md hover:bg-green-200 dark:hover:bg-green-500/20 transition-colors"
                                                        >
                                                            Aprovar
                                                        </button>
                                                    )}
                                                    {apt.phone && (`;

if (content.indexOf('{apt.phone && (') !== -1 && content.indexOf('Aprovar') === -1) {
    content = content.replace(oldButtons, newButtons);
    console.log("Botão Aprovar injetado na Lista!");
} else {
    console.log("Trecho de botões não encontrado ou botão já existente.");
}

fs.writeFileSync(path, content, 'utf8');
