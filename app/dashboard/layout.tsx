"use client";

import { useState } from "react";
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
    LogOut,
    Bell,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    SearchCheck,
    CalendarOff,
    Target,
    FileText
} from "lucide-react";

const SIDEBAR_LINKS = [
    { name: "Visão Geral", href: "/dashboard", icon: BarChart3 },
    { name: "Agenda", href: "/dashboard/agenda", icon: Calendar },
    { name: "Consulta Agendamentos", href: "/dashboard/consulta", icon: SearchCheck },
    { name: "Feriados / Ausências", href: "/dashboard/bloqueios", icon: CalendarOff },
    { name: "Leads", href: "/dashboard/leads", icon: Target },
    { name: "Clientes", href: "/dashboard/clientes", icon: Users },
    { name: "Profissionais", href: "/dashboard/profissionais", icon: UserSquare2 },
    { name: "Serviços", href: "/dashboard/servicos", icon: Scissors },
    { name: "Produtos", href: "/dashboard/produtos", icon: Package },
    { name: "Relatórios", href: "/dashboard/relatorios", icon: FileText },
    { name: "Configurações", href: "/dashboard/config", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                        <Image src="/logo icon.png" alt="Logo" width={28} height={28} className="object-contain" />
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
                        className={`absolute -right-3 top-1/2 -translate-y-1/2 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-full p-1 text-gray-500 hover:text-cyan-700 dark:hover:text-primary hover:border-primary transition-colors ${isCollapsed ? 'hidden' : 'flex'}`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    {isCollapsed && (
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-full p-1 text-gray-500 hover:text-cyan-700 dark:hover:text-primary hover:border-primary transition-colors"
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

                <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                    <Link
                        href="/"
                        className={`flex items-center gap-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors ${isCollapsed ? 'md:justify-center md:px-0 px-3' : 'px-3'}`}
                        title={isCollapsed ? "Sair da Conta" : undefined}
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        <span className={`${isCollapsed ? 'md:hidden' : ''}`}>Sair da Conta</span>
                    </Link>
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
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:block">
                            Barbearia do João
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#111]"></span>
                        </button>
                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-800"></div>
                        <ThemeToggle />
                        <div className="flex items-center gap-2 pl-2 cursor-pointer">
                            <div className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <Image src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=60" alt="Avatar" width={32} height={32} />
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">João S.</span>
                        </div>
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
