"use client";

import { useState } from "react";
import { Search, Plus, Users, MessageCircle, Clock, Star, X, Check, ShieldAlert, History } from "lucide-react";

// Mock Data para Simular Base de Clientes Reais
const MOCK_CLIENTES = [
    { id: 1, name: "Marcelo Alves", phone: "11999999999", visits: 14, lastVisit: "Ontem", status: "VIP" },
    { id: 2, name: "João Pereira", phone: "11988888888", visits: 5, lastVisit: "2 semanas atrás", status: "Frequente" },
    { id: 3, name: "Carlos Eduardo", phone: "11977777777", visits: 1, lastVisit: "Hoje", status: "Novo" },
    { id: 4, name: "Felipe Nunes", phone: "11966666666", visits: 8, lastVisit: "1 mês atrás", status: "Frequente" },
    { id: 5, name: "Rodrigo Silva", phone: "11955555555", visits: 22, lastVisit: "3 dias atrás", status: "VIP" },
    { id: 6, name: "Lucas Almeida", phone: "11944444444", visits: 0, lastVisit: "Nunca (Agendado)", status: "Novo" },
];

export default function GestaoClientesPage() {
    const [clientes, setClientes] = useState(MOCK_CLIENTES);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Estado para o histórico modal (MVP)
    const [selectedClient, setSelectedClient] = useState<any>(null);

    // Form State
    const [formName, setFormName] = useState("");
    const [formPhone, setFormPhone] = useState("");

    const filteredClientes = clientes.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );

    const resetForm = () => {
        setFormName("");
        setFormPhone("");
    };

    const handleSave = () => {
        if (!formName || !formPhone) return;

        setClientes([{
            id: Date.now(),
            name: formName,
            phone: formPhone,
            visits: 0,
            lastVisit: "Hoje",
            status: "Novo"
        }, ...clientes]);

        setIsModalOpen(false);
        resetForm();
    };

    const handleOpenHistory = (client: any) => {
        setSelectedClient(client);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-8 bg-gray-50/50 dark:bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                            <Users className="w-6 h-6 text-cyan-700 dark:text-primary" />
                            Gestão de Clientes
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Visualize quem frequenta sua loja, acompanhe o histórico e recompense os mais engajados.
                        </p>
                    </div>

                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-black shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all hover:scale-105"
                    >
                        <Plus className="w-4 h-4" />
                        Adicionar Cliente
                    </button>
                </div>

                {/* Filter / Search Bar */}
                <div className="bg-white dark:bg-[#111112] rounded-2xl border border-gray-200 dark:border-[#222] p-4">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou celular..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                        />
                    </div>
                </div>

                {/* Clients Table */}
                <div className="bg-white dark:bg-[#111112] rounded-2xl border border-gray-200 dark:border-[#222] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50/80 dark:bg-[#161618] border-b border-gray-200 dark:border-[#222]">
                                    <th className="py-4 px-6 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Cliente</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Contato (WhatsApp)</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Última Visita</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Total Visitas</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-right">Ações Rápidas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-[#222]">
                                {filteredClientes.length > 0 ? filteredClientes.map((cliente) => (
                                    <tr key={cliente.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1c] transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                                                    {cliente.name.charAt(0)}
                                                </div>
                                                <span className="font-semibold text-gray-900 dark:text-white">{cliente.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <button className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors">
                                                <MessageCircle className="w-4 h-4" />
                                                {cliente.phone}
                                            </button>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                <Clock className="w-4 h-4" />
                                                {cliente.lastVisit}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{cliente.visits} {cliente.visits === 1 ? 'visita' : 'visitas'}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            {cliente.status === "VIP" && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500 text-xs font-bold">
                                                    <Star className="w-3.5 h-3.5 fill-current" /> VIP
                                                </span>
                                            )}
                                            {cliente.status === "Frequente" && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-bold">
                                                    Frequente
                                                </span>
                                            )}
                                            {cliente.status === "Novo" && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-bold">
                                                    Novo Cliente
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleOpenHistory(cliente)}
                                                    className="p-2 text-gray-500 hover:text-cyan-700 dark:hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                    title="Ver Histórico"
                                                >
                                                    <History className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Bloquear Cliente">
                                                    <ShieldAlert className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-gray-500 dark:text-gray-400">
                                            Nenhum cliente encontrado com esse filtro.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* CREATE MANUAL CLIENT MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm sm:items-center items-end" onClick={() => setIsModalOpen(false)}>
                    <div
                        className="w-full max-w-md bg-white dark:bg-[#111112] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-[#222]"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#222] bg-gray-50/50 dark:bg-[#161618]">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Plus className="w-5 h-5 text-cyan-700 dark:text-primary" />
                                Adicionar Cliente
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="bg-primary/10 dark:bg-cyan-900/10 border border-primary/20 p-4 rounded-xl flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                                <Users className="w-5 h-5 text-cyan-700 dark:text-primary shrink-0 mt-0.5" />
                                <p>Os clientes que agendarem pelo seu link público aparecerão aqui <strong>automaticamente</strong>. Use este painel apenas para inserir clientes de balcão ou antigos.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                                    Nome Completo *
                                </label>
                                <input
                                    type="text"
                                    value={formName} onChange={e => setFormName(e.target.value)}
                                    placeholder="Ex: Roberto Carlos"
                                    className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                                    Celular (WhatsApp) *
                                </label>
                                <input
                                    type="text"
                                    value={formPhone} onChange={e => setFormPhone(e.target.value)}
                                    placeholder="(11) 99999-9999"
                                    className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 dark:border-[#222] bg-gray-50/50 dark:bg-[#161618] flex items-center justify-end gap-3 rounded-b-3xl">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#222] rounded-xl transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!formName || !formPhone}
                                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-black text-sm font-bold rounded-xl shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Check className="w-4 h-4" />
                                Salvar Cadastro
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* HISTORY MODAL (Miniatura) */}
            {selectedClient && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm sm:items-center items-end" onClick={() => setSelectedClient(null)}>
                    <div
                        className="w-full max-w-lg bg-white dark:bg-[#111112] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-[#222]"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#222] bg-gray-50/50 dark:bg-[#161618]">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-cyan-700 dark:text-primary text-xl">
                                    {selectedClient.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{selectedClient.name}</h2>
                                    <p className="text-sm text-gray-500">{selectedClient.phone}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedClient(null)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <History className="w-4 h-4 text-cyan-700 dark:text-primary" />
                                Últimos Agendamentos (MOCK)
                            </h3>

                            <div className="space-y-3">
                                {[1, 2, 3].map((_, idx) => (
                                    <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-[#222] bg-gray-50/50 dark:bg-[#1a1a1c] flex justify-between items-center transition-colors hover:border-primary/30">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">Corte e Barba</p>
                                            <p className="text-xs text-gray-500">com Rodrigo Silva</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-cyan-700 dark:text-primary">R$ 75,00</p>
                                            <p className="text-xs text-gray-500">{selectedClient.lastVisit === 'Ontem' ? '12/10/2026' : 'Em breve'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 dark:border-[#222] bg-gray-50/50 dark:bg-[#161618] flex items-center justify-end rounded-b-3xl">
                            <button
                                onClick={() => setSelectedClient(null)}
                                className="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#222] rounded-xl transition-colors"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
