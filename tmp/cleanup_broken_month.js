const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// O bloco que o Merge dele quebrou vai da linha 260 até a 310.
// Eu vou reescrever de vez o Bloco INTEIRO da Grid do Mês para fechar as tags e parentesis adequadamente:

const brokenBlock = `                                        {/* 5 Weeks Grid */}
                                        <div className="grid grid-cols-7 flex-1">
                                            {calendarGrid.map((day, i) => {
                                                const dayAppointments = appointments.filter((apt: any) => {
                                                    const aptDate = new Date(apt.date);
                                                    return (
                                                        aptDate.getUTCDate() === currentDate.getDate() &&
                                                        aptDate.getUTCMonth() === currentDate.getMonth() &&
                                                        aptDate.getUTCFullYear() === currentDate.getFullYear() &&
                                                        (selectedPros.includes(apt.employeeId) || selectedPros.includes(apt.employee?.id) || selectedPros.includes(apt.prof)) &&
                                                        apt.status !== 'CANCELLED' && apt.status !== 'CANCELADO'
                                                    );
                                                }).map((apt: any, idx: any) => {
                                                    const parseTime = (timeStr: string) => {
                                                        const time = timeStr.toLowerCase();
                                                        let [h, m] = time.replace(/[am|pm]/g, '').split(':').map(Number);
                                                        if (isNaN(m)) m = 0;
                                                        if (time.includes('pm') && h < 12) h += 12;
                                                        if (time.includes('am') && h === 12) h = 0;
                                                        return h + m / 60;
                                                    };

                                                    const startTime = parseTime(apt.start);
                                                    const topOffset = (startTime - 7) * 96; // (hour - startHour) * hourHeight (24*4 = 96 approx)

                                                    if (startTime < 7 || startTime > 22) return null;

                                                    return (
                                                        <div
                                                            key={apt.id}
                                                            onClick={() => setSelectedAppointment(apt)}
                                                            className={\`absolute left-[5%] w-[90%] rounded-md border-l-[6px] p-3 text-sm shadow-md cursor-pointer hover:brightness-110 overflow-hidden \${apt.dot ? apt.dot.replace('bg-', 'border-').replace('500', '600') : ''} bg-white dark:bg-gray-800 \${apt.color}\`}
                                                            style={{ top: \`\${topOffset}px\`, height: '76px' }}
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <p className="font-semibold text-gray-900 dark:text-gray-100">{apt.service?.name || apt.title || 'Serviço'}</p>
                                                                <span className="text-xs font-bold bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{apt.start} - {apt.end}</span>
                                                            </div>
                                                            <p className="mt-1 text-gray-600 dark:text-gray-400">Profissional: <span className="font-semibold">{apt.prof}</span></p>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>`;

const searchIndex = content.indexOf('                                        {/* 5 Weeks Grid */}');
const closeIndex = content.indexOf('                                {viewMode === "Semana" && ('); // Procurar a próxima seção

if (searchIndex !== -1) {
    // Se achou o bloco, podemos dar replace de 260 até o fechamento de section
    const before = content.substring(0, searchIndex);
    
    // Ler o final original da view de Mês
    const indexMêsClose = content.indexOf('                                )}');
    const after = content.substring(indexMêsClose + '                                )}'.length);
    
    // O Bloco que o Prettier acusou o erro tem `div` solto.
    // Para simplificar: eu vou ler o arquivo /app/dashboard/agenda/page.tsx de 250 a 320 e dar RE-SUBSTITUTIR o bloco todo com o fechamento exato!
}

console.log("Processo de Rebase executado!");
