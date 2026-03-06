"use client";

import { useState } from "react";
import { Package, Plus, Search, X } from "lucide-react";

const MOCK_PRODUCTS = [
    { id: 1, name: "Pomada Modeladora Efeito Matte", stock: 15, price: "R$ 45,00", category: "Cabelo", status: "Em Estoque" },
    { id: 2, name: "Óleo Hidratante para Barba", stock: 3, price: "R$ 35,00", category: "Barba", status: "Baixo" },
    { id: 3, name: "Shampoo Anticaspa 300ml", stock: 0, price: "R$ 60,00", category: "Tratamento", status: "Esgotado" },
    { id: 4, name: "Minoxidil Kirkland 5%", stock: 8, price: "R$ 80,00", category: "Tratamento", status: "Em Estoque" },
];

export default function ProductsPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Estoque de Produtos</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Controle seu almoxarifado e itens disponíveis para vitrine e venda direta.</p>
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-primary text-black font-semibold px-4 py-2 rounded-lg hover:bg-cyan-400 transition-colors shadow-sm text-sm">
                    <Plus className="w-4 h-4" /> Novo Produto
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white dark:bg-[#111] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por código ou nome..."
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-gray-900 dark:text-white placeholder-gray-400"
                    />
                </div>
                <select className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors">
                    <option>Todas as Categorias</option>
                    <option>Cabelo</option>
                    <option>Barba</option>
                    <option>Tratamento</option>
                </select>
            </div>

            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400 border-collapse">
                        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Produto</th>
                                <th className="px-6 py-4 font-semibold">Categoria</th>
                                <th className="px-6 py-4 font-semibold">Preço</th>
                                <th className="px-6 py-4 font-semibold">Estoque</th>
                                <th className="px-6 py-4 font-semibold text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_PRODUCTS.map((prod) => (
                                <tr key={prod.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                                                <Package className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold text-gray-900 dark:text-white">{prod.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium">{prod.category}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{prod.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${prod.status === 'Esgotado' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : prod.status === 'Baixo' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'}`}>
                                            {prod.stock} un. • {prod.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-500 hover:text-gray-900 dark:hover:text-primary transition-colors hover:underline font-semibold text-xs uppercase tracking-wide">
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Novo Produto */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}>
                    <div className="bg-white dark:bg-[#111] rounded-2xl w-full max-w-md p-6 overflow-hidden border border-gray-100 dark:border-gray-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Adicionar Produto</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Produto</label>
                                <input type="text" className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none text-gray-900 dark:text-white" placeholder="Ex: Shampoo Anticaspa" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preço (R$)</label>
                                    <input type="text" className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none text-gray-900 dark:text-white" placeholder="0,00" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Qtd em Estoque</label>
                                    <input type="number" className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none text-gray-900 dark:text-white" placeholder="0" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoria</label>
                                <select className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none text-gray-900 dark:text-white">
                                    <option>Selecionar Categoria...</option>
                                    <option>Cabelo</option>
                                    <option>Barba</option>
                                    <option>Tratamento</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <button onClick={() => setIsAddModalOpen(false)} className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-200 dark:border-gray-700">Cancelar</button>
                            <button onClick={() => setIsAddModalOpen(false)} className="px-5 py-2 text-sm font-bold bg-primary text-black rounded-lg hover:bg-cyan-400 transition-colors shadow-sm">Salvar Produto</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
