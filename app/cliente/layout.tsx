"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "../components/ThemeToggle";
import { Footer } from "../components/Footer";
import { LogOut, User, Calendar, Globe, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

const CLIENT_LINKS = [
    { name: "Meus Agendamentos", href: "/cliente", icon: Calendar },
    { name: "Meu Perfil", href: "/cliente/perfil", icon: User },
];

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        fetch("/api/auth/session")
            .then(res => res.json())
            .then(data => {
                if (data.authenticated) setSession(data.user);
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

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-[#111] border-r border-gray-200 dark:border-gray-800 transition-all duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} w-72 ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}>
                <div className={`h-16 flex items-center border-b border-gray-100 dark:border-gray-800 relative ${isCollapsed ? 'md:justify-center px-6 md:px-0' : 'px-6 justify-between'}`}>
                    <Link href="/cliente" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-cyan-700 dark:bg-primary flex items-center justify-center shrink-0">
                            <Calendar className="w-5 h-5 text-white dark:text-black" />
                        </div>
                        <span className={`font-bold text-gray-900 dark:text-white tracking-tight truncate ${isCollapsed ? 'md:hidden' : ''}`}>Minha Agenda</span>
                    </Link>

                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`absolute -right-3 top-1/2 -translate-y-1/2 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-full p-1 text-gray-500 hover:text-cyan-700 dark:hover:text-primary hover:border-primary transition-colors hidden md:flex`}
                    >
                        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
                    {CLIENT_LINKS.map((link) => {
                        const isActive = link.href === "/cliente"
                            ? pathname === "/cliente"
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
                    >
                        <Globe className="w-5 h-5 shrink-0" />
                        <span className={`${isCollapsed ? 'md:hidden' : ''}`}>Ver Marketplace</span>
                    </Link>
                    <button
                        onClick={async () => {
                            await fetch("/api/auth/logout", { method: "POST" });
                            window.location.href = "/";
                        }}
                        className={`w-full flex items-center gap-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors ${isCollapsed ? 'md:justify-center md:px-0 px-3' : 'px-3'}`}
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        <span className={`${isCollapsed ? 'md:hidden' : ''}`}>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-[#111] border-b border-gray-200 dark:border-gray-800 z-10 transition-colors">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                            Olá, {session?.name?.split(" ")[0] || "Cliente"}
                        </h1>
                    </div>
                    <ThemeToggle />
                </header>

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
