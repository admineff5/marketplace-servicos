const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const modalBlock = `                {selectedAppointment && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm" onClick={closeModal}>
                        <div className="relative w-full max-w-[420px] bg-white dark:bg-[#111] shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-gray-200 dark:border-gray-800 flex flex-col rounded-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
                            <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                                <button onClick={closeModal} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-gray-700 dark:text-gray-300 transition-colors"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="h-[120px] bg-[#FFF1B8] dark:bg-[#1a1a1a] relative overflow-hidden flex items-end px-6 border-b border-gray-100 dark:border-gray-800/50">
                                <div className="absolute bottom-0 left-8 w-24 h-20 bg-[#FFE59E] rounded-t-xl border border-[#DCC78A]"></div>
                                <div className="absolute bottom-0 right-16 w-36 h-24 bg-[#FFE59E] rounded-t-xl border border-[#DCC78A]"></div>
                                <div className="absolute bottom-0 left-12 w-6 h-14 bg-[#1E1A35] rounded-t"></div>
                                <div className="absolute bottom-0 left-24 w-10 h-14 bg-[#FFBADB] rounded-lg"></div>
                                <div className="absolute bottom-0 right-32 w-11 h-12 bg-white/40 border border-white/30 rounded-t-md"></div>
                            </div>
                            <div className="p-6">
                                <h2 className="text-[22px] font-normal text-gray-900 dark:text-gray-100 leading-tight">{selectedAppointment.service?.name || selectedAppointment.title || 'Agendamento'}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatTimeLocal(selectedAppointment.date)} - {formatEndTimeLocal(selectedAppointment.date)}</p>
                            </div>
                        </div>
                    </div>
                )}`;

if (content.indexOf(`{selectedAppointment && (`) === -1) {
    const lastDivIndex = content.lastIndexOf('</div>');
    if (lastDivIndex !== -1) {
        content = content.slice(0, lastDivIndex) + `\n${modalBlock}\n        </div>` + content.slice(lastDivIndex + 6);
        console.log("Modal de Detalhes injetado no final do arquivo!");
        fs.writeFileSync(path, content, 'utf8');
    } else {
        console.log("Não achou nenhuma tag </div> para injetar o Modal.");
    }
} else {
    console.log("Modal já parece estar injetado.");
}
