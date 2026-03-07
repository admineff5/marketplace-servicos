"use client";

import { useState } from "react";
import { Search, Plus, Package, Edit2, Trash2, X, Check, Upload, AlertTriangle, TrendingUp, Image as ImageIcon } from "lucide-react";

// Mock Data para Simular Produtos
const MOCK_PRODUTOS = [
    { id: 1, name: "Minoxidil Kirkland 5% (Loção)", price: 89.90, stock: 2, image: "https://images.unsplash.com/photo-1611078513926-538466b0dcda?w=300&auto=format&fit=crop&q=80" },
    { id: 2, name: "Pomada Modeladora Efeito Matte", price: 45.00, stock: 15, image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=300&auto=format&fit=crop&q=80" },
    { id: 3, name: "Navalha Clássica Master de Aço", price: 119.90, stock: 8, image: "https://images.unsplash.com/photo-1593510987185-1ec2256148a3?w=300&auto=format&fit=crop&q=80" },
    { id: 4, name: "Óleo Hidratante Premium para Barba", price: 35.00, stock: 4, image: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=300&auto=format&fit=crop&q=80" },
    { id: 5, name: "Shampoo Anticaspa Force", price: 29.90, stock: 12, image: "https://images.unsplash.com/photo-1585232351009-aa87416fca90?w=300&auto=format&fit=crop&q=80" },
    { id: 6, name: "Gel Pós Barba Refrescante", price: 42.00, stock: 0, image: "https://images.unsplash.com/photo-1626285861696-9f0bf5a49ceb?w=300&auto=format&fit=crop&q=80" },
];

export default function GestaoProdutosPage() {
    const [produtos, setProdutos] = useState(MOCK_PRODUTOS);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formName, setFormName] = useState("");
    const [formPrice, setFormPrice] = useState("");
    const [formStock, setFormStock] = useState("");
    const [formImage, setFormImage] = useState("");

    const filteredProdutos = produtos.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const resetForm = () => {
        setFormName("");
        setFormPrice("");
        setFormStock("");
        setFormImage("");
    };

    const handleSave = () => {
        if (!formName || !formPrice || !formStock) return;

        setProdutos([{
            id: Date.now(),
            name: formName,
            price: parseFloat(formPrice),
            stock: parseInt(formStock, 10),
            image: formImage || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80" // Generic Fallback
        }, ...produtos]);

        setIsModalOpen(false);
        resetForm();
    };

    const totalEmEstoque = produtos.reduce((acc, curr) => acc + curr.stock, 0);
    const valorTotalEstoque = produtos.reduce((acc, curr) => acc + (curr.price * curr.stock), 0);
    const produtosAlerta = produtos.filter(p => p.stock < 5).length;

    return (
        <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-8 bg-gray-50/50 dark:bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                            <Package className="w-6 h-6 text-cyan-700 dark:text-primary" />
                            Gestão de Produtos
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Controle seu inventário físico e receba alertas de reposição antes das prateleiras esvaziarem.
                        </p>
                    </div>

                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-black shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all hover:scale-105"
                    >
                        <Plus className="w-4 h-4" />
                        Adicionar Produto
                    </button>
                </div>

                {/* Dashboard Mini-Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-[#111112] p-5 rounded-2xl border border-gray-200 dark:border-[#222]">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total em Estoque</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalEmEstoque} <span className="text-sm font-normal text-gray-500">unid.</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#111112] p-5 rounded-2xl border border-gray-200 dark:border-[#222]">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Valor Imobilizado</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    R$ {valorTotalEstoque.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#111112] p-5 rounded-2xl border border-red-200 dark:border-red-900/30 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-50 dark:bg-red-900/10 rounded-full blur-2xl pointer-events-none"></div>
                        <div className="flex items-center gap-3 mb-2 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 animate-pulse" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-red-600 dark:text-red-400">Produtos em Alerta</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{produtosAlerta} <span className="text-sm font-normal text-gray-500">acabando</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="bg-white dark:bg-[#111112] rounded-2xl border border-gray-200 dark:border-[#222] p-4 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome do produto..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                        />
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProdutos.length > 0 ? filteredProdutos.map((produto) => (
                        <div key={produto.id} className="bg-white dark:bg-[#111112] border border-gray-200 dark:border-[#222] rounded-2xl shadow-sm hover:shadow-lg transition-all group overflow-hidden flex flex-col">

                            {/* Image Header */}
                            <div className="relative h-48 bg-gray-100 dark:bg-[#1a1a1c] overflow-hidden">
                                <img src={produto.image} alt={produto.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                                {/* Stock Badges */}
                                <div className="absolute top-3 left-3 flex flex-col gap-2">
                                    {produto.stock === 0 ? (
                                        <span className="px-2.5 py-1 rounded-md bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold shadow-sm flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" /> Esgotado
                                        </span>
                                    ) : produto.stock < 5 ? (
                                        <span className="px-2.5 py-1 rounded-md bg-yellow-500/90 backdrop-blur-sm text-white text-xs font-bold shadow-sm flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" /> Restam {produto.stock}
                                        </span>
                                    ) : (
                                        <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-xs font-bold shadow-sm">
                                            Em Estoque: {produto.stock}
                                        </span>
                                    )}
                                </div>

                                {/* Hover Actions */}
                                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 bg-white/90 dark:bg-black/70 backdrop-blur-sm text-gray-600 dark:text-gray-300 hover:text-cyan-700 dark:hover:text-primary rounded-lg shadow-sm transition-colors" title="Editar">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 bg-white/90 dark:bg-black/70 backdrop-blur-sm text-gray-600 dark:text-gray-300 hover:text-red-500 rounded-lg shadow-sm transition-colors" title="Excluir">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Data Content */}
                            <div className="p-4 flex flex-col flex-1">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{produto.name}</h3>
                                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-[#222]">
                                    <p className="text-lg font-black text-cyan-700 dark:text-primary">R$ {produto.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Vendendo</p>
                                </div>
                            </div>

                        </div>
                    )) : (
                        <div className="col-span-full py-16 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-[#111112] rounded-2xl border border-dashed border-gray-300 dark:border-[#333]">
                            <div className="flex flex-col items-center justify-center gap-3">
                                <Package className="w-12 h-12 opacity-20" />
                                <p className="text-lg">Nenhum produto cadastrado no inventário.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* CREATE PRODUCT MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm sm:items-center items-end" onClick={() => setIsModalOpen(false)}>
                    <div
                        className="w-full max-w-md bg-white dark:bg-[#111112] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-[#222]"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#222] bg-gray-50/50 dark:bg-[#161618]">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Package className="w-5 h-5 text-cyan-700 dark:text-primary" />
                                Novo Produto
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">

                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#111] overflow-hidden flex items-center justify-center shrink-0 shadow-sm relative group cursor-pointer">
                                    {formImage ? (
                                        <img src={formImage} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-cyan-700 dark:hover:text-primary transition-colors" />
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Upload className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Foto do Produto</h3>
                                    <p className="text-xs text-gray-500">Cole uma URL de imagem ou pesquise no Google Imagens.</p>
                                    <div className="flex gap-2">
                                        <input
                                            type="url"
                                            value={formImage}
                                            onChange={e => setFormImage(e.target.value)}
                                            placeholder="https://..."
                                            className="flex-1 bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none text-gray-900 dark:text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(formName ? formName + ' foto produto' : 'produto barbearia')}`, '_blank')}
                                            className="shrink-0 bg-gray-100 hover:bg-gray-200 dark:bg-[#222] dark:hover:bg-[#333] px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors border border-gray-200 dark:border-[#2a2a2c]"
                                        >
                                            Pesquisar WEB
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                                    Nome do Produto *
                                </label>
                                <input
                                    type="text"
                                    value={formName} onChange={e => setFormName(e.target.value)}
                                    placeholder="Ex: Minoxidil Kirkland 5%"
                                    className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                                        Preço de Venda (R$) *
                                    </label>
                                    <input
                                        type="number" step="0.01"
                                        value={formPrice} onChange={e => setFormPrice(e.target.value)}
                                        placeholder="89.90"
                                        className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                                        Qtd. Inicial *
                                    </label>
                                    <input
                                        type="number"
                                        value={formStock} onChange={e => setFormStock(e.target.value)}
                                        placeholder="10"
                                        className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                    />
                                </div>
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
                                disabled={!formName || !formPrice || !formStock}
                                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-black text-sm font-bold rounded-xl shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Check className="w-4 h-4" />
                                Salvar Produto
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
