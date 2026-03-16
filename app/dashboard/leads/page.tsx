"use client";

import { useState } from "react";
import { Target, Search, Plus, Filter, MessageCircle, MoreVertical, Calendar } from "lucide-react";

// Kanban Columns (Stages)
const STAGES = ["Novos Contatos", "Em Negociação", "Agendamento Confirmado", "Perdido"];

// Fake Leads Data
const INITIAL_LEADS = [
    { id: 1, name: "Fernanda Lima", origin: "Instagram", service: "Micro de Sobrancelha", stage: "Novos Contatos", phone: "11999999999", date: "Há 2 horas" },
    { id: 2, name: "Pedro Henrique", origin: "WhatsApp", service: "Corte + Barba", stage: "Em Negociação", phone: "11988888888", date: "Ontem" },
    { id: 3, name: "Maria Cláudia", origin: "Indicação", service: "Limpeza de Pele", stage: "Em Negociação", phone: "11977777777", date: "Pela Manhã" },
    { id: 4, name: "José Roberto", origin: "Google Ads", service: "Progressiva Masculina", stage: "Agendamento Confirmado", phone: "11966666666", date: "Segunda-feira" },
    { id: 5, name: "Camila Borges", origin: "Instagram", service: "Camuflagem", stage: "Perdido", phone: "11955555555", date: "Semana passada" },
];

export default function GestaoLeadsPage() {
    const [leads, setLeads] = useState(INITIAL_LEADS);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter based on search term
    const filteredLeads = leads.filter(l =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.service.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group by Stages
    const getLeadsByStage = (stageName: string) => {
        return filteredLeads.filter(l => l.stage === stageName);
    };

    // Move Stage Logic (Click handler instead of Drag & Drop for MVP Simplicity on Mobile)
    const moveLead = (leadId: number, direction: 'next' | 'prev') => {
        setLeads(prev => prev.map(lead => {
            if (lead.id === leadId) {
                const currentIndex = STAGES.indexOf(lead.stage);
                let newIndex = currentIndex;

                if (direction === 'next' && currentIndex < STAGES.length - 1) newIndex++;
                if (direction === 'prev' && currentIndex > 0) newIndex--;

                return { ...lead, stage: STAGES[newIndex] };
            }
            return lead;
        }));
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-8 bg-gray-50/50 dark:bg-[#0a0a0a]">
            <div className="flex flex-col h-full space-y-6">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                            <Target className="w-6 h-6 text-cyan-700 dark:text-primary" />
                            Gestão de Leads (CRM)
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Guie contatos frios até o momento do agendamento de forma visual.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 bg-cyan-700 hover:bg-cyan-800 text-white dark:bg-primary dark:hover:bg-cyan-400 dark:text-black"
                    >
                        <Plus className="w-4 h-4" />
                        Adicionar Lead
                    </button>
                </div>

                {/* Toolbar */}
                <div className="bg-white dark:bg-[#111112] rounded-2xl border border-gray-200 dark:border-[#222] p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar interessado ou serviço..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                        />
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-xl hover:bg-gray-100 dark:hover:bg-[#222] transition-colors w-full sm:w-auto">
                        <Filter className="w-4 h-4" /> Origens
                    </button>
                </div>

                {/* Kanban Board Container -> Scrollable overflow in Mobile */}
                <div className="flex-1 overflow-x-auto scrollbar-hide pb-6 pl-1 pr-4">
                    <div className="flex gap-6 min-w-max h-full">

                        {STAGES.map((stage, idx) => {
                            const columnLeads = getLeadsByStage(stage);

                            return (
                                <div key={stage} className="w-[320px] flex flex-col shrink-0 bg-gray-100/50 dark:bg-[#111112]/50 rounded-2xl border border-gray-200/50 dark:border-[#222]/50">

                                    {/* Column Header */}
                                    <div className="p-4 border-b border-gray-200 dark:border-[#222] flex items-center justify-between bg-white/50 dark:bg-[#161618]/50 rounded-t-2xl">
                                        <h3 className="font-bold text-gray-800 dark:text-gray-200 uppercase text-xs tracking-wider">
                                            {stage}
                                        </h3>
                                        <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-[#222] text-xs font-bold text-gray-700 dark:text-gray-400 flex items-center justify-center">
                                            {columnLeads.length}
                                        </span>
                                    </div>

                                    {/* Column Body / Cards */}
                                    <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto scrollbar-hide">
                                        {columnLeads.length > 0 ? columnLeads.map(lead => (
                                            <div key={lead.id} className="bg-white dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] p-4 rounded-xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all group relative">

                                                {/* Meta */}
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md ${lead.origin === 'Instagram' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' :
                                                        lead.origin === 'WhatsApp' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                        }`}>
                                                        {lead.origin}
                                                    </span>
                                                    <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Title & Info */}
                                                <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-snug">{lead.name}</h4>
                                                <p className="text-xs text-cyan-700 dark:text-primary font-medium mt-1">{lead.service}</p>

                                                <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-[#222]">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                        {lead.date}
                                                    </div>

                                                    <a href={`https://wa.me/${lead.phone}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md bg-gray-100 dark:bg-[#222] hover:bg-green-100 dark:hover:bg-green-900/40 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors" title="Chamar no Whats">
                                                        <MessageCircle className="w-3.5 h-3.5" />
                                                    </a>
                                                </div>

                                                {/* Arrows for moving Lead MVP style */}
                                                <div className="absolute top-1/2 -translate-y-1/2 -left-2 -right-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                    {idx > 0 && (
                                                        <button onClick={() => moveLead(lead.id, 'prev')} className="w-6 h-6 rounded-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-md flex items-center justify-center text-gray-500 hover:text-cyan-700 dark:hover:text-primary pointer-events-auto transform -translate-x-1/2">
                                                            {"<"}
                                                        </button>
                                                    )}
                                                    {idx < STAGES.length - 1 && (
                                                        <button onClick={() => moveLead(lead.id, 'next')} className="w-6 h-6 ml-auto rounded-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-md flex items-center justify-center text-gray-500 hover:text-cyan-700 dark:hover:text-primary pointer-events-auto transform translate-x-1/2">
                                                            {">"}
                                                        </button>
                                                    )}
                                                </div>

                                            </div>
                                        )) : (
                                            <div className="h-full flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-gray-200 dark:border-[#222] rounded-xl bg-transparent">
                                                <Target className="w-8 h-8 text-gray-300 dark:text-gray-700 mb-2" />
                                                <p className="text-xs text-gray-500 dark:text-gray-500">Nenhum lead nesta fase</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* CREATE MODAL -> Will be implemented fully later, stubbing structure */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white dark:bg-[#111112] p-8 rounded-3xl max-w-sm w-full text-center" onClick={e => e.stopPropagation()}>
                        <Target className="w-12 h-12 text-cyan-700 dark:text-primary mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Novo Lead Manual</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Em breve: a integração via API das mensagens do Instagram cairão aqui sozinhas!</p>
                        <button onClick={() => setIsModalOpen(false)} className="w-full bg-gray-100 dark:bg-[#222] text-gray-900 dark:text-white font-bold py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-[#333] transition-colors">Voltar</button>
                    </div>
                </div>
            )}

        </div>
    );
}
