"use client";

import { useState } from "react";
import { UserSquare2, Filter, Search, Plus, X } from "lucide-react";

const MOCK_LEADS = [
    { id: 1, name: "Marcelo Souza", service: "Corte + Barba", date: "Há 2 horas", status: "Agendou", statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" },
    { id: 2, name: "Ana Beatriz", service: "Luzes", date: "Há 4 horas", status: "Em Contato", statusColor: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400" },
    { id: 3, name: "Lucas Fernandes", service: "Corte Degradê", date: "Há 1 dia", status: "Perdido", statusColor: "bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-400" },
    { id: 4, name: "Roberto Silva", service: "Barba", date: "Há 1 dia", status: "Agendou", statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" },
];

export default function LeadsPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gerenciamento de Leads</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pessoas que demonstraram interesse ou iniciaram contato.</p>
                </div>
                <div className="flex gap-2 mt-4 sm:mt-0">
                    <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-primary text-black font-semibold px-4 py-2 rounded-lg hover:bg-cyan-400 transition-colors shadow-sm text-sm">
                        <Plus className="w-4 h-4" /> Novo Lead
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white dark:bg-[#111] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar lead pelo nome..."
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-gray-900 dark:text-white placeholder-gray-400"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Filter className="w-4 h-4" /> Filtrar Status
                </button>
            </div>

            {/* List Area */}
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400 border-collapse">
                        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Nome do Lead</th>
                                <th className="px-6 py-4 font-semibold">Interesse</th>
                                <th className="px-6 py-4 font-semibold">Quando</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_LEADS.map((lead) => (
                                <tr key={lead.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                {lead.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-gray-900 dark:text-white">{lead.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium">{lead.service}</td>
                                    <td className="px-6 py-4">{lead.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${lead.statusColor}`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-500 hover:text-gray-900 dark:hover:text-primary transition-colors hover:underline font-semibold text-xs uppercase tracking-wide">
                                            Ver Ficha
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Novo Lead */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}>
                    <div className="bg-white dark:bg-[#111] rounded-2xl w-full max-w-md p-6 overflow-hidden border border-gray-100 dark:border-gray-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Registrar Novo Lead</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Lead</label>
                                <input type="text" className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none text-gray-900 dark:text-white" placeholder="Nome do potencial cliente" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contato (WhatsApp/Telefone)</label>
                                <input type="text" className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none text-gray-900 dark:text-white" placeholder="(00) 00000-0000" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Serviço de Interesse</label>
                                <select className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none text-gray-900 dark:text-white">
                                    <option>Corte de Cabelo</option>
                                    <option>Barba</option>
                                    <option>Outro</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <button onClick={() => setIsAddModalOpen(false)} className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-200 dark:border-gray-700">Cancelar</button>
                            <button onClick={() => setIsAddModalOpen(false)} className="px-5 py-2 text-sm font-bold bg-primary text-black rounded-lg hover:bg-cyan-400 transition-colors shadow-sm">Salvar Lead</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
