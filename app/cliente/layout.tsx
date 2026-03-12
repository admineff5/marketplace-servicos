"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "../components/ThemeToggle";
import { Footer } from "../components/Footer";
import { LogOut, Home, User, Calendar } from "lucide-react";

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex flex-col">
            {/* Header / Navbar */}
            <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md dark:bg-black/80 transition-all border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo icon.png"
                            alt="Logo Icon"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                            AgendeJá
                        </span>
                    </Link>

                    <nav className="flex items-center gap-4">
                        <ThemeToggle />

                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1"></div>

                        <Link
                            href="/cliente"
                            className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-cyan-700 dark:hover:text-primary dark:text-gray-300 dark:hover:text-cyan-700 dark:hover:text-primary transition-colors"
                        >
                            <Calendar className="w-4 h-4" />
                            Agendamentos
                        </Link>

                        <Link
                            href="/cliente/perfil"
                            className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-cyan-700 dark:hover:text-primary dark:text-gray-300 dark:hover:text-cyan-700 dark:hover:text-primary transition-colors"
                        >
                            <User className="w-4 h-4" />
                            Meu Perfil
                        </Link>

                        <div className="flex items-center gap-2 pl-2">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                                Olá, Cliente
                            </span>
                        </div>

                        <button
                            onClick={async () => {
                                await fetch("/api/auth/logout", { method: "POST" });
                                window.location.href = "/";
                            }}
                            className="ml-2 flex items-center justify-center p-2 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                            title="Sair"
                        >
                            <LogOut className="w-5 h-5 shrink-0" />
                        </button>
                    </nav>
                </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
            <Footer />
        </div>
    );
}
