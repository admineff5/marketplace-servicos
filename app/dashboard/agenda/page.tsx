"use client";

import { useState } from "react";
import { Plus, ChevronLeft, ChevronRight, X, User, Edit2, Trash2, Mail, MoreVertical, Calendar as CalendarIcon, Clock, Menu, LayoutList } from "lucide-react";

// Mock Data
const MOCK_APPOINTMENTS = [
    { id: 1, date: 2, month: 1, year: 2026, title: "corte de cabelo - Rodrigo", start: "9am", end: "10am", color: "text-blue-500 dark:text-gray-300", dot: "bg-blue-500", prof: "Rodrigo", client: "Thiago", phone: "https://wa.me/5527992661278", desc: "reagendado pela IA." },
    { id: 2, date: 2, month: 1, year: 2026, title: "Corte de cabelo - Rodrigo", start: "10am", end: "11am", color: "text-blue-500 dark:text-gray-300", dot: "bg-blue-500", prof: "Rodrigo" },
    { id: 3, date: 2, month: 1, year: 2026, title: "corte de cabelo - Rodrigo", start: "2pm", end: "3pm", color: "text-purple-500 dark:text-gray-300", dot: "bg-purple-500", prof: "Rodrigo" },
    { id: 4, date: 2, month: 1, year: 2026, title: "Corte de cabelo - Rodrigo", start: "2pm", end: "3pm", color: "text-pink-500 dark:text-gray-300", dot: "bg-pink-500", prof: "Rodrigo" },
    { id: 5, date: 3, month: 1, year: 2026, title: "Corte de cabelo - Rodrigo", start: "10am", end: "11am", color: "text-green-500 dark:text-gray-300", dot: "bg-green-500", prof: "Rodrigo" },
    { id: 6, date: 4, month: 1, year: 2026, title: "corte de barba - Thiago", start: "9:40am", end: "10:10am", color: "text-purple-500 dark:text-gray-300", dot: "bg-purple-500", prof: "Thiago" },
    { id: 7, date: 4, month: 1, year: 2026, title: "Corte de barba - Rodrigo", start: "1:05pm", end: "1:40pm", color: "text-blue-500 dark:text-gray-300", dot: "bg-blue-500", prof: "Rodrigo" },
    { id: 8, date: 9, month: 1, year: 2026, title: "Corte de cabelo - Thiago", start: "10am", end: "11am", color: "text-green-500 dark:text-gray-300", dot: "bg-green-500", prof: "Thiago", client: "Rodrigo", phone: "https://wa.me/5527992661278", desc: "reagendado pela IA." },
    { id: 9, date: 9, month: 1, year: 2026, title: "corte de cabelo - Rodrigo", start: "4pm", end: "5pm", color: "text-purple-500 dark:text-gray-300", dot: "bg-purple-500", prof: "Rodrigo" },
    { id: 10, date: 13, month: 1, year: 2026, title: "corte de cabelo - Thiago", start: "11am", end: "12pm", color: "text-yellow-500 dark:text-gray-300", dot: "bg-yellow-500", prof: "Thiago" },
    { id: 11, date: 21, month: 1, year: 2026, title: "corte de cabelo - Rodrigo", start: "9am", end: "10am", color: "text-purple-500 dark:text-gray-300", dot: "bg-purple-500", prof: "Rodrigo" },
];

const WEEKDAYS = ["DOM.", "SEG.", "TER.", "QUA.", "QUI.", "SEX.", "SÁB."];
const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const ALL_PROS = ["Rodrigo", "Thiago"];

export default function AgendaPage() {
    const [selectedAppointment, setSelectedAppointment] = useState<typeof MOCK_APPOINTMENTS[0] | null>(null);
    const [viewMode, setViewMode] = useState<"Mês" | "Semana" | "Dia">("Mês");
    const [agendaLayout, setAgendaLayout] = useState<"calendar" | "list">("calendar");
    const [selectedPros, setSelectedPros] = useState<string[]>(["Rodrigo", "Thiago"]);
    const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 9)); // Start pointing at mock day
    const [searchQuery, setSearchQuery] = useState("");

    const closeModal = () => setSelectedAppointment(null);

    const filteredPros = ALL_PROS.filter(p => p.toLowerCase().includes(searchQuery.toLowerCase()));

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

    const jumpToToday = () => setCurrentDate(new Date(2026, 1, 9)); // Mock today Date

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

    const todayDate = new Date(2026, 1, 9); // mock today
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
            {/* Top Action Bar Outside Agenda UI */}
            <div className="flex justify-end shrink-0">
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
                                    <label key={p} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={selectedPros.includes(p)}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedPros([...selectedPros, p]);
                                                else setSelectedPros(selectedPros.filter(x => x !== p));
                                            }}
                                            className={`rounded border-gray-400 outline-none w-4 h-4 bg-transparent ${p === 'Rodrigo' ? 'text-green-500 accent-green-600' : 'text-purple-500 accent-purple-500'}`}
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white">{p}</span>
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
                                                const dayAppointments = MOCK_APPOINTMENTS.filter(apt => apt.date === day.date && apt.month === month && apt.year === year && selectedPros.includes(apt.prof));
                                                const dayIsToday = isToday(day.date);

                                                return (
                                                    <div key={i} className={`min-h-[120px] p-1 border-b border-gray-200 dark:border-gray-800 ${i % 7 !== 0 ? 'border-l border-gray-200 dark:border-gray-800' : ''}`}>
                                                        <div className="flex justify-center mb-1">
                                                            <span className={`text-[12px] font-medium w-6 h-6 flex items-center justify-center rounded-full mt-1 ${dayIsToday ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                                                {day.date || ''}
                                                            </span>
                                                        </div>

                                                        <div className="flex flex-col gap-0.5 px-0.5">
                                                            {dayAppointments.map(apt => (
                                                                <div
                                                                    key={apt.id}
                                                                    onClick={() => setSelectedAppointment(apt)}
                                                                    className="flex items-center gap-1.5 px-1 py-0.5 hover:bg-gray-100 dark:hover:bg-gray-800/60 rounded cursor-pointer transition-colors group"
                                                                >
                                                                    <span className={`w-2 h-2 rounded-full shrink-0 ${apt.dot}`}></span>
                                                                    <span className={`text-[11px] font-medium truncate ${apt.color} group-hover:underline`}>
                                                                        <span className="font-semibold text-gray-600 dark:text-gray-400 mr-1">{apt.start}</span> {apt.title.split('-')[0].trim()}
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

                                {viewMode === "Semana" && (
                                    <div className="flex flex-1 overflow-y-auto relative">
                                        {/* Time Column */}
                                        <div className="w-16 shrink-0 border-r border-gray-200 dark:border-gray-800 flex flex-col">
                                            {Array.from({ length: 24 }).map((_, i) => (
                                                <div key={i} className="h-16 border-b border-gray-100 dark:border-gray-800/50 flex items-start justify-end pr-2 py-1">
                                                    <span className="text-[10px] text-gray-400">{i}:00</span>
                                                </div>
                                            ))}
                                        </div>
                                        {/* 7 Days Columns */}
                                        <div className="flex-1 grid grid-cols-7">
                                            {WEEKDAYS.map((dayName, i) => {
                                                const colDate = new Date(weekStart);
                                                colDate.setDate(weekStart.getDate() + i);
                                                const cDate = colDate.getDate();
                                                const cMon = colDate.getMonth();
                                                const cYear = colDate.getFullYear();
                                                const isColToday = cDate === todayDate.getDate() && cMon === todayDate.getMonth() && cYear === todayDate.getFullYear();
                                                const colApts = MOCK_APPOINTMENTS.filter(a => a.date === cDate && a.month === cMon && a.year === cYear && selectedPros.includes(a.prof));

                                                return (
                                                    <div key={i} className={`relative border-r border-gray-200 dark:border-gray-800 ${isColToday ? 'bg-blue-50/10 dark:bg-blue-900/5' : ''}`}>
                                                        {/* Sticky Header */}
                                                        <div className="sticky flex top-0 z-10 bg-white/90 dark:bg-[#1e1f22]/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 flex-col items-center py-2 h-14">
                                                            <span className={`text-[11px] font-medium uppercase ${isColToday ? 'text-blue-600' : 'text-gray-500'}`}>{dayName}</span>
                                                            <span className={`text-lg transition-colors w-8 h-8 flex items-center justify-center rounded-full ${isColToday ? 'bg-blue-600 text-white font-normal' : 'text-gray-700 dark:text-gray-300'}`}>{cDate}</span>
                                                        </div>
                                                        {/* Hour Slots */}
                                                        <div className="relative">
                                                            {Array.from({ length: 24 }).map((_, h) => (
                                                                <div key={h} className="h-16 border-b border-gray-100 dark:border-gray-800/50 w-full hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer"></div>
                                                            ))}

                                                            {colApts.map(apt => {
                                                                const hourStart = parseInt(apt.start.replace(/\D/g, ''));
                                                                const topOffset = (hourStart < 7 ? hourStart + 12 : hourStart) * 64;

                                                                return (
                                                                    <div
                                                                        key={apt.id}
                                                                        onClick={() => setSelectedAppointment(apt)}
                                                                        className={`absolute left-1 right-1 rounded border-l-4 p-1.5 text-xs shadow-sm cursor-pointer hover:brightness-110 overflow-hidden ${apt.dot.replace('bg-', 'border-').replace('500', '600')} bg-white dark:bg-gray-800 ${apt.color}`}
                                                                        style={{ top: `${topOffset}px`, height: '60px' }}
                                                                    >
                                                                        <p className="font-semibold truncate">{apt.start} - {apt.end}</p>
                                                                        <p className="truncate text-gray-700 dark:text-gray-300">{apt.title.split('-')[0].trim()}</p>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {viewMode === "Dia" && (
                                    <div className="flex flex-1 overflow-y-auto relative">
                                        {/* Time Column */}
                                        <div className="w-16 shrink-0 border-r border-gray-200 dark:border-gray-800 flex flex-col">
                                            {Array.from({ length: 24 }).map((_, i) => (
                                                <div key={i} className="h-20 border-b border-gray-100 dark:border-gray-800/50 flex items-start justify-end pr-2 py-1">
                                                    <span className="text-[10px] text-gray-400">{i}:00</span>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Single Day Column */}
                                        <div className="flex-1 relative bg-blue-50/10 dark:bg-blue-900/5">
                                            <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#1e1f22]/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 flex flex-col items-center py-2">
                                                <span className="text-[11px] font-medium uppercase text-blue-600">{WEEKDAYS[currentDate.getDay()]}</span>
                                                <span className="text-2xl mt-1 w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-normal">{currentDate.getDate()}</span>
                                            </div>
                                            <div className="relative">
                                                {Array.from({ length: 24 }).map((_, h) => (
                                                    <div key={h} className="h-20 border-b border-gray-100 dark:border-gray-800/50 w-full hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer"></div>
                                                ))}
                                                {MOCK_APPOINTMENTS.filter(a => a.date === currentDate.getDate() && a.month === currentDate.getMonth() && a.year === currentDate.getFullYear() && selectedPros.includes(a.prof)).map((apt, idx) => {
                                                    const hourStart = parseInt(apt.start.replace(/\D/g, ''));
                                                    const topOffset = (hourStart < 7 ? hourStart + 12 : hourStart) * 80;
                                                    return (
                                                        <div
                                                            key={apt.id}
                                                            onClick={() => setSelectedAppointment(apt)}
                                                            className={`absolute left-[5%] w-[90%] rounded-md border-l-[6px] p-3 text-sm shadow-md cursor-pointer hover:brightness-110 overflow-hidden ${apt.dot.replace('bg-', 'border-').replace('500', '600')} bg-white dark:bg-gray-800 ${apt.color}`}
                                                            style={{ top: `${topOffset}px`, height: '76px' }}
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <p className="font-semibold text-gray-900 dark:text-gray-100">{apt.title.split('-')[0].trim()}</p>
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
                                    {MOCK_APPOINTMENTS
                                        .filter(apt => selectedPros.includes(apt.prof))
                                        // Normally you'd sort by real date here. Just putting them in a fake order based on mock data.
                                        .sort((a, b) => a.date - b.date)
                                        .map(apt => (
                                            <div key={apt.id} className="bg-white dark:bg-[#25262b] border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col sm:flex-row gap-4 sm:items-center justify-between" onClick={() => setSelectedAppointment(apt)}>
                                                <div className="flex items-start sm:items-center gap-4">
                                                    <div className="hidden sm:flex flex-col items-center justify-center w-14 h-14 bg-gray-50 dark:bg-[#1e1f22] rounded-lg border border-gray-100 dark:border-gray-700 shrink-0">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase">{WEEKDAYS[new Date(apt.year, apt.month, apt.date).getDay()].replace('.', '')}</span>
                                                        <span className="text-lg font-bold text-gray-900 dark:text-white leading-none mt-0.5">{apt.date}</span>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h3 className="text-base font-bold text-gray-900 dark:text-white">{apt.start} - {apt.title.split('-')[0].trim()}</h3>
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

                                    {MOCK_APPOINTMENTS.filter(apt => selectedPros.includes(apt.prof)).length === 0 && (
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
                                    <div className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-sans">
                                        {selectedAppointment?.client && <p>Cliente: {selectedAppointment.client}</p>}
                                        {selectedAppointment?.prof && <p>Agendamento para o profissional: {selectedAppointment.prof}</p>}
                                        {selectedAppointment?.phone && (
                                            <p>
                                                Telefone do cliente: <a href={selectedAppointment.phone} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{selectedAppointment.phone}</a>
                                            </p>
                                        )}
                                        <p>Procedimento a ser realizado: {selectedAppointment?.title?.split('-')[0]?.trim() || ''}</p>

                                        {selectedAppointment?.desc && (
                                            <p className="mt-4">{selectedAppointment.desc}</p>
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
