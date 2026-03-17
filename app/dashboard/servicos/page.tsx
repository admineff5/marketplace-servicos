"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, X, Scissors, Info, LayoutList, ChevronDown, Check } from "lucide-react";

// MOCKS PRE-DEFINIDOS DO PARCEIRO
const SUGGESTED_SERVICES = [
    { category: "Barba e Bigode", name: "Barba", description: "Serviço de barba." },
    { category: "Barba e Bigode", name: "Barba com máquina", description: "Barbear os pelos da face com máquina elétrica." },
    { category: "Barba e Bigode", name: "Barba Modelada", description: "Assepsia do rosto com sabonete antisséptico, aplicação de creme de barbear e corte da barba com navalha, com design personalizado e pós-barba." },
    { category: "Barba e Bigode", name: "Barba Tradicional", description: "Assepsia do rosto com sabonete antisséptico, aplicação de creme de barbear e corte da barba com navalha, finalizando com pós-barba." },
    { category: "Barba e Bigode", name: "Bigode com Máquina", description: "Remoção ou aparo do bigode com máquina elétrica." },
    { category: "Barba e Bigode", name: "Bigode Modelado", description: "Cortar, aparar e modelar o bigode." },
    { category: "Barba e Bigode", name: "Bigode Tradicional", description: "Remoção ou aparo do bigode com navalha." },
    { category: "Barba e Bigode", name: "Contorno de Barba", description: "Assepsia do rosto, creme de barbear e contorno da barba com navalha, finalizando com loção." },
    { category: "Barba e Bigode", name: "Ecobarba", description: "Assepsia da pele, esfoliação, barbear e hidratação com produtos orgânicos e sem álcool." },
    { category: "Cabelo", name: "Camuflagem de cabelos brancos", description: "Técnica rápida para disfarçar fios brancos sem cobertura total. Áreas específicas ou em todo o cabelo." },
    { category: "Cabelo", name: "Coloração / Tonalização", description: "Tintura ou tonalização dos cabelos utilizando produtos profissionais de salão." },
    { category: "Cabelo", name: "Corte à Máquina", description: "Corte de cabelo realizado com máquina elétrica." },
    { category: "Cabelo", name: "Corte Masculino", description: "Corte de cabelo masculino com finalização e secagem." },
    { category: "Cabelo", name: "Hidratação", description: "Tratamento de hidratação para recuperar brilho e saúde dos cabelos." },
    { category: "Cabelo", name: "Hidratação com Ampolas", description: "Tratamento capilar intensivo utilizando ampolas profissionais." },
    { category: "Cabelo", name: "Higienização", description: "Lavagem dos cabelos com shampoo profissional." },
    { category: "Cabelo", name: "Higienização + Secagem", description: "Lavagem e secagem dos cabelos." },
    { category: "Depilação Masculina", name: "Depilação Masculina - Cavanhaque", description: "Remoção dos pelos da região do cavanhaque." },
    { category: "Estética Corporal", name: "Massagem Desportiva", description: "Técnica para prevenir lesões e auxiliar na recuperação muscular por meio de alongamentos." },
    { category: "Estética Corporal", name: "Tatuagem", description: "Arte de gravar desenhos ou símbolos na pele por meio de pigmentos." },
    { category: "Mãos e Pés", name: "Manicure e Pedicure Masculina", description: "Corte das unhas das mãos e dos pés, lixamento, hidratação e cuidado das cutículas." },
    { category: "Mãos e Pés", name: "Manicure Masculina", description: "Corte das unhas das mãos, lixamento, hidratação e cuidado das cutículas." },
    { category: "Mãos e Pés", name: "Pedicure Masculina", description: "Corte das unhas dos pés, lixamento, hidratação e cuidado das cutículas." },
];

// INITIAL_MOCK_DATA removed

export default function GestaoServicosPage() {
    const [services, setServices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [editingService, setEditingService] = useState<any>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/services');
            const data = await res.json();
            setServices(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erro ao buscar serviços:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Form State
    const [formName, setFormName] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [formPrice, setFormPrice] = useState("");
    const [formPromoPrice, setFormPromoPrice] = useState("");
    const [formDuration, setFormDuration] = useState("");

    const filteredServices = services.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const applySuggestion = (suggestion: typeof SUGGESTED_SERVICES[0]) => {
        setFormName(suggestion.name);
        setFormDescription(suggestion.description);
        setShowSuggestions(false);
    };

    const formatCurrency = (value: string) => {
        const num = value.replace(/\D/g, "");
        if (!num) return "";
        const float = parseFloat(num) / 100;
        return float.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const handleSave = async () => {
        if (!formName || !formPrice) return;

        const payload = {
            name: formName,
            description: formDescription,
            price: (parseFloat(formPrice) || 0) / 100,
            promoPrice: formPromoPrice ? (parseFloat(formPromoPrice) || 0) / 100 : null,
            duration: formDuration ? parseInt(formDuration) : null
        };

        try {
            const url = editingService ? `/api/services/${editingService.id}` : '/api/services';
            const method = editingService ? 'PUT' : 'POST';

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
            console.error("Erro ao salvar:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Deseja realmente excluir este serviço?")) {
            try {
                const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
                if (res.ok) fetchData();
            } catch (error) {
                console.error("Erro ao excluir:", error);
            }
        }
    };

    const handleEdit = (service: any) => {
        setEditingService(service);
        setFormName(service.name);
        setFormDescription(service.description || "");
        setFormPrice(service.price ? (service.price * 100).toFixed(0) : "");
        setFormPromoPrice(service.promoPrice ? (service.promoPrice * 100).toFixed(0) : "");
        setFormDuration(service.duration ? service.duration.toString() : "");
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormName("");
        setFormDescription("");
        setFormPrice("");
        setFormPromoPrice("");
        setFormDuration("");
        setShowSuggestions(false);
        setSelectedCategory(null);
        setEditingService(null);
    };

    const openNewModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-8 bg-gray-50/50 dark:bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                            <Scissors className="w-6 h-6 text-cyan-700 dark:text-primary" />
                            Gestão de Serviços
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Catálogo de serviços e combos oferecidos no seu estabelecimento.
                        </p>
                    </div>

                    <button
                        onClick={openNewModal}
                        className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 bg-cyan-700 hover:bg-cyan-800 text-white dark:bg-primary dark:hover:bg-cyan-400 dark:text-black"
                    >
                        <Plus className="w-4 h-4" />
                        Novo Serviço
                    </button>
                </div>

                {/* Filter Bar */}
                <div className="bg-white dark:bg-[#111112] rounded-2xl border border-gray-200 dark:border-[#222] p-4 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou descrição..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-600 dark:focus:ring-primary focus:border-cyan-600 dark:focus:border-primary transition-all"
                        />
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-[#111112] border border-gray-200 dark:border-[#222] rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-[#2a2a2c] bg-gray-50/50 dark:bg-[#151516]/50">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Serviço</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descrição</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Preço Padrão</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Preço Promo</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duração</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-[#2a2a2c]">
                                {filteredServices.length > 0 ? filteredServices.map((srv) => (
                                    <tr key={srv.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1c] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">{srv.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 max-w-[200px]" title={srv.description}>
                                                {srv.description || "-"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 dark:text-white">R$ {srv.price}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {srv.promoPrice ? (
                                                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 font-semibold text-xs border border-green-200 dark:border-green-500/20">
                                                    R$ {srv.promoPrice}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {srv.duration ? `${srv.duration} min` : "-"}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => handleEdit(srv)}
                                                    className="p-2 text-gray-400 hover:text-cyan-700 dark:hover:text-primary hover: /10 rounded-lg transition-colors bg-cyan-700 hover:bg-cyan-800 text-white dark:bg-primary dark:hover:bg-cyan-400 dark:text-black" 
                                                    title="Editar Serviço"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(srv.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" 
                                                    title="Excluir Serviço"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <Scissors className="w-8 h-8 opacity-20" />
                                                <p>Nenhum serviço encontrado.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* CREATE MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm sm:items-center items-end" onClick={() => setIsModalOpen(false)}>
                    <div
                        className="w-full max-w-2xl bg-white dark:bg-[#111112] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-200 dark:border-[#222]"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#222] bg-gray-50/50 dark:bg-[#161618]">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Plus className="w-5 h-5 text-cyan-700 dark:text-primary" />
                                {editingService ? "Editar Serviço" : "Novo Serviço"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">

                            {/* Suggestion Box */}
                            <div className="relative">
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                                    Nome do Serviço / Sugestões Rápidas
                                </label>
                                <div className="flex flex-col sm:flex-row gap-2 relative">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            placeholder="Ex: Corte Degrade, Banho Premium..."
                                            value={formName}
                                            onChange={e => setFormName(e.target.value)}
                                            onFocus={() => {
                                                if (formName === "") setShowSuggestions(true);
                                            }}
                                            className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:ring-1 focus:ring-cyan-600 dark:focus:ring-primary focus:border-cyan-600 dark:focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setShowSuggestions(!showSuggestions)}
                                        className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-[#252528] transition-colors"
                                    >
                                        <LayoutList className="w-4 h-4" />
                                        Catálogo
                                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSuggestions ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>

                                {/* Dropdown de Sugestões Categorizado */}
                                {showSuggestions && (
                                    <>
                                        {/* Backdrop invisivel para fechar clicando fora */}
                                        <div className="fixed inset-0 z-40" onClick={() => {
                                            setShowSuggestions(false);
                                            setSelectedCategory(null);
                                        }}></div>
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#151516] border border-gray-200 dark:border-[#2a2a2c] rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col">
                                            
                                            <div className="p-3 bg-white dark:bg-[#151516] border-b border-gray-100 dark:border-[#2a2a2c] flex items-center justify-between text-xs text-cyan-700 dark:text-primary font-bold px-4">
                                                <div className="flex items-center gap-2">
                                                    <LayoutList className="w-4 h-4" /> 
                                                    {selectedCategory ? (
                                                        <button 
                                                            onClick={() => setSelectedCategory(null)}
                                                            className="hover:underline flex items-center gap-1"
                                                        >
                                                            Categorias <ChevronDown className="w-3 h-3 rotate-90" /> {selectedCategory}
                                                        </button>
                                                    ) : "Catálogo de Serviços"}
                                                </div>
                                                {selectedCategory && (
                                                    <button onClick={() => setSelectedCategory(null)} className="text-gray-400 hover:text-white transition-colors">Voltar</button>
                                                )}
                                            </div>

                                            <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                                {!selectedCategory ? (
                                                    /* LISTA DE CATEGORIAS */
                                                    <div className="p-2 grid grid-cols-1 gap-1">
                                                        {Array.from(new Set(SUGGESTED_SERVICES.map(s => s.category))).map((cat) => (
                                                            <button
                                                                key={cat}
                                                                onClick={() => setSelectedCategory(cat)}
                                                                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1a1a1c] transition-colors text-left group"
                                                            >
                                                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-primary">{cat}</span>
                                                                <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    /* LISTA DE SERVIÇOS DA CATEGORIA */
                                                    <div className="p-2">
                                                        {SUGGESTED_SERVICES.filter(s => s.category === selectedCategory).map((srv, idx) => (
                                                            <div
                                                                key={idx}
                                                                onClick={() => applySuggestion(srv)}
                                                                className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1a1a1c] cursor-pointer transition-colors group"
                                                            >
                                                                <div className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-cyan-700 dark:hover:text-primary transition-colors">{srv.name}</div>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{srv.description}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider flex items-center justify-between">
                                    Descrição (Opcional)
                                    <span className="text-[10px] text-gray-400 font-normal normal-case">Visível para os clientes</span>
                                </label>
                                <textarea
                                    rows={3}
                                    value={formDescription}
                                    onChange={e => setFormDescription(e.target.value)}
                                    placeholder="Descreva o que este serviço inclui..."
                                    className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:ring-1 focus:ring-cyan-600 dark:focus:ring-primary focus:border-cyan-600 dark:focus:border-primary outline-none transition-all resize-none custom-scrollbar"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                                        Preço Padrão *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">R$</span>
                                        <input
                                            type="text"
                                            value={formatCurrency(formPrice)} 
                                            onChange={e => {
                                                const raw = e.target.value.replace(/\D/g, "").slice(0, 9);
                                                setFormPrice(raw);
                                            }}
                                            placeholder="0,00"
                                            className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg pl-9 pr-3 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:ring-1 focus:ring-cyan-600 dark:focus:ring-primary focus:border-cyan-600 dark:focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider flex items-center justify-between">
                                        Preço Promo.
                                        <span className="text-[10px] text-green-500 font-bold normal-case bg-green-500/10 px-1 py-0.5 rounded">Opcional</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">R$</span>
                                        <input
                                            type="text"
                                            value={formatCurrency(formPromoPrice)} 
                                            onChange={e => {
                                                const raw = e.target.value.replace(/\D/g, "").slice(0, 9);
                                                setFormPromoPrice(raw);
                                            }}
                                            placeholder="0,00"
                                            className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-green-200 dark:border-green-500/30 rounded-lg pl-9 pr-3 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider flex items-center justify-between">
                                        Duração
                                        <span className="text-[10px] text-green-500 font-bold normal-case bg-green-500/10 px-1 py-0.5 rounded">Opcional</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number" min="5" step="5"
                                            value={formDuration} onChange={e => setFormDuration(e.target.value)}
                                            placeholder="Ex: 45"
                                            className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg pl-3 pr-10 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:ring-1 focus:ring-cyan-600 dark:focus:ring-primary focus:border-cyan-600 dark:focus:border-primary outline-none transition-all"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">min</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-[#222] bg-gray-50/50 dark:bg-[#161618] flex items-center justify-end gap-3 z-0 relative">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#222] rounded-xl transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!formName || !formPrice}
                                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-cyan-700 hover:bg-cyan-800 text-white dark:bg-primary dark:hover:bg-cyan-400 dark:text-black"
                            >
                                <Check className="w-4 h-4" />
                                Salvar Serviço
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
