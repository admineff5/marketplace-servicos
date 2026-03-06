"use client";

import { BarChart3, TrendingUp, Users, CalendarCheck, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";

const KPIS = [
    {
        title: "Receita (Mês)",
        value: "R$ 14.590,00",
        trend: "+12.5%",
        isPositive: true,
        icon: TrendingUp,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
    },
    {
        title: "Agendamentos",
        value: "342",
        trend: "+18.2%",
        isPositive: true,
        icon: CalendarCheck,
        color: "text-gray-900 dark:text-primary",
        bgColor: "bg-gray-100 dark:bg-primary/10",
    },
    {
        title: "Novos Leads",
        value: "156",
        trend: "-4.3%",
        isPositive: false,
        icon: Users,
        color: "text-rose-500",
        bgColor: "bg-rose-500/10",
    },
    {
        title: "Conversão",
        value: "45.6%",
        trend: "+2.1%",
        isPositive: true,
        icon: BarChart3,
        color: "text-indigo-500",
        bgColor: "bg-indigo-500/10",
    },
];

const RECENT_APPOINTMENTS = [
    { id: 1, client: "Marcelo Souza", service: "Corte + Barba", professional: "João Silva", time: "Hoje, 14:00", status: "Confirmado" },
    { id: 2, client: "Lucas Fernandes", service: "Corte Degradê", professional: "Marcio", time: "Hoje, 15:30", status: "Pendente" },
    { id: 3, client: "Pedro Alves", service: "Barba Terapia", professional: "João Silva", time: "Amanhã, 10:00", status: "Confirmado" },
];

export default function DashboardIndex() {
    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Visão Geral</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Resumo do desempenho da sua empresa nos últimos 30 dias.</p>
                </div>
                <button className="bg-primary text-black font-semibold px-4 py-2 rounded-lg hover:bg-cyan-400 transition-colors shadow-sm text-sm">
                    Baixar Relatório
                </button>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {KPIS.map((kpi) => (
                    <div key={kpi.title} className="bg-white dark:bg-[#111] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${kpi.bgColor}`}>
                                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${kpi.isPositive ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400' : 'text-rose-700 bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400'}`}>
                                {kpi.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {kpi.trend}
                            </div>
                        </div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{kpi.title}</h3>
                        <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{kpi.value}</p>
                    </div>
                ))}
            </div>

            {/* Layout Grid For Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Chart Area (Mocked Shape) */}
                <div className="lg:col-span-2 bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Receita x Agendamentos</h3>
                    <div className="flex-1 min-h-[300px] flex items-end justify-between gap-2 md:gap-4 mt-auto pt-8">
                        {/* Creating a fake bar chart with tailwind */}
                        {[
                            { h: 40, v: "R$ 1.2k" },
                            { h: 60, v: "R$ 1.8k" },
                            { h: 45, v: "R$ 1.3k" },
                            { h: 80, v: "R$ 2.4k" },
                            { h: 55, v: "R$ 1.6k" },
                            { h: 90, v: "R$ 2.7k" },
                            { h: 75, v: "R$ 2.2k" }
                        ].map((item, i) => (
                            <div key={i} className="w-full h-full flex flex-col justify-end items-center gap-2 group relative">
                                {/* Hover Tooltip / Data */}
                                <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs py-1 px-2 rounded font-semibold whitespace-nowrap z-10">
                                    {item.v} • {item.h} ageds.
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-primary/20 group-hover:bg-gray-800 dark:group-hover:bg-primary transition-colors rounded-t-md relative flex justify-center" style={{ height: `${item.h}%` }}>
                                    <span className="absolute -top-6 text-[10px] font-bold text-gray-500 dark:text-gray-400 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                        {item.v}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-400 font-medium">Dia {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Appointments */}
                <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Próximos Horários</h3>
                        <Link href="/dashboard/agenda" className="text-gray-900 dark:text-primary hover:underline text-sm font-semibold">Ver agenda inteira</Link>
                    </div>

                    <div className="space-y-4">
                        {RECENT_APPOINTMENTS.map((apt) => (
                            <div key={apt.id} className="flex gap-4 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <div className="flex flex-col justify-center items-center w-12 h-12 bg-gray-100 dark:bg-primary/10 rounded-lg shrink-0">
                                    <span className="text-xs text-gray-900 dark:text-primary font-bold">{apt.time.split(', ')[1]}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{apt.client}</p>
                                    <p className="text-xs text-gray-500 truncate">{apt.service} • com {apt.professional}</p>
                                </div>
                                <div className="shrink-0 flex items-center">
                                    <span className={`w-2 h-2 rounded-full ${apt.status === 'Confirmado' ? 'bg-emerald-500' : 'bg-yellow-500'}`}></span>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
