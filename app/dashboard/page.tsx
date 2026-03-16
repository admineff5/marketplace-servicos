"use client";
import { useState, useEffect } from "react";
import { Link2, CalendarCheck, Users, Banknote, Scissors, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, FileText, ChevronRight, X, Sparkles, Filter, Store, Wallet, AlertCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const WEEKDAYS = ["DOM.", "SEG.", "TER.", "QUA.", "QUI.", "SEX.", "SÁB."];
const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const formatTimeLocal = (dateStr: any) => {
    if (!dateStr) return '--:--';
    return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const formatEndTimeLocal = (dateStr: any, duration: number = 30) => {
    if (!dateStr) return '--:--';
    const d = new Date(dateStr);
    return new Date(d.getTime() + duration * 60000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

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
    const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
    const closeModal = () => setSelectedAppointment(null);

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
                        ) : recentAppointments.length > 0 ? (
                            recentAppointments.map((apt: any) => (
                            <div key={apt.id} onClick={() => setSelectedAppointment(apt)} className="bg-white dark:bg-[#161618] border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-cyan-600/30 transition-shadow cursor-pointer flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                                <div className="flex items-start sm:items-center gap-4">
                                    <div className="hidden sm:flex flex-col items-center justify-center w-14 h-14 bg-gray-50 dark:bg-[#1e1f22] rounded-lg border border-gray-200 dark:border-gray-800 shrink-0">
                                        <span className="text-xs font-semibold text-gray-500 uppercase">{WEEKDAYS[new Date(apt.date).getUTCDay()].replace('.', '')}</span>
                                        <span className="text-lg font-bold text-gray-900 dark:text-white leading-none mt-0.5">{new Date(apt.date).getUTCDate()}</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-base font-bold text-gray-900 dark:text-white">{formatTimeLocal(apt.date)} - {apt.title?.split(' - ')[0] || apt.title || 'Serviço'}</h3>
                                            <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                                            <p className="flex items-center gap-1">Profissional: <span className="font-semibold text-gray-800 dark:text-gray-200">{apt.employee?.name || apt.prof}</span></p>
                                            <p className="flex items-center gap-1">Cliente: <span className="font-semibold text-gray-800 dark:text-gray-200">{apt.user?.name || apt.client}</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="shrink-0 flex items-center justify-center">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${apt.status === 'CONFIRMED' || apt.status === 'COMPLETED' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400'}`}>
                                        {apt.status === 'CONFIRMED' ? 'Confirmado' : 'Pendente'}
                                    </span>
                                </div>
                            </div>
                        ))) : (
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
        
                {selectedAppointment && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm" onClick={closeModal}>
                        <div className="relative w-full max-w-[420px] bg-white dark:bg-[#111] shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-gray-200 dark:border-gray-800 flex flex-col rounded-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
                            <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                                <button onClick={closeModal} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-gray-700 dark:text-gray-300 transition-colors"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="h-[120px] bg-[#FFF1B8] dark:bg-[#1a1a1a] relative overflow-hidden flex items-end px-6 border-b border-gray-100 dark:border-gray-800/50">
                                <div className="absolute bottom-0 left-8 w-24 h-20 bg-[#FFE59E] rounded-t-xl border border-[#DCC78A]"></div>
                                <div className="absolute bottom-0 right-16 w-36 h-24 bg-[#FFE59E] rounded-t-xl border border-[#DCC78A]"></div>
                                <div className="absolute bottom-0 left-12 w-6 h-14 bg-[#1E1A35] rounded-t"></div>
                                <div className="absolute bottom-0 left-24 w-10 h-14 bg-[#FFBADB] rounded-lg"></div>
                                <div className="absolute bottom-0 right-32 w-11 h-12 bg-white/40 border border-white/30 rounded-t-md"></div>
                            </div>
                            <div className="p-6">
                                <h2 className="text-[22px] font-normal text-gray-900 dark:text-gray-100 leading-tight">{selectedAppointment.service?.name || selectedAppointment.title || 'Agendamento'}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatTimeLocal(selectedAppointment.date)} - {formatEndTimeLocal(selectedAppointment.date)}</p>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
}
