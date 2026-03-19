import sys
f=open('c:/Antigravity/app/dashboard/agenda/page.tsx', 'r', encoding='utf-8')
c=f.read()
f.close()

# 1. State definitions insertion
state_insert_marker = 'const [selectedMiniDate, setSelectedMiniDate] = useState<number | null>(null);'
state_code = '''const [selectedMiniDate, setSelectedMiniDate] = useState<number | null>(null);
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState<string>("");'''

if state_insert_marker in c:
    c = c.replace(state_insert_marker, state_code)

# 2. handleReject handler insertion
handle_marker = 'const approveAppointment = async (id: string, e: any) => {'
handle_code = '''const handleReject = async () => {
        if (!rejectingId) return;
        try {
            const res = await fetch(`/api/appointments/${rejectingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'CANCELLED', comment: rejectReason })
            });
            if (res.ok) {
                setRejectingId(null);
                setRejectReason("");
                fetchData();
            } else {
                alert("Erro ao recusar o agendamento.");
            }
        } catch (error) {
            console.error("Erro na recusa:", error);
        }
    };

    const approveAppointment = async (id: string, e: any) => {'''

if handle_marker in c:
    c = c.replace(handle_marker, handle_code)

# 3. Add Recusar Button in List View
list_marker = '''                                                    {(apt.status === 'PENDING' || apt.status === 'PENDENTE') && (
                                                        <button 
                                                            onClick={(e) => approveAppointment(apt.id, e)} 
                                                            className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 rounded-md hover:bg-green-200 dark:hover:bg-green-500/20 transition-colors"
                                                        >
                                                            Aprovar
                                                        </button>
                                                    )}'''

list_replace = '''                                                    {(apt.status === 'PENDING' || apt.status === 'PENDENTE') && (
                                                        <div className="flex gap-2">
                                                            <button 
                                                                onClick={(e) => approveAppointment(apt.id, e)} 
                                                                className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 rounded-md hover:bg-green-200 dark:hover:bg-green-500/20 transition-colors"
                                                            >
                                                                Aprovar
                                                            </button>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); setRejectingId(apt.id); setRejectReason(""); }} 
                                                                className="px-3 py-1.5 text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-500/20 transition-colors"
                                                            >
                                                                Recusar
                                                            </button>
                                                        </div>
                                                    )}'''

if list_marker in c:
    c = c.replace(list_marker, list_replace)

# 4. Add action buttons inside Details Modal
modal_marker = '<div className="flex gap-4 mt-6 items-center text-sm text-gray-700 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-800/50">'
modal_replace = '''{(selectedAppointment.status === 'PENDING' || selectedAppointment.status === 'PENDENTE') && (
                                        <div className="flex gap-2 w-full mt-4">
                                            <button 
                                                onClick={(e) => { approveAppointment(selectedAppointment.id, e); closeModal(); }} 
                                                className="flex-1 py-2.5 text-sm font-bold bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-500/20 transition-all text-center"
                                            >
                                                Aprovar
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setRejectingId(selectedAppointment.id); setRejectReason(""); closeModal(); }} 
                                                className="flex-1 py-2.5 text-sm font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-500/20 transition-all text-center"
                                            >
                                                Recusar
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex gap-4 mt-6 items-center text-sm text-gray-700 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-800/50">'''

if modal_marker in c:
    c = c.replace(modal_marker, modal_replace)

# 5. Insert Reject Modal Render markup at bottom
bottom_marker = '                {selectedAppointment && ('
bottom_code = '''                {/* MODAL DE RECUSA */}
                {rejectingId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setRejectingId(null)}>
                        <div className="bg-white dark:bg-[#1a1a1c] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Recusar Agendamento</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Escreva o motivo da recusa. O cliente receberá essa justificativa.</p>
                            <textarea 
                                rows={4}
                                value={rejectReason}
                                onChange={e => setRejectReason(e.target.value)}
                                placeholder="Exemplo: Horário indisponível por motivos de força maior..."
                                className="w-full bg-gray-50 dark:bg-[#151516] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-600 transition-all resize-none mb-4"
                            />
                            <div className="flex items-center justify-end gap-3">
                                <button 
                                    onClick={() => setRejectingId(null)}
                                    className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={handleReject}
                                    disabled={!rejectReason.trim()}
                                    className="px-4 py-2 text-sm font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20"
                                >
                                    Recusar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {selectedAppointment && ('''

if bottom_marker in c:
    c = c.replace(bottom_marker, bottom_code)

f=open('c:/Antigravity/app/dashboard/agenda/page.tsx', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done')
