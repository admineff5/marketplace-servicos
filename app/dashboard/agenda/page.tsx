"use client";
import { useState, useEffect } from "react";
import { Plus, ChevronLeft, ChevronRight, X, User, Edit2, Trash2, Mail, MoreVertical, Calendar as CalendarIcon, Clock, Menu, LayoutList } from "lucide-react";

const WEEKDAYS = ["DOM.", "SEG.", "TER.", "QUA.", "QUI.", "SEX.", "SÁB."];
const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

export default function AgendaPage() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [professionals, setProfessionals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
    const [viewMode, setViewMode] = useState<"Mês" | "Semana" | "Dia">("Mês");
    const [agendaLayout, setAgendaLayout] = useState<"calendar" | "list">("calendar");
    const [selectedPros, setSelectedPros] = useState<string[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState("");

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
            const apptRes = await fetch(`/api/appointments?date=${dateStr}`);
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

                {/* Top Action Bar Outside Agenda UI */}
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
                {/* Sidebar Google Calendar Style */}
                <aside className="hidden lg:flex w-64 flex-col py-4 px-2 border-r border-gray-200 dark:border-gray-800 shrink-0">
                    {/* Mini Calendar Mock */}
                    <div className="mb-6 px-2">
                        <div className="flex items-center justify-between mb-2 px-1">
                            <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">{MONTHS[month]} {year}</h3>
                            <div className="flex gap-1">
                                <button onClick={navPrev} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"><ChevronLeft className="w-4 h-4 text-gray-500" /></button>
                                <button onClick={navNext} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"><ChevronRight className="w-4 h-4 text-gray-500" /></button>
                            </div>
                        </div>
                        {/* Fake mini grid */}
                        <div className="grid grid-cols-7 text-center text-[10px] text-gray-500 dark:text-gray-400 mb-1">
                            <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
                        </div>
                        <div className="grid grid-cols-7 text-center text-[10px] gap-y-1 text-gray-700 dark:text-gray-300">
                            {miniCalendarGrid.map((dt, i) => (
                                <div key={i} className={`w-6 h-6 flex items-center justify-center rounded-full mx-auto cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${isToday(dt) ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold' : ''}`}>
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

                {/* Main Calendar View */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header Top Bar */}
                    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 shrink-0">
                        <div className="flex items-center gap-4">
                            <button onClick={jumpToToday} className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">Hoje</button>
                            <div className="flex items-center gap-1">
                                <button onClick={navPrev} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" /></button>
                                <button onClick={navNext} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" /></button>
                            </div>
                            {agendaLayout === "calendar" && <h2 className="text-xl font-normal text-gray-800 dark:text-gray-200 ml-2">{headerTitle}</h2>}
                            {agendaLayout === "list" && <h2 className="text-xl font-normal text-gray-800 dark:text-gray-200 ml-2">Próximos Agendamentos</h2>}
                        </div>
                        <div className="flex items-center gap-4">
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

                    {/* Grid Container */}
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
                                                    const aptDate = new Date(apt.date);
                                                    return (
                                                        aptDate.getUTCDate() === currentDate.getDate() &&
                                                        aptDate.getUTCMonth() === currentDate.getMonth() &&
                                                        aptDate.getUTCFullYear() === currentDate.getFullYear() &&
                                                        (selectedPros.includes(apt.employeeId) || selectedPros.includes(apt.employee?.id) || selectedPros.includes(apt.prof)) &&
                                                        apt.status !== 'CANCELLED' && apt.status !== 'CANCELADO'
                                                    );
                                                }).map((apt: any, idx: any) => {
                                                    const parseTime = (timeStr: string) => {
                                                        const time = timeStr.toLowerCase();
                                                        let [h, m] = time.replace(/[am|pm]/g, '').split(':').map(Number);
                                                        if (isNaN(m)) m = 0;
                                                        if (time.includes('pm') && h < 12) h += 12;
                                                        if (time.includes('am') && h === 12) h = 0;
                                                        return h + m / 60;
                                                    };

                                                    const startTime = parseTime(apt.start);
                                                    const topOffset = (startTime - 7) * 96; // (hour - startHour) * hourHeight (24*4 = 96 approx)

                                                    if (startTime < 7 || startTime > 22) return null;

                                                    return (
                                                        <div
                                                            key={apt.id}
                                                            onClick={() => setSelectedAppointment(apt)}
                                                            className={`absolute left-[5%] w-[90%] rounded-md border-l-[6px] p-3 text-sm shadow-md cursor-pointer hover:brightness-110 overflow-hidden apt.dot bg-white dark:bg-gray-800 ${apt.color}`}
                                                            style={{ top: `${topOffset}px`, height: '76px' }}
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <p className="font-semibold text-gray-900 dark:text-gray-100">apt.title || 'Serviço'</p>
                                                                <span className="text-xs font-bold bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{apt.start} - {apt.end}</span>
                                                            </div>
                                                            <p className="mt-1 text-gray-600 dark:text-gray-400">Profissional: <span className="font-semibold">{apt.prof}</span></p>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/50 dark:bg-[#1e1f22]">
                                <div className="max-w-4xl mx-auto space-y-6">
                                    {appointments
                                        .filter((apt: any) => (selectedPros.includes(apt.employeeId) || selectedPros.includes(apt.employee?.id) || selectedPros.includes(apt.prof)))
                                        // Normally you'd sort by real date here. Just putting them in a fake order based on mock data.
                                        .sort((a: any, b: any) => a.date - b.date)
                                        .map((apt: any) => (
                                            <div key={apt.id} className="bg-white dark:bg-[#25262b] border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col sm:flex-row gap-4 sm:items-center justify-between" onClick={() => setSelectedAppointment(apt)}>
                                                <div className="flex items-start sm:items-center gap-4">
                                                    <div className="hidden sm:flex flex-col items-center justify-center w-14 h-14 bg-gray-50 dark:bg-[#1e1f22] rounded-lg border border-gray-100 dark:border-gray-700 shrink-0">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase">{WEEKDAYS[new Date(apt.year, apt.month, apt.date).getDay()].replace('.', '')}</span>
                                                        <span className="text-lg font-bold text-gray-900 dark:text-white leading-none mt-0.5">{apt.date}</span>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h3 className="text-base font-bold text-gray-900 dark:text-white">{apt.start} - apt.title || 'Serviço'</h3>
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

                {/* Appointment Detail Modal Overlay */}
                {selectedAppointment && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm" onClick={closeModal}>
                        <div
                            className="relative w-full max-w-[420px] bg-white dark:bg-[#313338] shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-gray-200 dark:border-gray-700 flex flex-col rounded-2xl overflow-hidden"
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
                            <div className="h-[120px] bg-[#FDE29F] relative overflow-hidden flex items-end px-6">
                                <div className="absolute bottom-0 left-8 w-12 h-16 bg-[#E6D19C] rounded-t-md"></div>
                                <div className="absolute bottom-6 left-[38px] w-8 h-10 bg-white rounded-md"></div>
                                <div className="absolute bottom-0 right-16 w-16 h-20 bg-[#FFA5DA] rounded-t-lg"></div>
                                <div className="absolute bottom-10 right-20 w-8 h-12 bg-white/40 rounded-sm"></div>
                            </div>

                            <div className="p-6">
                                <div className="flex gap-4">
                                    <div className={`mt-1.5 w-4 h-4 rounded-sm shrink-0 ${selectedAppointment?.dot || 'bg-gray-500'}`}></div>
                                    <div>
                                        <h2 className="text-[22px] font-normal text-gray-900 dark:text-gray-100 leading-tight">
                                            {selectedAppointment?.title}
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {WEEKDAYS[new Date(selectedAppointment.year, selectedAppointment.month, selectedAppointment.date).getDay()]}, {selectedAppointment?.date} de {MONTHS[selectedAppointment.month].toLowerCase()} • {selectedAppointment?.start} – {selectedAppointment?.end}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-6">
                                    <Menu className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                                    <div className="flex-1 text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-sans">
                                        <div className="space-y-1">
                                            {selectedAppointment?.client && <p><span className="font-semibold">Cliente:</span> {selectedAppointment.client}</p>}
                                            {selectedAppointment?.prof && <p><span className="font-semibold">Profissional:</span> {selectedAppointment.prof}</p>}
                                            <p><span className="font-semibold">Procedimento:</span> {selectedAppointment?.title?.split('-')[0]?.trim() || ''}</p>
                                        </div>

                                        {selectedAppointment?.desc && (
                                            <p className="mt-3 text-gray-500">{selectedAppointment.desc}</p>
                                        )}

                                        {selectedAppointment?.clientNote && (
                                            <div className="mt-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700 relative">
                                                <div className="absolute -left-2 top-4 w-4 h-4 bg-gray-50 dark:bg-gray-800/50 border-t border-l border-gray-200 dark:border-gray-700 transform -rotate-45"></div>
                                                <p className="text-sm italic text-gray-700 dark:text-gray-300 relative z-10">"{selectedAppointment.clientNote}"</p>
                                            </div>
                                        )}

                                        {selectedAppointment?.phone && (
                                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                                <p className="text-xs text-gray-500 mb-2">Entre em contato direto pelo WhatsApp para responder ou confirmar detalhes:</p>
                                                <a href={selectedAppointment.phone} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors rounded-lg font-medium text-sm shadow-sm">
                                                    Conversar no WhatsApp
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-6 items-center text-sm text-gray-700 dark:text-gray-300">
                                    <CalendarIcon className="w-5 h-5 text-gray-500 shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-200">Agenda_{selectedAppointment.prof}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Criado por: EFF5 Automação Inteligente EFF5 AI</p>
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
