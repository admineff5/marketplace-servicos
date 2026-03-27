"use client";

import { useState, useEffect } from "react";
import { X, Building, Scissors, UserSquare2, ArrowRight } from "lucide-react";
import Link from "next/link";

export function OnboardingPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Verifica no localStorage se deve esconder
        const hide = localStorage.getItem("hideAgendaJaOnboarding");
        if (!hide) {
            setIsOpen(true);
            // Pequeno delay para a animação de fade in fluir melhor após hidratar
            setTimeout(() => setIsVisible(true), 100);
        }
    }, []);

    const handleClose = () => {
        if (dontShowAgain) {
            localStorage.setItem("hideAgendaJaOnboarding", "true");
        }
        setIsVisible(false);
        setTimeout(() => setIsOpen(false), 300); // Tempo da animação
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div 
                className={`bg-white dark:bg-[#111] w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col transition-all duration-300 transform ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}
            >
                {/* Header Dinâmico */}
                <div className="relative bg-gradient-to-r from-cyan-600 to-blue-600 p-8 text-center overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-[2px]"></div>
                    <button 
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    
                    <h2 className="relative z-10 text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
                        Bem-vindo ao seu novo Portal! 🎉
                    </h2>
                    <p className="relative z-10 text-cyan-100 text-sm md:text-base max-w-lg mx-auto">
                        Para que o seu site de agendamento e sua Inteligência Artificial comecem a funcionar perfeitamente, siga estes 3 passos essenciais.
                    </p>
                </div>

                {/* Steps */}
                <div className="p-6 md:p-8 space-y-6 flex-1 overflow-y-auto">
                    
                    {/* Passo 1 */}
                    <div className="flex gap-4 items-start group">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-800/30 group-hover:scale-110 transition-transform">
                            <Building className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                Passo 1: Lojas e Franquias
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-2">
                                Vá em <strong className="text-gray-800 dark:text-gray-200">Perfil da Loja</strong> e cadastre os endereços físicos onde os atendimentos ocorrem. Sem uma loja física ou local virtual, os clientes não sabem para onde ir.
                            </p>
                            <Link href="/dashboard/config" onClick={handleClose} className="inline-flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                                Ir para Perfil da Loja <ArrowRight className="w-3 h-3 ml-1" />
                            </Link>
                        </div>
                    </div>

                    {/* Passo 2 */}
                    <div className="flex gap-4 items-start group">
                        <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0 border border-pink-100 dark:border-pink-800/30 group-hover:scale-110 transition-transform">
                            <Scissors className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                Passo 2: Catálogo de Serviços
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-2">
                                Em <strong className="text-gray-800 dark:text-gray-200">Serviços</strong>, liste tudo o que a sua empresa faz. Coloque preços, duração média e boas descrições para a IA oferecer aos clientes.
                            </p>
                            <Link href="/dashboard/servicos" onClick={handleClose} className="inline-flex items-center text-xs font-semibold text-pink-600 dark:text-pink-400 hover:underline">
                                Cadastrar Serviços <ArrowRight className="w-3 h-3 ml-1" />
                            </Link>
                        </div>
                    </div>

                    {/* Passo 3 */}
                    <div className="flex gap-4 items-start group">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800/30 group-hover:scale-110 transition-transform">
                            <UserSquare2 className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                Passo 3: Profissionais e Turnos
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-2">
                                Vá em <strong className="text-gray-800 dark:text-gray-200">Profissionais</strong>, crie os perfis da sua equipe, vincule-os aos serviços que fazem e defina os horários de trabalho de cada um na grade.
                            </p>
                            <Link href="/dashboard/profissionais" onClick={handleClose} className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                                Montar Equipe <ArrowRight className="w-3 h-3 ml-1" />
                            </Link>
                        </div>
                    </div>

                </div>

                {/* Footer Controls */}
                <div className="bg-gray-50 dark:bg-[#161616] p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800">
                    <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors group">
                        <div className="relative flex items-center justify-center">
                            <input 
                                type="checkbox" 
                                checked={dontShowAgain}
                                onChange={(e) => setDontShowAgain(e.target.checked)}
                                className="peer appearance-none w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded cursor-pointer checked:bg-primary checked:border-primary transition-all"
                            />
                            <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 10" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5l3.5 3.5L13 1"></path>
                            </svg>
                        </div>
                        Não mostrar este aviso novamente
                    </label>

                    <button 
                        onClick={handleClose}
                        className="w-full md:w-auto px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-offset-black transition-all shadow-md active:scale-95"
                    >
                        Entendi, Vamos Começar!
                    </button>
                </div>
            </div>
        </div>
    );
}
