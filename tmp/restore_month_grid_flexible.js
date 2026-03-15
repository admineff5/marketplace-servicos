const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// O Bloco com erro vai do `{viewMode === "Mês" && (` até `) : (` da interface de Lista
const marker1 = '{viewMode === "Mês" && (';
const marker2 = '                        ) : (';

const index1 = content.indexOf(marker1);
const index2 = content.indexOf(marker2);

if (index1 !== -1 && index2 !== -1) {
    const before = content.substring(0, index1);
    const after = content.substring(index2);
    
    const monthViewBlock = `{viewMode === "Mês" && (
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
                                )}\n                            </>\n`;

    const result = before + monthViewBlock + after;
    fs.writeFileSync(path, result, 'utf8');
    console.log("Grid de Mês corrigida com sucesso!");
} else {
    console.log("Marcadores de visualização de Mês não encontrados!");
}
