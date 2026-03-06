"use client";

import { useState } from "react";
import { Users, Search, Plus, Filter, Download, X } from "lucide-react";

const MOCK_CLIENTS = [
    { id: 101, name: "Marcelo Souza", phone: "(11) 98888-7777", totalSpent: "R$ 450,00", lastVisit: "Ontem", status: "VIP", statusColor: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400" },
    { id: 102, name: "Ana Beatriz", phone: "(11) 99999-5555", totalSpent: "R$ 1.200,00", lastVisit: "Semana passada", status: "Frequente", statusColor: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400" },
    { id: 103, name: "Lucas Fernandes", phone: "(11) 97777-3333", totalSpent: "R$ 90,00", lastVisit: "Há 2 meses", status: "Ausente", statusColor: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400" },
];

export default function ClientsPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Meus Clientes</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Gerencie a base de clientes, fidelidade e histórico de compras.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm text-sm border border-gray-200 dark:border-gray-700">
                        <Download className="w-4 h-4" /> Exportar
                    </button>
                    <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-primary text-black font-semibold px-4 py-2 rounded-lg hover:bg-cyan-400 transition-colors shadow-sm text-sm">
                        <Plus className="w-4 h-4" /> Novo Cliente
                    </button>
                </div>
            </div>

            {/* Stats Cards for Clients */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#111] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Clientes</h3>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">1.042</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#111] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-purple-500/10 rounded-full">
                        <Users className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Clientes VIPs</h3>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">84</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#111] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-orange-500/10 rounded-full">
                        <Users className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Clientes Ausentes (&gt;60 dias)</h3>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">312</p>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white dark:bg-[#111] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nome, telefone ou email..."
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-gray-900 dark:text-white placeholder-gray-400"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Filter className="w-4 h-4" /> Filtros Avançados
                </button>
            </div>

            {/* Clients Table */}
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400 border-collapse">
                        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Cliente</th>
                                <th className="px-6 py-4 font-semibold">Contato</th>
                                <th className="px-6 py-4 font-semibold">Valor Gasto</th>
                                <th className="px-6 py-4 font-semibold">Última Visita</th>
                                <th className="px-6 py-4 font-semibold">Fidelidade</th>
                                <th className="px-6 py-4 font-semibold text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_CLIENTS.map((client) => (
                                <tr key={client.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-white font-bold">
                                                {client.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-gray-900 dark:text-white">{client.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium">{client.phone}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{client.totalSpent}</td>
                                    <td className="px-6 py-4">{client.lastVisit}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${client.statusColor}`}>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-500 hover:text-gray-900 dark:hover:text-primary transition-colors hover:underline font-semibold text-xs uppercase tracking-wide">
                                            Histórico
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Novo Cliente */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}>
                    <div className="bg-white dark:bg-[#111] rounded-2xl w-full max-w-md p-6 overflow-hidden border border-gray-100 dark:border-gray-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Adicionar Cliente</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
                                <input type="text" className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none text-gray-900 dark:text-white" placeholder="Ex: João da Silva" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone / WhatsApp</label>
                                <input type="text" className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none text-gray-900 dark:text-white" placeholder="(00) 00000-0000" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail (opcional)</label>
                                <input type="email" className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none text-gray-900 dark:text-white" placeholder="email@exemplo.com" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <button onClick={() => setIsAddModalOpen(false)} className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-200 dark:border-gray-700">Cancelar</button>
                            <button onClick={() => setIsAddModalOpen(false)} className="px-5 py-2 text-sm font-bold bg-primary text-black rounded-lg hover:bg-cyan-400 transition-colors shadow-sm">Salvar Cliente</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
