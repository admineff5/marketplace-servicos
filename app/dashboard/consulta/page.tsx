"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Download, User, Hash, SearchCheck, Filter, X } from "lucide-react";

export default function ConsultaAgendamentos() {
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filter States
    const [dateStart, setDateStart] = useState("");
    const [dateEnd, setDateEnd] = useState("");
    const [clientName, setClientName] = useState("");
    const [category, setCategory] = useState("");
    const [service, setService] = useState("");
    const [prof, setProf] = useState("");
    const [status, setStatus] = useState("");

    // Filter Modal State
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    // Search Trigger
    const [isSearching, setIsSearching] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState({
        dateStart: "",
        dateEnd: "",
        clientName: "",
        category: "",
        service: "",
        prof: "",
        status: "",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsSearching(true);
            const query = new URLSearchParams();
            if (dateStart) query.append("date", dateStart);
            
            const res = await fetch(`/api/appointments?${query.toString()}`);
            const data = await res.json();
            setResults(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erro ao buscar agendamentos:", error);
        } finally {
            setIsSearching(false);
            setIsLoading(false);
        }
    };

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setAppliedFilters({ dateStart, dateEnd, clientName, category, service, prof, status });
        fetchData();
        setIsFilterModalOpen(false);
    };

    const handleClear = () => {
        setDateStart("");
        setDateEnd("");
        setClientName("");
        setCategory("");
        setService("");
        setProf("");
        setStatus("");
        setAppliedFilters({ dateStart: "", dateEnd: "", clientName: "", category: "", service: "", prof: "", status: "" });
        fetchData();
    };

    const filteredResults = useMemo(() => {
        return results.filter(item => {
            const matchesClient = !appliedFilters.clientName || item.client.toLowerCase().includes(appliedFilters.clientName.toLowerCase());
            const matchesProf = !appliedFilters.prof || item.prof === appliedFilters.prof;
            const matchesStatus = !appliedFilters.status || 
                (appliedFilters.status === "CANCELLED_LOJA" ? (item.status === "CANCELLED" && item.comment) :
                 appliedFilters.status === "CANCELLED_CLIENTE" ? (item.status === "CANCELLED" && !item.comment) :
                 item.status === appliedFilters.status);
            const matchesTitle = !appliedFilters.service || item.title.toLowerCase().includes(appliedFilters.service.toLowerCase());

            // Filtro de data range no frontend se necessário (API atual filtra por dia)
            const itemDate = item.date.split('T')[0];
            const startLimit = appliedFilters.dateStart || "0000-00-00";
            const endLimit = appliedFilters.dateEnd || "9999-99-99";
            const matchesDate = itemDate >= startLimit && itemDate <= endLimit;

            return matchesClient && matchesProf && matchesStatus && matchesTitle && matchesDate;
        });
    }, [results, appliedFilters]);

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

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                        onClick={() => setIsFilterModalOpen(true)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 hover:border-cyan-600/50 dark:hover:border-cyan-600 dark:hover:border-primary/50 transition-all shadow-sm"
                    >
                        <Filter className="w-4 h-4" />
                        Filtrar
                    </button>
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl shadow-lg shadow-cyan-500/10 transition-all bg-cyan-700 hover:bg-cyan-800 text-white dark:bg-primary dark:hover:bg-cyan-400 dark:text-black">
                        <Download className="w-4 h-4" />
                        Exportar
                    </button>
                </div>
            </div>

            {/* Resultado da Tabela */}
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-sm">
                {isSearching ? (
                    <div className="h-64 flex flex-col items-center justify-center gap-4">
                        <div className="w-10 h-10 border-4 border-cyan-600/30 dark:border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    </div>
                ) : filteredResults.length > 0 ? (
                    <div className="block w-full overflow-x-auto text-nowrap">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-200 dark:border-gray-800">
                                    <th className="py-4 px-6 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Código</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data / Hora</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cliente</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Profissional</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Serviço</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Valor</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                                {filteredResults.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400">
                                                <Hash className="w-3 h-3" /> {row.id}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm font-bold text-gray-900 dark:text-zinc-100">{new Date(row.date).toLocaleDateString('pt-BR')}</div>
                                            <div className="text-xs text-gray-500">{row.time}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                                                    <User className="w-4 h-4 text-gray-500" />
                                                </div>
                                                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{row.client}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-300">{row.prof}</td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm font-bold text-gray-800 dark:text-gray-200">{row.title}</div>
                                            <div className="text-[10px] font-bold text-cyan-700 dark:text-primary uppercase">Serviço</div>
                                        </td>
                                        <td className="py-4 px-6 text-sm font-black text-gray-900 dark:text-gray-100 text-right">
                                            R$ {Number(row.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase 
                                                ${row.status === 'CONFIRMED' || row.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                                                    row.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
                                                        'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}
                                            >
                                                {row.status === 'CONFIRMED' ? 'Confirmado' : 
                                                 row.status === 'PENDING' ? 'Pendente' : 
                                                 row.status === 'CANCELLED' ? 'Cancelado' : 
                                                 row.status === 'COMPLETED' ? 'Concluído' : row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-20">
                        <Search className="w-16 h-16 text-gray-200 dark:text-gray-800 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Nenhum agendamento encontrado</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Tente ajustar os filtros da busca.</p>
                    </div>
                )}
            </div>

            {/* FILTER MODAL */}
            {isFilterModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsFilterModalOpen(false)}>
                    <div
                        className="w-full max-w-2xl bg-white dark:bg-[#111] rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#161618]">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Filter className="w-5 h-5 text-cyan-700 dark:text-primary" />
                                Filtros de Busca
                            </h2>
                            <button onClick={() => setIsFilterModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-xl transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1 md:col-span-2 space-y-3">
                                <label className="text-[10px] font-black uppercase text-gray-500">Período</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="date" value={dateStart} onChange={e => setDateStart(e.target.value)} className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-cyan-600 dark:focus:ring-primary outline-none" />
                                    <input type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)} className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-cyan-600 dark:focus:ring-primary outline-none" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500">Cliente</label>
                                <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Pesquisar cliente..." className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-cyan-600 dark:focus:ring-primary outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500">Profissional</label>
                                <select value={prof} onChange={e => setProf(e.target.value)} className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-cyan-600 dark:focus:ring-primary outline-none">
                                    <option value="">Todos</option>
                                    <option value="Rodrigo">Rodrigo</option>
                                    <option value="Thiago">Thiago</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500">Status</label>
                                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-cyan-600 dark:focus:ring-primary outline-none">
                                    <option value="">Todos</option>
                                    <option value="CONFIRMED">Confirmado</option>
                                    <option value="PENDING">Pendente</option>
                                    <option value="CANCELLED_LOJA">Cancelado pela Loja</option>
                                    <option value="CANCELLED_CLIENTE">Cancelado pelo Cliente</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <button onClick={handleClear} className="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors">Limpar Filtros</button>
                            <button onClick={() => handleSearch()} className="px-8 py-3 text-sm font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all bg-cyan-700 hover:bg-cyan-800 text-white dark:bg-primary dark:hover:bg-cyan-400 dark:text-black">
                                Pesquisar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
