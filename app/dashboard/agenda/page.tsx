"use client";
import { useState, useEffect } from "react";
import { Plus, ChevronLeft, ChevronRight, X, User, Edit2, Trash2, Mail, MoreVertical, Calendar as CalendarIcon, Clock, Menu, LayoutList } from "lucide-react";

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

export default function AgendaPage() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [professionals, setProfessionals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
    const [viewMode, setViewMode] = useState<"Mês" | "Semana" | "Dia">("Mês");
    const [agendaLayout, setAgendaLayout] = useState<"calendar" | "list">(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('view') === 'list') return 'list';
        }
        return 'calendar';
    });
    const [selectedPros, setSelectedPros] = useState<string[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState("");
    const [listFilter, setListFilter] = useState<"Proximos" | "Todos">("Proximos");
    const [selectedMiniDate, setSelectedMiniDate] = useState<number | null>(null);

    useEffect(() => {
        fetchData();
    }, [currentDate, viewMode]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            // Fetch professionals to populate filters
            // Fetch professionals to populate filters
            const profRes = await fetch('/api/employees');
            const profs = await profRes.json();
            
            if (Array.isArray(profs)) {
                setProfessionals(profs);
                // Iniciar com todos selecionados (usando IDs para consistência)
                if (selectedPros.length === 0) setSelectedPros(profs.map((p: any) => p.id));
            }

            // Fetch appointments - in a real scenario we'd filter by date range based on viewMode
            const dateStr = currentDate.toISOString().split('T')[0];
            const apptRes = await fetch(viewMode === "Mês" ? '/api/appointments' : `/api/appointments?date=${dateStr}`);
            const appts = await apptRes.json();
            
            if (Array.isArray(appts)) {
                setAppointments(appts);
            } else {
                setAppointments([]);
            }
        } catch (error) {
            console.error("Erro ao buscar dados da agenda:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => setSelectedAppointment(null);

    const filteredPros = professionals.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const navPrev = () => {
        const newDate = new Date(currentDate);
        if (viewMode === "Mês") newDate.setMonth(newDate.getMonth() - 1);
        if (viewMode === "Semana") newDate.setDate(newDate.getDate() - 7);
        if (viewMode === "Dia") newDate.setDate(newDate.getDate() - 1);
        setCurrentDate(newDate);
    };

    const navNext = () => {
        const newDate = new Date(currentDate);
        if (viewMode === "Mês") newDate.setMonth(newDate.getMonth() + 1);
        if (viewMode === "Semana") newDate.setDate(newDate.getDate() + 7);
        if (viewMode === "Dia") newDate.setDate(newDate.getDate() + 1);
        setCurrentDate(newDate);
    };

    const jumpToToday = () => setCurrentDate(new Date()); 

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Calendar logic for Month View Grid
    const calendarGrid = [];
    let dayCount = 1;
    for (let i = 0; i < 42; i++) {
        if (i < firstDay || dayCount > daysInMonth) {
            calendarGrid.push({ date: null, isCurrentMonth: false });
        } else {
            calendarGrid.push({ date: dayCount, isCurrentMonth: true });
            dayCount++;
        }
    }

    // Mini calendar
    const miniCalendarGrid = [];
    let mDayCount = 1;
    for (let i = 0; i < 42; i++) {
        if (i < firstDay || mDayCount > daysInMonth) {
            miniCalendarGrid.push(null);
        } else {
            miniCalendarGrid.push(mDayCount);
            mDayCount++;
        }
    }

    const todayDate = new Date();
    const isToday = (d: number | null) => d === todayDate.getDate() && month === todayDate.getMonth() && year === todayDate.getFullYear();

    let headerTitle = `${MONTHS[month]} de ${year}`;
    if (viewMode === "Semana") {
        const wStart = new Date(currentDate);
        wStart.setDate(currentDate.getDate() - currentDate.getDay());
        const wEnd = new Date(wStart);
        wEnd.setDate(wStart.getDate() + 6);
        if (wStart.getMonth() === wEnd.getMonth()) {
            headerTitle = `${MONTHS[wStart.getMonth()]} de ${year}`;
        } else {
            headerTitle = `${MONTHS[wStart.getMonth()]} – ${MONTHS[wEnd.getMonth()]} de ${year}`;
        }
    } else if (viewMode === "Dia") {
        headerTitle = `${currentDate.getDate()} de ${MONTHS[month]} de ${year}`;
    }

    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                        <CalendarIcon className="w-6 h-6 text-cyan-700 dark:text-primary" />
                        Agenda
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Gerencie seus horários e acompanhe os agendamentos.
                    </p>
                </div>

                
                <div className="flex bg-gray-200 dark:bg-gray-800/80 rounded-lg p-1 shadow-sm border border-gray-300 dark:border-gray-700">
                    <button
                        onClick={() => setAgendaLayout("calendar")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${agendaLayout === "calendar" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                    >
                        <CalendarIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Calendário</span>
                    </button>
                    <button
                        onClick={() => setAgendaLayout("list")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${agendaLayout === "list" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                    >
                        <LayoutList className="w-4 h-4" />
                        <span className="hidden sm:inline">Lista</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden bg-white dark:bg-[#1e1f22] text-gray-900 dark:text-gray-200 font-sans border border-gray-200 dark:border-gray-800 rounded-xl">
                
                <aside className="hidden lg:flex w-64 flex-col py-4 px-2 border-r border-gray-200 dark:border-gray-800 shrink-0">
                    
                    <div className="mb-6 px-2">
                        <div className="flex items-center justify-between mb-2 px-1">
                            <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">{MONTHS[month]} {year}</h3>
                            <div className="flex gap-1">
                                <button onClick={navPrev} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"><ChevronLeft className="w-4 h-4 text-gray-500" /></button>
                                <button onClick={navNext} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"><ChevronRight className="w-4 h-4 text-gray-500" /></button>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-7 text-center text-[10px] text-gray-500 dark:text-gray-400 mb-1">
                            <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
                        </div>
                        <div className="grid grid-cols-7 text-center text-[10px] gap-y-1 text-gray-700 dark:text-gray-300">
                            {miniCalendarGrid.map((dt, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => dt && setSelectedMiniDate(dt === selectedMiniDate ? null : dt)}
                                    className={`w-6 h-6 flex items-center justify-center rounded-full mx-auto cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all
                                        ${isToday(dt) && selectedMiniDate !== dt ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-semibold' : ''}
                                        ${selectedMiniDate === dt ? 'bg-cyan-700 hover:bg-cyan-800 text-white dark:bg-primary dark:hover:bg-cyan-400 dark:text-black font-bold shadow-md scale-105' : ''}
                                    `}
                                >
                                    {dt}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 px-3 mb-6 text-sm">
                        <User className="w-4 h-4 text-gray-500 border border-gray-300 dark:border-gray-600 rounded-full p-0.5" />
                        <input
                            type="text"
                            placeholder="Pesquisar pessoas"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="bg-transparent outline-none w-full placeholder-gray-500 text-sm"
                        />
                    </div>

                    <div className="space-y-4 text-sm px-1">
                        <div>
                            <div className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800/50 px-2 py-1.5 rounded cursor-pointer mb-2">
                                <h4 className="font-medium text-gray-800 dark:text-gray-200">Profissionais</h4>
                                <ChevronLeft className="w-4 h-4 rotate-90 text-gray-500" />
                            </div>
                            <div className="space-y-3 px-2">
                                {filteredPros.length > 0 ? filteredPros.map((p) => (
                                    <label key={p.id} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={selectedPros.includes(p.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedPros([...selectedPros, p.id]);
                                                else setSelectedPros(selectedPros.filter(x => x !== p.id));
                                            }}
                                            className={`rounded border-gray-400 outline-none w-4 h-4 bg-transparent accent-cyan-600`}
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white">{p.name}</span>
                                    </label>
                                )) : <span className="text-xs text-gray-500">Nenhum profissional encontrado.</span>}
                            </div>
                        </div>
                    </div>
                </aside>

                
                <div className="flex-1 flex flex-col min-w-0">
                    
                    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 shrink-0">
                        <div className="flex items-center gap-4">
                            <button onClick={jumpToToday} className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">Hoje</button>
                            <div className="flex items-center gap-1">
                                <button onClick={navPrev} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" /></button>
                                <button onClick={navNext} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" /></button>
                            </div>
                            {agendaLayout === "calendar" && <h2 className="text-xl font-normal text-gray-800 dark:text-gray-200 ml-2">{headerTitle}</h2>}
                            {agendaLayout === "list" && (
                                <h2 className="text-xl font-normal text-gray-800 dark:text-gray-200 ml-2">
                                    {selectedMiniDate ? `Agendamentos - ${selectedMiniDate} de ${MONTHS[month]}` : "Próximos Agendamentos"}
                                </h2>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            {agendaLayout === "list" && (
                                <div className="hidden sm:flex items-center border border-gray-300 dark:border-gray-600 rounded-md bg-transparent mr-2">
                                    <select
                                        value={listFilter}
                                        onChange={(e) => setListFilter(e.target.value as any)}
                                        className="bg-transparent px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 outline-none focus:bg-white dark:focus:bg-gray-900 cursor-pointer"
                                    >
                                        <option value="Proximos">Próximos</option>
                                        <option value="Todos">Todos</option>
                                    </select>
                                </div>
                            )}
                            {agendaLayout === "calendar" && (
                                <div className="hidden sm:flex items-center border border-gray-300 dark:border-gray-600 rounded-md bg-transparent">
                                    <select
                                        value={viewMode}
                                        onChange={(e) => setViewMode(e.target.value as any)}
                                        className="bg-transparent px-3 py-1.5 text-sm font-medium text-gray-700 outline-none dark:text-gray-300 focus:bg-white dark:focus:bg-gray-900 cursor-pointer"
                                    >
                                        <option value="Mês">Mês</option>
                                        <option value="Semana">Semana</option>
                                        <option value="Dia">Dia</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </header>

                    
                    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#1e1f22]">
                        {agendaLayout === "calendar" ? (
                            <>
                                {viewMode === "Mês" && (
                                    <div className="flex flex-col flex-1 overflow-y-auto relative">
                                        {/* Days Header */}
                                        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800 shrink-0 sticky top-0 bg-white dark:bg-[#1e1f22] z-10">
                                            {WEEKDAYS.map((day, i) => (
                                                <div key={day} className={`flex flex-col items-center justify-center py-2 ${i !== 0 ? 'border-l border-gray-200 dark:border-gray-800' : ''}`}>
                                                    <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">{day}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* 5 Weeks Grid */}
                                        <div className="grid grid-cols-7 flex-1">
                                            {calendarGrid.map((day, i) => {
                                                const dayAppointments = appointments.filter((apt: any) => {
                                                    if (!day.date) return false;
                                                    const aptDate = new Date(apt.date);
                                                    const aptDay = aptDate.getUTCDate();
                                                    const aptMonth = aptDate.getUTCMonth();
                                                    const aptYear = aptDate.getUTCFullYear();

                                                    return (
                                                        aptDay === day.date &&
                                                        aptMonth === month &&
                                                        aptYear === year &&
                                                        (selectedPros.length === 0 || selectedPros.includes(apt.employeeId) || selectedPros.includes(apt.employee?.id) || selectedPros.includes(apt.prof)) &&
                                                        apt.status !== 'CANCELLED' && apt.status !== 'CANCELADO'
                                                    );
                                                });

                                                const dayIsToday = day.date === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

                                                return (
                                                    <div key={i} className={`min-h-[120px] p-1 border-b border-gray-200 dark:border-gray-800 ${i % 7 !== 0 ? 'border-l border-gray-200 dark:border-gray-800' : ''}`}>
                                                        <div className="flex justify-center mb-1">
                                                            <span className={`text-[12px] font-medium w-6 h-6 flex items-center justify-center rounded-full mt-1 ${dayIsToday ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                                                {day.date || ''}
                                                            </span>
                                                        </div>

                                                        <div className="flex flex-col gap-0.5 px-0.5">
                                                            {dayAppointments.map((apt: any) => (
                                                                <div
                                                                    key={apt.id}
                                                                    onClick={() => setSelectedAppointment(apt)}
                                                                    className="flex items-center gap-1.5 px-1 py-0.5 hover:bg-gray-100 dark:hover:bg-gray-800/60 rounded cursor-pointer transition-colors group"
                                                                >
                                                                    <span className={`w-2 h-2 rounded-full shrink-0 ${apt.dot || 'bg-blue-500'}`}></span>
                                                                    <span className={`text-[11px] font-medium truncate ${apt.color || 'text-cyan-700 dark:text-primary'} group-hover:underline`}>
                                                                        <span className="font-semibold text-gray-600 dark:text-gray-400 mr-1">{formatTimeLocal(apt.date)}</span> {apt.service?.name || apt.title || 'Serviço'}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/50 dark:bg-[#1e1f22]">
                                <div className="max-w-4xl mx-auto space-y-6">
                                    {appointments
                                        .filter((apt: any) => {
                                            const isCancelled = apt.status === 'CANCELLED' || apt.status === 'CANCELADO';
                                            if (isCancelled) return false;
                                            const matchesPro = selectedPros.includes(apt.employeeId) || selectedPros.includes(apt.employee?.id) || selectedPros.includes(apt.prof);
                                            if (!matchesPro) return false;
                                            if (selectedMiniDate) {
                                                const aptDate = new Date(apt.date);
                                                const aptDay = aptDate.getUTCDate();
                                                const aptMonth = aptDate.getUTCMonth();
                                                const aptYear = aptDate.getUTCFullYear();
                                                if (aptDay !== selectedMiniDate || aptMonth !== month || aptYear !== year) {
                                                    return false;
                                                }
                                            }
                                            if (selectedMiniDate) {
                                                const aptDate = new Date(apt.date);
                                                const aptDay = aptDate.getUTCDate();
                                                const aptMonth = aptDate.getUTCMonth();
                                                const aptYear = aptDate.getUTCFullYear();
                                                if (aptDay !== selectedMiniDate || aptMonth !== month || aptYear !== year) {
                                                    return false;
                                                }
                                            }
                                            if (listFilter === "Proximos") {
                                                const aptDate = new Date(apt.date);
                                                const now = new Date();
                                                now.setHours(0,0,0,0);
                                                return aptDate >= now;
                                            }
                                            return true;
                                        })
                                        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                        .map((apt: any) => (
                                            <div key={apt.id} className="bg-white dark:bg-[#25262b] border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col sm:flex-row gap-4 sm:items-center justify-between" onClick={() => setSelectedAppointment(apt)}>
                                                <div className="flex items-start sm:items-center gap-4">
                                                    <div className="hidden sm:flex flex-col items-center justify-center w-14 h-14 bg-gray-50 dark:bg-[#1e1f22] rounded-lg border border-gray-100 dark:border-gray-700 shrink-0">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase">{WEEKDAYS[new Date(apt.date).getUTCDay()].replace('.', '')}</span>
                                                        <span className="text-lg font-bold text-gray-900 dark:text-white leading-none mt-0.5">{new Date(apt.date).getUTCDate()}</span>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h3 className="text-base font-bold text-gray-900 dark:text-white">{formatTimeLocal(apt.date)} - {apt.title || 'Serviço'}</h3>
                                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md ${apt.dot.replace('bg-', 'text-').replace('500', '600')} bg-opacity-10 dark:bg-opacity-20 bg-current`}>
                                                                Confirmado
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                                                            <p className="flex items-center gap-1.5">
                                                                <User className="w-3.5 h-3.5" /> Profissional: <span className="font-semibold text-gray-800 dark:text-gray-200">{apt.prof}</span>
                                                            </p>
                                                            {apt.client && (
                                                                <p className="flex items-center gap-1.5">
                                                                    Cliente: <span className="font-semibold text-gray-800 dark:text-gray-200">{apt.client}</span>
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 sm:mt-0 mt-2 sm:border-t-0 border-t border-gray-100 dark:border-gray-800 sm:pt-0 pt-3">
                                                    {apt.phone && (
                                                        <button onClick={(e) => { e.stopPropagation(); window.open(apt.phone, '_blank'); }} className="px-3 py-1.5 text-xs font-semibold bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 rounded-md hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors">
                                                            WhatsApp
                                                        </button>
                                                    )}
                                                    <button className="px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                        Detalhes
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                    {appointments.filter((apt: any) => (selectedPros.includes(apt.employeeId) || selectedPros.includes(apt.employee?.id) || selectedPros.includes(apt.prof))).length === 0 && (
                                        <div className="text-center py-20 text-gray-500">
                                            Nenhum agendamento encontrado para os profissionais selecionados.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                
                {selectedAppointment && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm" onClick={closeModal}>
                        <div
                            className="relative w-full max-w-[420px] bg-white dark:bg-[#111] shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-gray-200 dark:border-gray-800 flex flex-col rounded-3xl overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Action Icons Top Right */}
                            <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                                <button className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-gray-700 dark:text-gray-300 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                <button className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-gray-700 dark:text-gray-300 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                <button className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-gray-700 dark:text-gray-300 transition-colors"><Mail className="w-4 h-4" /></button>
                                <button className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-gray-700 dark:text-gray-300 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                                <button onClick={closeModal} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-gray-700 dark:text-gray-300 transition-colors ml-1"><X className="w-5 h-5" /></button>
                            </div>

                            {/* Decorative Header Banner */}
                            <div className="h-[120px] bg-[#FFF1B8] dark:bg-[#1a1a1a] relative overflow-hidden flex items-end px-6 border-b border-gray-200 dark:border-gray-800/50">
                                {/* Quadro/Espelho Esquerda */}
                                <div className="absolute bottom-0 left-8 w-24 h-20 bg-[#FFE59E] dark:bg-[#2c2d31] rounded-t-xl border border-[#DCC78A] dark:border-gray-700/50">
                                    <div className="absolute -top-1 left-3 w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>
                                    <div className="absolute -top-1 right-3 w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>
                                </div>
                                
                                {/* Quadro/Espelho Direita */}
                                <div className="absolute bottom-0 right-16 w-36 h-24 bg-[#FFE59E] dark:bg-[#2c2d31] rounded-t-xl border border-[#DCC78A] dark:border-gray-700/50">
                                    <div className="absolute -top-1 left-4 w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>
                                    <div className="absolute -top-1 right-4 w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>
                                </div>

                                {/* Utensílios de Salão Vetoriais */}
                                {/* Máquina de Corte */}
                                <div className="absolute bottom-0 left-12 w-6 h-14 bg-[#1E1A35] rounded-t flex flex-col items-center">
                                    <div className="w-5 h-2 bg-[#6444B8] rounded mt-1"></div>
                                    <div className="w-1 h-4 bg-white/30 mt-1.5 rounded-full"></div>
                                </div>

                                {/* Borrifador Rosa */}
                                <div className="absolute bottom-0 left-24 w-10 h-14 bg-[#FFBADB] dark:bg-[#a64e72] rounded-lg flex flex-col items-center">
                                    <div className="absolute -top-3 w-4 h-4 bg-[#7BCBE6] rounded"></div>
                                    <div className="absolute -top-4 left-6 w-3 h-1 bg-[#1E1A35]"></div>
                                    <div className="w-4 h-1 bg-[#1E1A35] mt-1"></div>
                                </div>

                                {/* Copo de Tesoura e Pente */}
                                <div className="absolute bottom-0 right-32 w-11 h-12 bg-white/40 dark:bg-white/10 backdrop-blur-sm border border-white/30 rounded-t-md flex items-end">
                                    {/* Tesoura Rosa */}
                                    <div className="absolute bottom-5 left-1 w-7 h-12 border-2 border-[#FA97CF] rounded-full transform -rotate-12"></div>
                                    {/* Pente Roxo */}
                                    <div className="absolute bottom-2 right-2 w-2 h-16 bg-[#50458C] rounded-sm"></div>
                                </div>
                            </div>
                                

                            <div className="p-6">
                                <div className="flex gap-4">
                                    <div className={`mt-1.5 w-4 h-4 rounded-sm shrink-0 ${selectedAppointment?.dot || 'bg-gray-500'}`}></div>
                                    <div className="flex-1">
                                        <h2 className="text-[22px] font-normal text-gray-900 dark:text-gray-100 leading-tight">
                                            {selectedAppointment?.title || 'Agendamento'}
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {selectedAppointment?.year !== undefined && selectedAppointment?.month !== undefined && selectedAppointment?.date !== undefined ? (
                                                `${WEEKDAYS[new Date(selectedAppointment.year, selectedAppointment.month, selectedAppointment.date).getDay()]}, ${selectedAppointment.date} de ${MONTHS[selectedAppointment.month].toLowerCase()}`
                                            ) : 'Data não informada'} • {formatTimeLocal(selectedAppointment?.date)} – {formatEndTimeLocal(selectedAppointment?.date)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-6">
                                    <Menu className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                    <div className="flex-1 text-sm text-gray-800 dark:text-gray-300 leading-relaxed font-sans">
                                        <div className="space-y-1">
                                            {selectedAppointment?.client && <p><span className="font-semibold text-gray-500 dark:text-gray-400">Cliente:</span> {selectedAppointment.client}</p>}
                                            {selectedAppointment?.prof && <p><span className="font-semibold text-gray-500 dark:text-gray-400">Profissional:</span> {selectedAppointment.prof}</p>}
                                            <p><span className="font-semibold text-gray-500 dark:text-gray-400">Procedimento:</span> {selectedAppointment?.service?.name || selectedAppointment?.title?.split('-')[0]?.trim() || 'Desconhecido'}</p>
                                        </div>

                                        {selectedAppointment?.desc && (
                                            <p className="mt-3 text-gray-500 dark:text-gray-400">{selectedAppointment.desc}</p>
                                        )}

                                        {selectedAppointment?.clientNote && (
                                            <div className="mt-4 bg-gray-50 dark:bg-gray-800/40 rounded-lg p-3 border border-gray-200 dark:border-gray-800 relative">
                                                <div className="absolute -left-2 top-4 w-4 h-4 bg-gray-50 dark:bg-gray-800/40 border-t border-l border-gray-200 dark:border-gray-800 transform -rotate-45"></div>
                                                <p className="text-sm italic text-gray-700 dark:text-gray-300 relative z-10">"${selectedAppointment.clientNote}"</p>
                                            </div>
                                        )}

                                        {selectedAppointment?.phone && (
                                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Telefone do cliente: {selectedAppointment.phone}</p>
                                                <a href={`https://wa.me/${selectedAppointment.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors rounded-lg font-medium text-xs shadow-sm border border-[#25D366]/20">
                                                    WhatsApp
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-6 items-center text-sm text-gray-700 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-800/50">
                                    <CalendarIcon className="w-5 h-5 text-gray-400 shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-200">Agenda_{selectedAppointment?.prof || 'Geral'}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">Criado por: EFF5 Automação Inteligente EFF5 AI</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}