"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "../components/ThemeToggle";
import { Footer } from "../components/Footer";
import { Send, MapPin, Mail, Phone } from "lucide-react";

export default function FaleConosco() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate sending form API delay
        setTimeout(() => {
            setIsSent(true);
            setFormData({ name: "", email: "", phone: "", message: "" });
        }, 1000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col dark:bg-[#0a0a0a]">
            {/* Navbar Minimalist */}
            <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md dark:bg-black/80 transition-all border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo-icon.png"
                            alt="Logo Icon"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                            AgendeJá
                        </span>
                    </Link>

                    <nav className="flex items-center gap-3">
                        <ThemeToggle />
                        <div className="hidden sm:flex items-center gap-4 border-l border-gray-200 dark:border-gray-800 pl-4 ml-2">
                            <Link
                                href="/login"
                                className="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-200 dark:hover:text-cyan-700 dark:hover:text-primary transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-105"
                            >
                                Cadastrar-se
                            </Link>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full mx-auto container px-4 py-12 lg:py-20 lg:px-8 flex flex-col items-center">

                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                        Fale <span className="text-cyan-700 dark:text-primary">Conosco</span>
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                        Tem alguma dúvida, encontrou um problema ou deseja dar uma sugestão?
                        Mande uma mensagem para a nossa equipe.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl w-full mx-auto">

                    {/* Informações de Contato Rápidas */}
                    <div className="bg-white dark:bg-[#111] p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 h-fit">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Informações de Contato</h2>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                    <Mail className="w-5 h-5 text-cyan-700 dark:text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">E-mail</h3>
                                    <p className="text-base font-bold text-gray-900 dark:text-white">suporte@agendeja.com.br</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                    <Phone className="w-5 h-5 text-cyan-700 dark:text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Telefone / WhatsApp (Suporte)</h3>
                                    <p className="text-base font-bold text-gray-900 dark:text-white">(11) 99999-9999</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-cyan-700 dark:text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Escritório</h3>
                                    <p className="text-base text-gray-900 dark:text-white leading-relaxed">
                                        Av. Paulista, 1000, 10º Andar<br />
                                        Bela Vista, São Paulo - SP<br />
                                        CEP: 01310-100
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Box */}
                    <div className="bg-white dark:bg-[#111] p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
                        {isSent ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-10">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                                    <Send className="w-8 h-8 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Mensagem Enviada!</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-8">
                                    Nossa equipe recebeu seu contato com sucesso. Retornaremos em breve.
                                </p>
                                <button
                                    onClick={() => setIsSent(false)}
                                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium px-6 py-2.5 rounded-xl transition-colors"
                                >
                                    Enviar outra mensagem
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Nome</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151516] px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                                        placeholder="Seu nome completo"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">E-mail</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151516] px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                                        placeholder="exemplo@email.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Telefone / WhatsApp</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151516] px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Mensagem</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151516] px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none"
                                        placeholder="Escreva sua dúvida ou sugestão aqui..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-4 text-black font-bold shadow-sm hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all transform hover:scale-[1.02]"
                                >
                                    <Send className="w-5 h-5" />
                                    Enviar Mensagem
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
