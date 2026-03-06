"use client";

import { useState } from "react";
import { Scissors, Plus, Search, X } from "lucide-react";

const MOCK_SERVICES = [
    { id: 1, name: "Corte Clássico", duration: "45 min", price: "R$ 45,00", category: "Cabelo", status: "Ativo" },
    { id: 2, name: "Corte Degradê", duration: "45 min", price: "R$ 55,00", category: "Cabelo", status: "Ativo" },
    { id: 3, name: "Barba Terapia", duration: "30 min", price: "R$ 35,00", category: "Barba", status: "Ativo" },
    { id: 4, name: "Coloração", duration: "1h 30m", price: "R$ 120,00", category: "Química", status: "Inativo" },
    { id: 5, name: "Corte + Barba", duration: "1h 10m", price: "R$ 80,00", category: "Combo", status: "Ativo" },
];

export default function ServicesPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Catálogo de Serviços</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Configure os serviços que ficarão visíveis no aplicativo para seus clientes.</p>
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-primary text-black font-semibold px-4 py-2 rounded-lg hover:bg-cyan-400 transition-colors shadow-sm text-sm">
                    <Plus className="w-4 h-4" /> Novo Serviço
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white dark:bg-[#111] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar serviço..."
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-gray-900 dark:text-white placeholder-gray-400"
                    />
                </div>
                <select className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors">
                    <option>Todas as Categorias</option>
                    <option>Cabelo</option>
                    <option>Barba</option>
                    <option>Combo</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_SERVICES.map((service) => (
                    <div key={service.id} className="bg-white dark:bg-[#111] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col hover:border-primary/50 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-gray-100 dark:bg-gray-800 group-hover:bg-primary/10 transition-colors rounded-xl">
                                <Scissors className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors" />
                            </div>
                            <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${service.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                                {service.status}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{service.name}</h3>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">{service.category}</p>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500">Duração</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{service.duration}</span>
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-xs text-gray-500">Valor</span>
                                <span className="text-base font-bold text-gray-900 dark:text-white">{service.price}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Novo Serviço */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}>
                    <div className="bg-white dark:bg-[#111] rounded-2xl w-full max-w-md p-6 overflow-hidden border border-gray-100 dark:border-gray-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Adicionar Serviço</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Serviço</label>
                                <input type="text" className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none text-gray-900 dark:text-white" placeholder="Ex: Corte Degradê" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duração Estimada</label>
                                    <select className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none text-gray-900 dark:text-white">
                                        <option>30 min</option>
                                        <option>45 min</option>
                                        <option>1h</option>
                                        <option>1h 30m</option>
                                        <option>2h</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preço (R$)</label>
                                    <input type="text" className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none text-gray-900 dark:text-white" placeholder="0,00" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoria</label>
                                <select className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none text-gray-900 dark:text-white">
                                    <option>Cabelo</option>
                                    <option>Barba</option>
                                    <option>Combo</option>
                                    <option>Estética</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <button onClick={() => setIsAddModalOpen(false)} className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-200 dark:border-gray-700">Cancelar</button>
                            <button onClick={() => setIsAddModalOpen(false)} className="px-5 py-2 text-sm font-bold bg-primary text-black rounded-lg hover:bg-cyan-400 transition-colors shadow-sm">Salvar Serviço</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
