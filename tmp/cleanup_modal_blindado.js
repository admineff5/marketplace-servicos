const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// O bloco do Modal vai de `{selectedAppointment && (` até a linha 448 `)}`
const markerModal = '                {selectedAppointment && (';
const markerModalEnd = '                )}';

const startIndex = content.indexOf(markerModal);

if (startIndex !== -1) {
    const before = content.substring(0, startIndex);
    
    // Ler o final de Section Div principal
    const after = content.substring(startIndex);
    const endIndex = after.indexOf('                )}');
    
    if (endIndex !== -1) {
        const remaining = after.substring(endIndex + '                )}'.length);
        
        const safeModalBlock = `                {selectedAppointment && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm" onClick={closeModal}>
                        <div
                            className="relative w-full max-w-[420px] bg-white dark:bg-[#111] shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-gray-200 dark:border-gray-800 flex flex-col rounded-3xl overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Action Icons Top Right */}
                            <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                                <button className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-gray-700 dark:text-gray-300 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                <button className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-gray-700 dark:text-gray-300 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                <button className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-gray-700 dark:text-gray-300 transition-colors"><Mail className="w-4 h-4" /></button>
                                <button className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-gray-700 dark:text-gray-300 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                                <button onClick={closeModal} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-gray-700 dark:text-gray-300 transition-colors ml-1"><X className="w-5 h-5" /></button>
                            </div>

                            {/* Decorative Header Banner */}
                            <div className="h-[120px] bg-[#FFF1B8] dark:bg-[#111] relative overflow-hidden flex items-end px-6 border-b border-gray-100 dark:border-gray-800/50">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#FFF1B8] via-[#FFF5D1] to-[#FFE8A1] dark:from-[#2a2b2f] dark:to-[#111] opacity-50"></div>
                                <div className="absolute bottom-0 left-8 w-12 h-16 bg-[#E6D19C] dark:bg-gray-800/40 rounded-t-md"></div>
                                <div className="absolute bottom-6 left-[38px] w-8 h-10 bg-white dark:bg-gray-900 rounded-md shadow-sm"></div>
                                <div className="absolute bottom-0 right-16 w-16 h-20 bg-[#FFA5DA] dark:bg-pink-950/20 rounded-t-lg"></div>
                                <div className="absolute bottom-10 right-20 w-8 h-12 bg-white/40 dark:bg-white/5 rounded-sm"></div>
                            </div>

                            <div className="p-6">
                                <div className="flex gap-4">
                                    <div className={\`mt-1.5 w-4 h-4 rounded-sm shrink-0 \${selectedAppointment?.dot || 'bg-gray-500'}\`}></div>
                                    <div className="flex-1">
                                        <h2 className="text-[22px] font-normal text-gray-900 dark:text-gray-100 leading-tight">
                                            {selectedAppointment?.title || 'Agendamento'}
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {selectedAppointment?.year !== undefined && selectedAppointment?.month !== undefined && selectedAppointment?.date !== undefined ? (
                                                \`\${WEEKDAYS[new Date(selectedAppointment.year, selectedAppointment.month, selectedAppointment.date).getDay()]}, \${selectedAppointment.date} de \${MONTHS[selectedAppointment.month].toLowerCase()}\`
                                            ) : 'Data não informada'} • {selectedAppointment?.start || '--:--'} – {selectedAppointment?.end || '--:--'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-6">
                                    <Menu className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                    <div className="flex-1 text-sm text-gray-800 dark:text-gray-300 leading-relaxed font-sans">
                                        <div className="space-y-1">
                                            {selectedAppointment?.client && <p><span className="font-semibold text-gray-500 dark:text-gray-400">Cliente:</span> {selectedAppointment.client}</p>}
                                            {selectedAppointment?.prof && <p><span className="font-semibold text-gray-500 dark:text-gray-400">Profissional:</span> {selectedAppointment.prof}</p>}
                                            <p><span className="font-semibold text-gray-500 dark:text-gray-400">Procedimento:</span> {selectedAppointment?.service?.name || selectedAppointment?.title?.split('-')[0]?.trim() || 'Desconhecido'}</p>
                                        </div>

                                        {selectedAppointment?.desc && (
                                            <p className="mt-3 text-gray-500 dark:text-gray-400">{selectedAppointment.desc}</p>
                                        )}

                                        {selectedAppointment?.clientNote && (
                                            <div className="mt-4 bg-gray-50 dark:bg-gray-800/40 rounded-lg p-3 border border-gray-200 dark:border-gray-800 relative">
                                                <div className="absolute -left-2 top-4 w-4 h-4 bg-gray-50 dark:bg-gray-800/40 border-t border-l border-gray-200 dark:border-gray-800 transform -rotate-45"></div>
                                                <p className="text-sm italic text-gray-700 dark:text-gray-300 relative z-10">"\${selectedAppointment.clientNote}"</p>
                                            </div>
                                        )}

                                        {selectedAppointment?.phone && (
                                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Telefone do cliente: {selectedAppointment.phone}</p>
                                                <a href={\`https://wa.me/\${selectedAppointment.phone.replace(/\\D/g, '')}\`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors rounded-lg font-medium text-xs shadow-sm border border-[#25D366]/20">
                                                    WhatsApp
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-6 items-center text-sm text-gray-700 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-800/50">
                                    <CalendarIcon className="w-5 h-5 text-gray-400 shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-200">Agenda_{selectedAppointment?.prof || 'Geral'}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">Criado por: EFF5 Automação Inteligente EFF5 AI</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}`;
                
        const result = before + safeModalBlock + remaining;
        fs.writeFileSync(path, result, 'utf8');
        console.log("Modal Blindado restaurado com sucesso!");
    }
}
