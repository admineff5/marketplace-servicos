"use client";

import { Calendar, Clock, MapPin, Receipt, Star, CheckCircle, Search, Filter, User } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

// Data will be fetched from API
// Data will be fetched from API


export default function ClienteDashboard() {
    const [activeTab, setActiveTab] = useState("upcoming");
    const [upcoming, setUpcoming] = useState<any[]>([]);
    const [past, setPast] = useState<any[]>([]);
    const [stats, setStats] = useState({ scheduled: 0, completed: 0, totalSpent: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/user/appointments');
            const data = await res.json();
            if (data.stats) {
                setUpcoming(data.upcoming);
                setPast(data.past);
                setStats(data.stats);
            }
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRate = async (appointmentId: string, rating: number) => {
        try {
            const res = await fetch('/api/user/appointments', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appointmentId, rating })
            });
            if (res.ok) {
                // Update local state
                setPast(prev => prev.map(apt => 
                    apt.id === appointmentId ? { ...apt, rating } : apt
                ));
            }
        } catch (error) {
            console.error("Erro ao salvar avaliação:", error);
        }
    };

    const handleCancel = async (appointmentId: string) => {
        if (!confirm("Tem certeza que deseja cancelar este agendamento? O valor será creditado em sua carteira.")) return;
        
        try {
            const res = await fetch('/api/user/appointments', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appointmentId, action: "cancel" })
            });
            if (res.ok) {
                // Refresh data to update balance and lists
                fetchData();
            } else {
                alert("Erro ao cancelar agendamento.");
            }
        } catch (error) {
            console.error("Erro ao cancelar:", error);
        }
    };

    const handleRebook = (item: any) => {
        const params = new URLSearchParams({
            rebook: 'true',
            companyId: item.companyId,
            locationId: item.locationId,
            employeeId: item.employeeId,
            serviceName: item.service,
            appointmentId: item.id // <--- ID do agendamento que será cancelado
        });
        window.location.href = `/?${params.toString()}`;
    };

    return (
        <div className="space-y-8 animate-fade-in pb-10">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                    Meus Agendamentos
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Acompanhe seus próximos serviços e histórico de compras.
                </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-cyan-700 dark:text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Agendados</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.scheduled}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Realizados</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                        <Receipt className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Gasto Total</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">R$ {stats.totalSpent.toFixed(2)}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-2xl p-6 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Star className="w-6 h-6 text-cyan-700 dark:text-primary fill-current" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-cyan-700 dark:text-primary">Saldo Carteira</p>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white">R$ {(stats as any).balance?.toFixed(2) || "0.00"}</h3>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-800">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab("upcoming")}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "upcoming"
                            ? 'border-primary text-cyan-700 dark:text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-700'
                            }`}
                    >
                        Próximos Agendamentos
                    </button>
                    <button
                        onClick={() => setActiveTab("past")}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "past"
                            ? 'border-primary text-cyan-700 dark:text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-700'
                            }`}
                    >
                        Histórico e Recibos
                    </button>
                </nav>
            </div>

            {/* List Container */}
            <div className="space-y-4">
                {activeTab === "upcoming" ? (
                    upcoming.map(item => (
                        <div key={item.id} className="bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md flex flex-col sm:flex-row gap-5 relative overflow-hidden group">
                            {/* Image */}
                            <div className="w-full sm:w-24 h-32 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-gray-200 dark:border-gray-800">
                                <img 
                                    src={item.image} 
                                    alt={item.company} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{item.service}</h3>
                                            <p className="font-medium text-cyan-700 dark:text-primary text-sm">{item.company}</p>
                                        </div>
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${item.status === 'confirmed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                            {item.status === 'confirmed' ? 'Confirmado' : 'Aguardando'}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 lg:flex lg:flex-row gap-4 mt-4 text-xs font-medium text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a1c] px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800/50">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {item.rawDate ? new Date(item.rawDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : item.date}
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a1c] px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800/50">
                                        <Clock className="w-3.5 h-3.5" />
                                        {item.rawDate ? new Date(item.rawDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : item.time}
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a1c] px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800/50">
                                        <User className="w-3.5 h-3.5" /> {item.professional}
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a1c] px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800/50">
                                        <MapPin className="w-3.5 h-3.5" /> {item.address.split('-')[0]}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex sm:flex-col justify-end items-center sm:items-end gap-2 border-t sm:border-t-0 border-gray-100 dark:border-gray-800 pt-4 sm:pt-0">
                                <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.price}</p>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleCancel(item.id)} className="px-3 py-2 border border-red-200 bg-red-50 dark:bg-red-900/10 rounded-lg text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors">Cancelar</button>
                                    <button onClick={() => handleRebook(item)} className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-colors">Reagendar</button>
                                    <button onClick={() => window.open(item.mapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address)}`, '_blank')} className="px-3 py-2 bg-cyan-500/10 text-cyan-700 dark:bg-primary/20 dark:text-primary border border-cyan-600/30 dark:border-primary/30 rounded-lg text-xs font-bold hover:bg-cyan-700 hover:text-white dark:hover:bg-primary dark:hover:text-black transition-colors flex items-center gap-1">Ver Rota</button>
                                </div>
                            </div>
                        </div>
                    )) : (
                    past.map(item => (
                        <div key={item.id} className="bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md flex flex-col sm:flex-row gap-5 relative opacity-85 hover:opacity-100">
                            {/* Image */}
                            <div className="w-full sm:w-20 h-24 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-gray-200 dark:border-gray-800 grayscale">
                                <img src={item.image} alt={item.company} className="w-full h-full object-cover" />
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-md font-bold text-gray-900 dark:text-white mb-0.5">{item.service}</h3>
                                        <p className="font-medium text-gray-500 text-sm">{item.company}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${item.status === 'cancelled' ? 'bg-red-500/10 text-red-600' : 'bg-green-500/10 text-green-600'}`}>
                                            {item.status === 'cancelled' ? 'Cancelado' : 'Realizado'}
                                        </span>
                                        <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a1c] px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800">
                                            <Calendar className="w-3.5 h-3.5 text-gray-500" />
                                            <span className="text-xs font-semibold text-gray-500">
                                                {item.rawDate ? new Date(item.rawDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : item.date}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 mt-4">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{item.price}</p>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button 
                                                key={star} 
                                                onClick={() => handleRate(item.id, star)}
                                                className="focus:outline-none transition-transform hover:scale-110"
                                            >
                                                <Star className={`w-3.5 h-3.5 ${star <= (item.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-700"}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex sm:flex-col justify-end items-center sm:items-end gap-2 border-t sm:border-t-0 border-gray-100 dark:border-gray-800 pt-4 sm:pt-0">
                                <button className="px-4 py-2 flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full sm:w-auto">
                                    <Receipt className="w-4 h-4" /> Recibo
                                </button>
                                <button 
                                    onClick={() => handleRebook(item)} 
                                    className="px-4 py-2 bg-cyan-500/10 text-cyan-700 dark:bg-primary/20 dark:text-primary border border-cyan-600/30 dark:border-primary/30 rounded-lg text-sm font-bold hover:bg-cyan-700 hover:text-white dark:hover:bg-primary dark:hover:text-black transition-colors"
                                >
                                    Agendar de Novo
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
