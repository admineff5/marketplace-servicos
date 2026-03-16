"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../components/ThemeToggle";
import { Footer } from "../components/Footer";
import {
    BarChart3,
    Calendar,
    Users,
    UserSquare2,
    Scissors,
    Package,
    Settings,
    ListTodo,
    Building,
    LogOut,
    Bell,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    SearchCheck,
    CalendarOff,
    Target,
    FileText,
    Globe
} from "lucide-react";

const SIDEBAR_LINKS = [
    { name: "Visão Geral", href: "/dashboard", icon: BarChart3 },
    { name: "Agenda", href: "/dashboard/agenda", icon: Calendar },
    { name: "Tarefas", href: "/dashboard/tarefas", icon: ListTodo },
    { name: "Consulta Agendamentos", href: "/dashboard/consulta", icon: SearchCheck },
    { name: "Feriados / Ausências", href: "/dashboard/bloqueios", icon: CalendarOff },
    { name: "Leads", href: "/dashboard/leads", icon: Target },
    { name: "Clientes", href: "/dashboard/clientes", icon: Users },
    { name: "Profissionais", href: "/dashboard/profissionais", icon: UserSquare2 },
    { name: "Serviços", href: "/dashboard/servicos", icon: Scissors },
    { name: "Produtos", href: "/dashboard/produtos", icon: Package },
    { name: "Relatórios", href: "/dashboard/relatorios", icon: FileText },
    { name: "Perfil da Loja", href: "/dashboard/config", icon: Building },
];

// Notifications and Profile moved to dynamic fetch via API

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    
    const [profile, setProfile] = useState<any>(null);
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        // Fetch Profile
        fetch("/api/dashboard/profile")
            .then(res => res.json())
            .then(data => {
                if (!data.error) setProfile(data);
            });

        // Fetch Notifications
        fetch("/api/dashboard/notifications")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setNotifications(data);
            });
    }, []);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-[#0a0a0a] overflow-hidden">

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar (Desktop & Mobile) */}
            <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-[#111] border-r border-gray-200 dark:border-gray-800 transition-all duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} w-72 ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}>
                <div className={`h-16 flex items-center border-b border-gray-100 dark:border-gray-800 relative ${isCollapsed ? 'md:justify-center px-6 md:px-0' : 'px-6 justify-between'}`}>
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <Image src="/logo-icon.png" alt="Logo" width={28} height={28} className="object-contain" />
                        <span className={`font-bold text-gray-900 dark:text-white tracking-tight ${isCollapsed ? 'md:hidden' : ''}`}>Painel Parceiro</span>
                    </Link>

                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`absolute -right-3 top-1/2 -translate-y-1/2 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-full p-1 text-gray-500 hover:text-cyan-700 dark:hover:text-primary hover:border-cyan-600 dark:hover:border-primary transition-colors ${isCollapsed ? 'hidden' : 'flex'}`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    {isCollapsed && (
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-full p-1 text-gray-500 hover:text-cyan-700 dark:hover:text-primary hover:border-cyan-600 dark:hover:border-primary transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
                    {SIDEBAR_LINKS.map((link) => {
                        const isActive = link.href === "/dashboard"
                            ? pathname === "/dashboard"
                            : pathname?.startsWith(link.href);

                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 py-2.5 rounded-xl text-sm font-medium transition-colors group ${isCollapsed ? 'md:justify-center md:px-0 px-3' : 'px-3'} ${isActive ? 'bg-gray-100 dark:bg-primary/10 text-gray-900 dark:text-primary shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-gray-800'}`}
                                title={isCollapsed ? link.name : undefined}
                            >
                                <link.icon className={`w-5 h-5 transition-opacity shrink-0 ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`} />
                                <span className={`${isCollapsed ? 'md:hidden' : ''}`}>{link.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-1">
                    <Link
                        href="/"
                        className={`w-full flex items-center gap-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors ${isCollapsed ? 'md:justify-center md:px-0 px-3' : 'px-3'}`}
                        title={isCollapsed ? "Voltar ao Site" : undefined}
                    >
                        <Globe className="w-5 h-5 shrink-0" />
                        <span className={`${isCollapsed ? 'md:hidden' : ''}`}>Voltar ao Site</span>
                    </Link>
                    <button
                        onClick={async () => {
                            await fetch("/api/auth/logout", { method: "POST" });
                            window.location.href = "/";
                        }}
                        className={`w-full flex items-center gap-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors ${isCollapsed ? 'md:justify-center md:px-0 px-3' : 'px-3'}`}
                        title={isCollapsed ? "Sair da Conta" : undefined}
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        <span className={`${isCollapsed ? 'md:hidden' : ''}`}>Sair da Conta</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-[#111] border-b border-gray-200 dark:border-gray-800 z-10 transition-colors">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:block truncate max-w-[200px] sm:max-w-none">
                            {profile?.name || "Carregando..."}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className={`relative p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isNotificationsOpen ? 'text-cyan-700 dark:text-primary bg-gray-100 dark:bg-gray-800' : 'text-gray-500 dark:text-gray-400'}`}
                            >
                                <Bell className="w-5 h-5" />
                                {notifications.length > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#111]"></span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {isNotificationsOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsNotificationsOpen(false)} />
                                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-[#161618]">
                                            <h3 className="font-bold text-gray-900 dark:text-white">Notificações</h3>
                                            {notifications.length > 0 && (
                                                <span className="text-[10px] font-bold bg-primary text-black px-2 py-0.5 rounded-full uppercase tracking-wider">{notifications.length} Novas</span>
                                            )}
                                        </div>
                                        <div className="max-h-[70vh] overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map((notif) => (
                                                    <div key={notif.id} className="p-4 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${notif.type === 'error' ? 'text-red-500' : notif.type === 'warning' ? 'text-amber-500' : 'text-cyan-600 dark:text-primary'}`}>
                                                                {notif.title}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400">{notif.time}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-snug group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                                            {notif.description}
                                                        </p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center text-gray-500 text-sm">
                                                    Nenhuma notificação por enquanto.
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => {
                                                setIsNotificationsOpen(false);
                                                window.location.href = '/dashboard/relatorios';
                                            }}
                                            className="w-full py-3 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-cyan-700 dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-all border-t border-gray-100 dark:border-gray-800 uppercase tracking-widest"
                                        >
                                            Ver Tudo
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-800"></div>
                        <ThemeToggle />
                        <Link href="/dashboard/config" className="flex items-center gap-2 pl-2">
                            <div className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                {profile?.imageUrl ? (
                                    <img src={profile.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <UserSquare2 className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                                Perfil
                            </span>
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-[#0a0a0a] flex flex-col">
                    <div className="flex-1 p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                    <Footer />
                </main>
            </div>
        </div>
    );
}
