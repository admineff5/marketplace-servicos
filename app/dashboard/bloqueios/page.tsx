"use client";

import { useState, useEffect } from "react";
import { Search, Plus, CalendarOff, Edit2, Trash2, X } from "lucide-react";

export default function FeriadosBloqueiosPage() {
    const [blocks, setBlocks] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dateStart, setDateStart] = useState("");
    const [dateEnd, setDateEnd] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlock, setEditingBlock] = useState<any>(null);

    // Modal Form States
    const [formDate, setFormDate] = useState("");
    const [formSituation, setFormSituation] = useState("Feriado");
    const [formReason, setFormReason] = useState("");
    const [formProfId, setFormProfId] = useState("all");
    const [formOpenTime, setFormOpenTime] = useState("");
    const [formCloseTime, setFormCloseTime] = useState("");

    useEffect(() => {
        fetchData();
        fetchEmployees();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/blocks');
            const data = await res.json();
            setBlocks(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erro ao carregar bloqueios:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await fetch('/api/employees');
            const data = await res.json();
            setEmployees(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erro ao carregar profissionais:", error);
        }
    };

    const handleSave = async () => {
        if (!formDate || !formSituation) return;

        const payload = {
            date: formDate,
            situation: formSituation,
            reason: formReason,
            employeeId: formProfId === "all" ? null : formProfId,
            openTime: formSituation === "Horário Especial" ? formOpenTime : null,
            closeTime: formSituation === "Horário Especial" ? formCloseTime : null,
            isAllDay: formSituation !== "Horário Especial"
        };

        try {
            const url = editingBlock ? `/api/blocks/${editingBlock.id}` : '/api/blocks';
            const method = editingBlock ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setIsModalOpen(false);
                resetForm();
                fetchData();
            }
        } catch (error) {
            console.error("Erro ao salvar bloqueio:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Deseja realmente excluir este bloqueio?")) return;
        try {
            const res = await fetch(`/api/blocks/${id}`, { method: 'DELETE' });
            if (res.ok) fetchData();
        } catch (error) {
            console.error("Erro ao excluir bloqueio:", error);
        }
    };

    const handleEdit = (block: any) => {
        setEditingBlock(block);
        setFormDate(new Date(block.date).toISOString().split('T')[0]);
        setFormSituation(block.situation);
        setFormReason(block.reason || "");
        setFormProfId(block.employeeId || "all");
        setFormOpenTime(block.openTime || "");
        setFormCloseTime(block.closeTime || "");
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormDate("");
        setFormSituation("Feriado");
        setFormReason("");
        setFormProfId("all");
        setFormOpenTime("");
        setFormCloseTime("");
        setEditingBlock(null);
    };

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <CalendarOff className="w-6 h-6 text-cyan-700 dark:text-primary" />
                        Feriados e Bloqueios
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Cadastre dias de fechamento total ou parcial para impedir o agendamento de clientes.
                    </p>
                </div>
            </div>

            {/* Top Bar - Filter & Add */}
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Pesquisar de</span>
                    <input
                        type="date"
                        value={dateStart}
                        onChange={e => setDateStart(e.target.value)}
                        className="bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                    />
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">até</span>
                    <input
                        type="date"
                        value={dateEnd}
                        onChange={e => setDateEnd(e.target.value)}
                        className="bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                    />
                    <button type="button" className="flex items-center justify-center w-9 h-9 ml-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg shadow-sm transition-colors" title="Pesquisar">
                        <Search className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex w-full md:w-auto justify-end">
                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 rounded-xl shadow-sm transition-colors shrink-0"
                    >
                        <Plus className="w-4 h-4" /> Adicionar Bloqueio
                    </button>
                </div>
            </div>

            {/* Resultado da Tabela */}
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-sm">
                <div className="block w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-gray-800/20 text-gray-500 dark:text-gray-400">
                                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-r border-gray-100 dark:border-gray-800/50">Data</th>
                                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-r border-gray-100 dark:border-gray-800/50">Dia da Semana</th>
                                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-r border-gray-100 dark:border-gray-800/50">Profissional</th>
                                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-r border-gray-100 dark:border-gray-800/50">Situação</th>
                                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-r border-gray-100 dark:border-gray-800/50">Motivo</th>
                                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-r border-gray-100 dark:border-gray-800/50">Horário Abertura</th>
                                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-r border-gray-100 dark:border-gray-800/50">Horário Fechamento</th>
                                <th className="py-3 px-4 text-xs w-20 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {isLoading ? (
                                <tr><td colSpan={8} className="py-10 text-center text-gray-500">Carregando bloqueios...</td></tr>
                            ) : blocks.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-[#161618] transition-colors">
                                    <td className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100 border-r border-gray-100 dark:border-gray-800/50">
                                        <div className="flex items-center gap-2">
                                            <CalendarOff className="w-3.5 h-3.5 text-orange-500" />
                                            {new Date(row.date).toLocaleDateString('pt-BR')}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300 border-r border-gray-100 dark:border-gray-800/50">
                                        {new Date(row.date).toLocaleDateString('pt-BR', { weekday: 'long' })}
                                    </td>
                                    <td className="py-3 px-4 text-sm font-bold text-gray-800 dark:text-gray-200 border-r border-gray-100 dark:border-gray-800/50">
                                        {row.employee?.name || "Loja Inteira"}
                                    </td>
                                    <td className="py-3 px-4 border-r border-gray-100 dark:border-gray-800/50 text-center">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border
                                            ${row.situation === 'Feriado' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' :
                                                row.situation === 'Atestado' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20' :
                                                    'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20'}`}
                                        >
                                            {row.situation}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm font-medium text-gray-800 dark:text-gray-200 border-r border-gray-100 dark:border-gray-800/50">
                                        {row.reason || "-"}
                                    </td>
                                    <td className="py-3 px-4 text-sm font-bold text-gray-500 dark:text-gray-400 text-center border-r border-gray-100 dark:border-gray-800/50">
                                        {row.openTime || "-"}
                                    </td>
                                    <td className="py-3 px-4 text-sm font-bold text-gray-500 dark:text-gray-400 text-center border-r border-gray-100 dark:border-gray-800/50">
                                        {row.closeTime || "-"}
                                    </td>
                                    <td className="py-2.5 px-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => handleEdit(row)} className="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 transition-colors" title="Editar">
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => handleDelete(row.id)} className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-md text-red-600 dark:text-red-400 transition-colors" title="Remover">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!isLoading && blocks.length === 0 && (
                        <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-sm">
                            Nenhum horário especial ou feriado cadastrado.
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Cadastro */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#111] rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                                <Plus className="w-5 h-5 text-cyan-700 dark:text-primary" /> 
                                {editingBlock ? "Editar Bloqueio" : "Novo Bloqueio de Agenda"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Data do Bloqueio</label>
                                    <input
                                        type="date"
                                        value={formDate} onChange={e => setFormDate(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Situação</label>
                                    <select
                                        value={formSituation} onChange={e => setFormSituation(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all appearance-none"
                                    >
                                        <option value="Feriado">Feriado Total</option>
                                        <option value="Atestado">Atestado / Licença</option>
                                        <option value="Horário Especial">Fechamento Parcial (Horário Especial)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Profissional Afetado</label>
                                <select
                                    value={formProfId} onChange={e => setFormProfId(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="all">Bloquear Agenda de TODOS (A loja inteira)</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>Apenas {emp.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Motivo (Opcional)</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Reforma na loja, Dor de Dente..."
                                    value={formReason} onChange={e => setFormReason(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#151516]">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Horário Abertura</label>
                                    <input
                                        type="time"
                                        disabled={formSituation !== "Horário Especial"}
                                        value={formOpenTime} onChange={e => setFormOpenTime(e.target.value)}
                                        className="w-full bg-white dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all disabled:opacity-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Horário Fechamento</label>
                                    <input
                                        type="time"
                                        disabled={formSituation !== "Horário Especial"}
                                        value={formCloseTime} onChange={e => setFormCloseTime(e.target.value)}
                                        className="w-full bg-white dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all disabled:opacity-50"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                            <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                Cancelar
                            </button>
                            <button 
                                onClick={handleSave} 
                                disabled={!formDate}
                                className="px-6 py-2 text-sm font-bold text-black bg-primary hover:bg-cyan-400 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                            >
                                {editingBlock ? "Atualizar Bloqueio" : "Salvar Bloqueio"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
