"use client";

import { useState } from "react";
import { Link2, CalendarCheck, Users, Banknote, Scissors, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, FileText, ChevronRight, X, Sparkles, Filter, Store, Wallet, AlertCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

// 1. KPI Mocks (6 cards like Trinks)
const KPIS = [
    { title: "Resultado", value: "R$ 4.230,00", trend: "+12%", isPositive: true },
    { title: "Receita", value: "R$ 14.590,00", trend: "+2%", isPositive: true },
    { title: "Despesa", value: "R$ 10.360,00", trend: "-5%", isPositive: false },
    { title: "Agendamentos", value: "342", trend: "+18%", isPositive: true },
    { title: "Agendamentos Online", value: "128", trend: "+40%", isPositive: true },
    { title: "Atendimentos", value: "290", trend: "+10%", isPositive: true },
];

const RECENT_APPOINTMENTS = [
    { id: 1, client: "Marcelo Souza", service: "Corte + Barba", professional: "João Silva", time: "Hoje, 14:00", status: "Confirmado" },
    { id: 2, client: "Lucas Fernandes", service: "Corte Degradê", professional: "Marcio", time: "Hoje, 15:30", status: "Pendente" },
    { id: 3, client: "Pedro Alves", service: "Barba Terapia", professional: "João Silva", time: "Amanhã, 10:00", status: "Confirmado" },
];

export default function DashboardIndex() {
    const [isPrivacyMode, setIsPrivacyMode] = useState(true);

    const maskValue = (val: string) => isPrivacyMode ? "****" : val;

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {/* Cabecalho Principal */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Store className="w-6 h-6 text-cyan-700 dark:text-primary" /> Visão Geral
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Resumo das métricas principais da sua loja (Mês atual vs Passado).</p>
                </div>

                <button
                    onClick={() => setIsPrivacyMode(!isPrivacyMode)}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-cyan-700 dark:hover:text-primary transition-colors shadow-sm"
                >
                    {isPrivacyMode ? (
                        <>
                            <Eye className="w-4 h-4" />
                            <span>Mostrar Valores</span>
                        </>
                    ) : (
                        <>
                            <EyeOff className="w-4 h-4" />
                            <span>Ocultar Valores</span>
                        </>
                    )}
                </button>
            </div>

            {/* FAIXA UNIFICADA 6 CARDS (Métricas Chave estilo Painel) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {KPIS.map((kpi, index) => (
                    <div key={index} className="bg-white dark:bg-[#111] p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-primary/20 transition-all group">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-semibold">{kpi.title}</h3>
                        </div>
                        <div>
                            <p className={`text-lg sm:text-xl font-black ${kpi.title === 'Resultado' ? 'text-cyan-700 dark:text-primary' :
                                kpi.title === 'Despesa' ? 'text-red-500' :
                                    'text-gray-900 dark:text-white'
                                }`}>
                                {maskValue(kpi.value)}
                            </p>

                            <div className="flex items-center gap-1 mt-1 opacity-80">
                                {kpi.isPositive ?
                                    <ArrowUpRight className="w-3 h-3 text-emerald-500" /> :
                                    <ArrowDownRight className="w-3 h-3 text-red-500" />
                                }
                                <span className={`text-[10px] sm:text-xs font-bold ${kpi.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {kpi.trend}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ÁREA DE PRÓXIMOS EVENTOS E RELATÓRIO */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">

                {/* Lado Esquerdo Maior: Agenda */}
                <div className="lg:col-span-8 bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-[#222]">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <CalendarCheck className="w-5 h-5 text-cyan-700 dark:text-primary" /> Próximos Horários
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">Acompanhe quem passará pela porta nas próximas horas.</p>
                        </div>
                        <Link href="/dashboard/agenda" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-cyan-700 dark:hover:text-primary transition-colors">
                            Ver agenda completa <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {RECENT_APPOINTMENTS.map((apt) => (
                            <div key={apt.id} className="flex gap-4 p-3 sm:p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#161618] hover:bg-gray-50 dark:hover:bg-[#1a1a1c] transition-colors group">
                                <div className="flex flex-col justify-center items-center w-14 h-14 bg-white dark:bg-black rounded-lg shrink-0 border border-gray-200 dark:border-gray-800 shadow-sm group-hover:border-primary/50 transition-colors">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-none mb-1">{apt.time.split(', ')[0]}</span>
                                    <span className="text-sm text-gray-900 dark:text-primary font-black leading-none">{apt.time.split(', ')[1]}</span>
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{apt.client}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1 mt-0.5">
                                        <Scissors className="w-3 h-3" /> {apt.service} <span className="mx-1">•</span> <Users className="w-3 h-3" /> {apt.professional}
                                    </p>
                                </div>
                                <div className="shrink-0 flex items-center justify-center">
                                    {apt.status === 'Confirmado' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                                            Confirmado
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                                            Pendente
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lado Direito Menor: Relatórios Call to Action */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="bg-white dark:bg-gradient-to-br dark:from-[#111] dark:to-[#0a0a0a] rounded-2xl p-6 shadow-sm dark:shadow-xl border border-gray-200 dark:border-gray-800 relative overflow-hidden flex flex-col h-full justify-between">
                        {/* Abstract BG */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full pointer-events-none"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-600/10 blur-3xl rounded-full pointer-events-none"></div>

                        <div className="relative z-10 mb-8">
                            <div className="w-12 h-12 bg-gray-50 dark:bg-white/10 rounded-xl flex items-center justify-center mb-4 border border-gray-100 dark:border-white/10">
                                <FileText className="w-6 h-6 text-gray-900 dark:text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Central de Relatórios</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Tenha o controle total da sua empresa em mãos. Acesse relatórios gerenciais, financeiros e de clientes com um clique.
                            </p>
                        </div>

                        <Link
                            href="/dashboard/relatorios"
                            className="relative z-10 w-full bg-primary hover:bg-cyan-400 text-black font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-sm dark:shadow-lg dark:shadow-cyan-500/20"
                        >
                            Ir para Relatórios <ArrowUpRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
