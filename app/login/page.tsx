"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { ThemeToggle } from "../components/ThemeToggle";
import { Footer } from "../components/Footer";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Erro ao realizar login");
            }

            // Sucesso! Redireciona conforme o perfil
            if (data.user.role === "CLIENT") {
                router.push("/cliente");
            } else {
                router.push("/dashboard");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex overflow-hidden">
            {/* Left Side: Info / Showcase */}
            <div className="hidden lg:flex lg:w-[60%] relative bg-black items-center justify-center p-12 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-40">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="relative z-10 max-w-lg text-center lg:text-left">
                    <Link href="/" className="inline-block mb-12 transform hover:scale-105 transition-transform">
                        <Image
                            src="/logo completa.png"
                            alt="Logo"
                            width={180}
                            height={60}
                            className="object-contain"
                        />
                    </Link>
                    
                    <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-6">
                        Gerencie sua empresa de forma <span className="text-primary">inteligente.</span>
                    </h2>
                    
                    <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                        A plataforma completa para agendamentos, controle de estoque e gestão de clientes. Junte-se a milhares de profissionais.
                    </p>

                    <div className="space-y-6">
                        {[
                            { title: "Dashboard Real-time", desc: "Acompanhe suas métricas em tempo real." },
                            { title: "Agenda Inteligente", desc: "Evite conflitos e otimize seu tempo." },
                            { title: "Foco no Cliente", desc: "Histórico completo e fidelização garantida." }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-4 group">
                                <div className="mt-1 h-5 w-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                                    <div className="h-1.5 w-1.5 bg-primary rounded-full group-hover:bg-black"></div>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm tracking-wide uppercase">{item.title}</h4>
                                    <p className="text-gray-500 text-sm mt-0.5">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-10 right-10 opacity-20 transform rotate-12 translate-x-1/4 translate-y-1/4 pointer-events-none">
                    <div className="w-[600px] h-[400px] border border-white/10 rounded-3xl"></div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:flex-none lg:w-[40%] relative">
                <div className="absolute top-8 right-8 z-20">
                    <ThemeToggle />
                </div>

                <div className="w-full max-w-md mx-auto relative z-10">
                    <div className="lg:hidden text-center mb-10">
                         <Link href="/">
                            <Image
                                src="/logo icon.png"
                                alt="Logo"
                                width={56}
                                height={56}
                                className="mx-auto object-contain"
                            />
                        </Link>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                            Acesse sua Conta
                        </h2>
                    </div>

                    <div className="hidden lg:block mb-10">
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                            Bem-vindo de volta
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Por favor, insira suas credenciais para acessar o painel.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <form className="space-y-5" onSubmit={handleLogin}>
                            {error && (
                                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-800/30 animate-shake">
                                    {error}
                                </div>
                            )}
                            <div>
                                <label htmlFor="email" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                                    E-mail corporativo
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="exemplo@suaempresa.com"
                                    className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-[#151516] border border-gray-200 dark:border-[#222] rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                                    Senha de acesso
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-[#151516] border border-gray-200 dark:border-[#222] rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                                />
                            </div>

                            <div className="flex items-center justify-between py-1">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-[#333] rounded dark:bg-[#151516]"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-600 dark:text-gray-400 font-medium">
                                        Manter logado
                                    </label>
                                </div>

                                <div className="text-xs">
                                    <a href="#" className="font-bold text-blue-600 dark:text-primary hover:underline">
                                        Esqueceu a senha?
                                    </a>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/10 text-sm font-bold text-black bg-primary hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                            >
                                {isLoading ? "Autenticando..." : "Entrar no Painel"}
                            </button>
                        </form>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100 dark:border-[#222]" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase tracking-widest">
                                <span className="px-4 bg-white dark:bg-[#0a0a0a] text-gray-400">
                                    ou continue com
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <Link
                                href="/register"
                                className="w-full flex justify-center items-center py-3.5 px-4 border border-gray-200 dark:border-[#222] rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                            >
                                Criar conta gratuita
                            </Link>
                        </div>

                        <p className="text-center text-[10px] text-gray-400 mt-8 uppercase tracking-[0.1em]">
                            Protegido por AgendeJá SSL Security
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
