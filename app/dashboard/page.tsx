"use client";
import { useState, useEffect } from "react";
import { Link2, CalendarCheck, Users, Banknote, Scissors, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, FileText, ChevronRight, X, Sparkles, Filter, Store, Wallet, AlertCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

// 1. KPI Mocks (Mantendo mocks para KPI por envolver agregação complexa de financeiro)
const KPIS = [
    { title: "Resultado", value: "R$ 0,00", trend: "0%", isPositive: true },
    { title: "Receita", value: "R$ 0,00", trend: "0%", isPositive: true },
    { title: "Despesa", value: "R$ 0,00", trend: "0%", isPositive: false },
    { title: "Agendamentos", value: "0", trend: "0%", isPositive: true },
    { title: "Agendamentos Online", value: "0", trend: "0%", isPositive: true },
    { title: "Atendimentos", value: "0", trend: "0%", isPositive: true },
];

export default function DashboardIndex() {
    const [isPrivacyMode, setIsPrivacyMode] = useState(true);
    const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
    const [kpis, setKpis] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                // Fetch Recent Appointments
                const aptRes = await fetch('/api/appointments?limit=10');
                const aptData = await aptRes.json();
                // Filtrar agendamentos cancelados para não poluir a dashboard
                const activeApts = Array.isArray(aptData) 
                    ? aptData.filter((a: any) => a.status !== 'CANCELLED' && a.status !== 'CANCELADO' && a.status !== 'CANCEL')
                    : [];
                setRecentAppointments(activeApts.slice(0, 5));

                // Fetch Stats
                const statsRes = await fetch('/api/dashboard/stats');
                const statsData = await statsRes.json();
                setKpis(Array.isArray(statsData) ? statsData : []);

            } catch (error) {
                console.error("Erro ao carregar dados do dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

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
                {isLoading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="bg-white dark:bg-[#111] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm animate-pulse">
                            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded mb-3"></div>
                            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
                        </div>
                    ))
                ) : kpis.map((kpi, index) => (
                    <div key={index} className="bg-white dark:bg-[#111] p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-primary/20 transition-all group">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-semibold">{kpi.title}</h3>
                        </div>
                        <div>
                            <p className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
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
                        {isLoading ? (
                            <div className="py-10 text-center text-gray-500 text-sm">Carregando próximos horários...</div>
                        ) : recentAppointments.length > 0 ? recentAppointments.map((apt: any) => (
                            <div key={apt.id} className="flex gap-4 p-3 sm:p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#161618] hover:bg-gray-50 dark:hover:bg-[#1a1a1c] transition-colors group">
                                <div className="flex flex-col justify-center items-center w-14 h-14 bg-white dark:bg-black rounded-lg shrink-0 border border-gray-200 dark:border-gray-800 shadow-sm group-hover:border-primary/50 transition-colors">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-none mb-1">
                                        {apt.start ? apt.start.split(' ')[0] : '-'}
                                    </span>
                                    <span className="text-sm text-gray-900 dark:text-primary font-black leading-none">
                                        {apt.start}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{apt.client}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1 mt-0.5">
                                        <Scissors className="w-3 h-3" /> {apt.title?.split(' - ')[0]} <span className="mx-1">•</span> <Users className="w-3 h-3" /> {apt.prof}
                                    </p>
                                </div>
                                <div className="shrink-0 flex items-center justify-center">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                                        ${apt.status === 'CONFIRMED' || apt.status === 'COMPLETED' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400' :
                                          apt.status === 'PENDING' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400' :
                                          'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'}`}
                                    >
                                        {apt.status === 'CONFIRMED' ? 'Confirmado' : 
                                         apt.status === 'PENDING' ? 'Pendente' : 
                                         apt.status === 'CANCELLED' ? 'Cancelado' : 
                                         apt.status === 'COMPLETED' ? 'Concluído' : apt.status}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <div className="py-10 text-center text-gray-500 text-sm border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                                Nenhum agendamento para as próximas horas.
                            </div>
                        )}
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
