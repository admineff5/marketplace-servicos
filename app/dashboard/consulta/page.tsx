"use client";

import { useState } from "react";
import { Search, Download, FilterX, CalendarIcon, ChevronLeft, ChevronRight, User, Hash , SearchCheck} from "lucide-react";

// Mock Data local for demonstration
const MOCK_RESULTS = [
    { id: "AGD-1029", client: "João Silva", prof: "Rodrigo", service: "Corte Degradê", cat: "Barbearia", date: "07/03/2026", time: "10:00", value: "R$ 45,00", status: "Confirmado" },
    { id: "AGD-1030", client: "Lucas Almeida", prof: "Thiago", service: "Corte + Barba", cat: "Barbearia", date: "07/03/2026", time: "14:30", value: "R$ 70,00", status: "Pendente" },
    { id: "AGD-1031", client: "Marcos Oliveira", prof: "Rodrigo", service: "Barba Terapia", cat: "Barbearia", date: "08/03/2026", time: "09:00", value: "R$ 35,00", status: "Cancelado" },
    { id: "AGD-1032", client: "Thiago Mendes", prof: "Thiago", service: "Corte Clássico", cat: "Barbearia", date: "10/03/2026", time: "16:00", value: "R$ 40,00", status: "Confirmado" },
    { id: "AGD-1033", client: "Pedro Henrique", prof: "Rodrigo", service: "Corte Infantil", cat: "Barbearia", date: "11/03/2026", time: "10:30", value: "R$ 35,00", status: "Confirmado" },
];

export default function ConsultaAgendamentos() {
    const [dateStart, setDateStart] = useState("2026-03-07");
    const [dateEnd, setDateEnd] = useState("2026-03-17");
    const [clientName, setClientName] = useState("");
    const [category, setCategory] = useState("");
    const [service, setService] = useState("");
    const [prof, setProf] = useState("");
    const [status, setStatus] = useState("");

    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSearching(true);
        setTimeout(() => setIsSearching(false), 600);
    };

    const handleClear = () => {
        setDateStart("");
        setDateEnd("");
        setClientName("");
        setCategory("");
        setService("");
        setProf("");
        setStatus("");
    };

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <SearchCheck className="w-6 h-6 text-cyan-700 dark:text-primary" />
                        Consulta de Agendamentos
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Busque, filtre e exporte os horários da sua empresa.</p>
                </div>
            </div>

            {/* Painel de Filtros (Similar à Imagem 1, mas refeito fidedigno ao design system) */}
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 sm:p-6 shadow-sm">
                <form onSubmit={handleSearch} className="flex flex-col gap-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                        {/* Coluna 1 */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Período de Data</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="date"
                                        value={dateStart}
                                        onChange={e => setDateStart(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                    />
                                    <span className="text-gray-400 text-sm">até</span>
                                    <input
                                        type="date"
                                        value={dateEnd}
                                        onChange={e => setDateEnd(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Cliente (Nome)</label>
                                <input
                                    type="text"
                                    placeholder="Ex: João Silva"
                                    value={clientName}
                                    onChange={e => setClientName(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Coluna 2 */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Categoria</label>
                                <select
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">-- Selecione --</option>
                                    <option value="Barbearia">Barbearia</option>
                                    <option value="Estética">Estética</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Serviço</label>
                                <select
                                    value={service}
                                    onChange={e => setService(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">-- Selecione --</option>
                                    <option value="Corte Degradê">Corte Degradê</option>
                                    <option value="Barba">Barba</option>
                                    <option value="Combo">Combo</option>
                                </select>
                            </div>
                        </div>

                        {/* Coluna 3 */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Profissional</label>
                                <select
                                    value={prof}
                                    onChange={e => setProf(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">-- Selecione --</option>
                                    <option value="Rodrigo">Rodrigo</option>
                                    <option value="Thiago">Thiago</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Status</label>
                                <select
                                    value={status}
                                    onChange={e => setStatus(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">-- Selecione --</option>
                                    <option value="Confirmado">Confirmado</option>
                                    <option value="Pendente">Pendente</option>
                                    <option value="Cancelado">Cancelado</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <label className="flex items-center gap-2 mr-auto cursor-pointer group">
                            <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 text-cyan-700 dark:text-primary focus:ring-primary bg-transparent w-4 h-4 cursor-pointer accent-primary" />
                            <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">Somente agendamentos recorrentes</span>
                        </label>

                        <button type="button" onClick={handleClear} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors border border-transparent dark:border-gray-700">
                            <FilterX className="w-4 h-4" /> Limpar
                        </button>
                        <button type="button" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1a1a1c] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-200 dark:border-[#2a2a2c]">
                            <Download className="w-4 h-4" /> Exportar Planilha
                        </button>
                        <button type="submit" className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-black bg-primary hover:bg-cyan-400 rounded-lg shadow-sm transition-colors">
                            <Search className="w-4 h-4" /> Pesquisar
                        </button>
                    </div>

                </form>
            </div>

            {/* Resultado da Tabela */}
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-sm">

                {isSearching ? (
                    <div className="h-40 sm:h-64 flex items-center justify-center text-cyan-700 dark:text-primary">
                        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="block w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-200 dark:border-gray-800">
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Código</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Data / Hora</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Cliente</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Profissional</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Serviço</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap text-right">Valor</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                                {MOCK_RESULTS.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors group cursor-default">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-1.5 text-xs font-mono text-gray-500 dark:text-gray-400">
                                                <Hash className="w-3 h-3" /> {row.id}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="text-sm font-semibold text-gray-900 dark:text-zinc-100">{row.date}</div>
                                            <div className="text-xs text-gray-500">{row.time}</div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                                                    <User className="w-3 h-3 text-gray-500" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{row.client}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                                            {row.prof}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{row.service}</div>
                                            <div className="text-xs text-gray-500">{row.cat}</div>
                                        </td>
                                        <td className="py-3 px-4 text-sm font-bold text-gray-700 dark:text-gray-200 text-right">
                                            {row.value}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase 
                                                ${row.status === 'Confirmado' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' :
                                                    row.status === 'Pendente' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400' :
                                                        'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}
                                            >
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination Mock Footer */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800 text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Exibindo 1 a 5 de 156 resultados</span>
                            <div className="flex items-center gap-2">
                                <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 cursor-not-allowed" disabled><ChevronLeft className="w-5 h-5" /></button>
                                <button className="w-8 h-8 rounded bg-primary text-black font-bold flex items-center justify-center">1</button>
                                <button className="w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium flex items-center justify-center transition-colors">2</button>
                                <button className="w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium flex items-center justify-center transition-colors">3</button>
                                <span className="text-gray-400 mx-1">...</span>
                                <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"><ChevronRight className="w-5 h-5" /></button>
                            </div>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}
