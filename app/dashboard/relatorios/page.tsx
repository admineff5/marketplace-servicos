"use client";

import { useState } from "react";
import {
    FileText,
    X,
    Filter,
    ChevronRight,
    AlertCircle,
    Store
} from "lucide-react";

// -- REPORTS DATA (Moved from Dashboard) --
const REPORTS_CATEGORIES = [
    "Agendamentos",
    "Clientes",
    "Estoque / Produtos",
    "Financeiro",
    "Profissionais",
];

const REPORTS_LIST = {
    "Agendamentos": [
        { title: "Relatório de Descrição e Quantidade (Por Período)", active: true, desc: "Lista completa de todos os agendamentos filtrados por data." },
        { title: "Relatório de Agendamentos Online", active: true, desc: "Veja quem marcou pelo link público." },
        { title: "Status de Agendamentos (Confirmados vs Faltas)", active: true, desc: "Taxa de comparecimento e cancelamentos frequentes." },
    ],
    "Clientes": [
        { title: "Ranking de Clientes (Frequência)", active: true, desc: "Lista dos VIPs e clientes que mais visitam a loja." },
        { title: "Relatório de Aniversariantes", active: true, desc: "Saiba quem faz aniversário no mês para enviar promoções." },
        { title: "Clientes Inativos (> 30 dias)", active: true, desc: "Clientes que não retornaram recentemente." },
        { title: "Ticket Médio por Cliente", active: false, desc: "Em breve: Cálculo de gasto médio." },
    ],
    "Estoque / Produtos": [
        { title: "Posição Atual de Estoque", active: true, desc: "Lista de todos os produtos físicos e saldo atual." },
        { title: "Produtos em Alerta (Baixo Estoque)", active: true, desc: "Filtro rápido dos itens que precisam de reposição." },
        { title: "Curva ABC de Vendas", active: false, desc: "Em breve: Produtos mais rentáveis da loja." },
    ],
    "Financeiro": [
        { title: "Fluxo Diário / Resumo de Caixa", active: true, desc: "Entradas e Saídas macro do período." },
        { title: "Relatório de Despesas e Contas a Pagar", active: true, desc: "Lista de todas as despesas avulsas." },
        { title: "Fechamento Mensal Demonstrativo", active: false, desc: "Em breve: DRE completo." },
    ],
    "Profissionais": [
        { title: "Comissão Prevista e Realizada", active: true, desc: "Valores devidos a cada cadeira." },
        { title: "Produtividade (Atendimentos por Mês)", active: true, desc: "Comparativo de quantidade de clientes por profissional." },
    ],
};

export default function CentralRelatoriosPage() {
    const [selectedReportCategory, setSelectedReportCategory] = useState("Agendamentos");
    const activeReports = REPORTS_LIST[selectedReportCategory as keyof typeof REPORTS_LIST] || [];

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0a0a0a] min-h-[calc(100vh-8rem)]">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                        <FileText className="w-6 h-6 text-cyan-700 dark:text-primary" />
                        Central de Relatórios
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Exporte ou analise os dados cruzados da sua loja.
                    </p>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden flex flex-col lg:flex-row flex-1">

                {/* Sidebar Categorias */}
                <div className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-800 p-4 sm:p-6 bg-gray-50/50 dark:bg-[#161618]/30">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 px-2">Departamentos</h4>
                    <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 custom-scrollbar">
                        {REPORTS_CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedReportCategory(cat)}
                                className={`whitespace-nowrap lg:whitespace-normal text-left px-4 py-3 rounded-xl font-bold transition-all text-sm border ${selectedReportCategory === cat
                                    ? 'bg-primary text-black border-primary shadow-sm'
                                    : 'bg-white hover:bg-gray-50 dark:bg-[#111] dark:hover:bg-[#1a1a1c] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-[#222]'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main List */}
                <div className="flex-1 p-4 sm:p-8 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center gap-2 mb-6">
                        <Filter className="w-4 h-4 text-cyan-700 dark:text-primary" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Catálogo: <span className="text-cyan-700 dark:text-primary">{selectedReportCategory}</span>
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeReports.map((report, idx) => (
                            <div
                                key={idx}
                                className={`group relative flex flex-col border rounded-2xl p-5 sm:p-6 transition-all ${report.active
                                    ? 'bg-white dark:bg-[#161618] border-gray-200 dark:border-[#2a2a2c] hover:border-primary/50 hover:shadow-md cursor-pointer'
                                    : 'bg-gray-50/50 dark:bg-[#0f0f10] border-gray-100 dark:border-[#1a1a1c] opacity-60 cursor-not-allowed'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${report.active ? 'bg-primary/10 text-cyan-700 dark:text-primary' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                                        }`}>
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className={`text-sm sm:text-base font-bold mb-1 ${report.active ? 'text-gray-900 dark:text-white group-hover:text-cyan-700 dark:hover:text-primary transition-colors' : 'text-gray-500 dark:text-gray-500'
                                            }`}>
                                            {report.title}
                                        </h4>
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                            {report.desc}
                                        </p>
                                    </div>
                                </div>

                                {report.active ? (
                                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#222] flex justify-end">
                                        <span className="text-xs font-bold text-cyan-700 dark:text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Acessar Relatório <ChevronRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                ) : (
                                    <div className="absolute top-4 right-4">
                                        <span className="inline-flex items-center gap-1 rounded bg-gray-200 dark:bg-[#222] px-2 py-0.5 text-[10px] font-bold text-gray-500 dark:text-gray-400 capitalize">
                                            <AlertCircle className="w-3 h-3" /> Em Breve
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
