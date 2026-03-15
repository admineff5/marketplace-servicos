const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// O Bloco que o Merge dele quebrou vai da Linha 254 ("{viewMode === "Mês" && (") até 310.
// Vamos substituir o bloco de "Mês" com a estrutura de Grid de Dias Sadias.

const monthViewBlock = `                                {viewMode === "Mês" && (
                                    <div className="flex flex-col flex-1 overflow-y-auto relative">
                                        {/* Days Header */}
                                        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800 shrink-0 sticky top-0 bg-white dark:bg-[#1e1f22] z-10">
                                            {WEEKDAYS.map((day, i) => (
                                                <div key={day} className={\`flex flex-col items-center justify-center py-2 \${i !== 0 ? 'border-l border-gray-200 dark:border-gray-800' : ''}\`}>
                                                    <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">{day}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* 5 Weeks Grid */}
                                        <div className="grid grid-cols-7 flex-1">
                                            {calendarGrid.map((day, i) => {
                                                const dayAppointments = appointments.filter((apt: any) => {
                                                    if (!day.date) return false;
                                                    const aptDate = new Date(apt.date);
                                                    const aptDay = aptDate.getUTCDate();
                                                    const aptMonth = aptDate.getUTCMonth();
                                                    const aptYear = aptDate.getUTCFullYear();

                                                    return (
                                                        aptDay === day.date &&
                                                        aptMonth === month &&
                                                        aptYear === year &&
                                                        (selectedPros.length === 0 || selectedPros.includes(apt.employeeId) || selectedPros.includes(apt.employee?.id) || selectedPros.includes(apt.prof)) &&
                                                        apt.status !== 'CANCELLED' && apt.status !== 'CANCELADO'
                                                    );
                                                });

                                                const dayIsToday = day.date === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

                                                return (
                                                    <div key={i} className={\`min-h-[120px] p-1 border-b border-gray-200 dark:border-gray-800 \${i % 7 !== 0 ? 'border-l border-gray-200 dark:border-gray-800' : ''}\`}>
                                                        <div className="flex justify-center mb-1">
                                                            <span className={\`text-[12px] font-medium w-6 h-6 flex items-center justify-center rounded-full mt-1 \${dayIsToday ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300'}\`}>
                                                                {day.date || ''}
                                                            </span>
                                                        </div>

                                                        <div className="flex flex-col gap-0.5 px-0.5">
                                                            {dayAppointments.map((apt: any) => (
                                                                <div
                                                                    key={apt.id}
                                                                    onClick={() => setSelectedAppointment(apt)}
                                                                    className="flex items-center gap-1.5 px-1 py-0.5 hover:bg-gray-100 dark:hover:bg-gray-800/60 rounded cursor-pointer transition-colors group"
                                                                >
                                                                    <span className={\`w-2 h-2 rounded-full shrink-0 \${apt.dot || 'bg-blue-500'}\`}></span>
                                                                    <span className={\`text-[11px] font-medium truncate \${apt.color || 'text-cyan-700 dark:text-primary'} group-hover:underline\`}>
                                                                        <span className="font-semibold text-gray-600 dark:text-gray-400 mr-1">{apt.start}</span> {apt.service?.name || apt.title || 'Serviço'}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}`;

const searchString = `{viewMode === "Mês" && (`;
const startIndex = content.indexOf(searchString);

if (startIndex !== -1) {
    const before = content.substring(0, startIndex);
    
    // Ler o final da seção Mês (Procurar o final do layout ou o início da view de Lista)
    const listLayoutIndex = content.indexOf('                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/50 dark:bg-[#1e1f22]">');
    // Se a view de Lista de debaixo não estiver, procurar o final de tags div
    const endIndex = content.indexOf('                            <div className="flex-1 overflow-y-auto');

    if (endIndex !== -1) {
        const after = content.substring(endIndex);
        const result = before + monthViewBlock + '\n                            </>\n                        ) : (\n' + after;
        
        fs.writeFileSync(path, result, 'utf8');
        console.log("Grid de Mês restaurada com sucesso!");
    } else {
         console.log("ndex de Lista não encontrado!");
    }
} else {
    console.log("ViewMode Mês não encontrado!");
}
