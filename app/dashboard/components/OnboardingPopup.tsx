"use client";

import { useState, useEffect } from "react";
import { X, Building, Scissors, UserSquare2, ArrowRight, HelpCircle, MessageSquareCode, Crown } from "lucide-react";
import Link from "next/link";

export function OnboardingPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hide = localStorage.getItem("hideAgendaJaOnboarding");
        if (!hide) {
            setIsOpen(true);
            setTimeout(() => setIsVisible(true), 100);
        }
    }, []);

    const handleClose = () => {
        if (dontShowAgain) {
            localStorage.setItem("hideAgendaJaOnboarding", "true");
        }
        setIsVisible(false);
        setTimeout(() => setIsOpen(false), 300);
    };

    if (!isOpen) return null;

    // A cor Petróleo padrão pedida pelo cliente
    const petrolColor = "text-cyan-800 dark:text-cyan-500";
    const bgPetrolBox = "bg-cyan-50 dark:bg-cyan-900/30";
    const borderPetrolBox = "border-cyan-200 dark:border-cyan-800";

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div 
                className={`bg-white dark:bg-[#111] w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col transition-all duration-300 transform ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}
            >
                {/* Header Destaque em Petróleo/Ciano */}
                <div className="relative bg-cyan-900 dark:bg-cyan-950 p-6 md:p-8 text-center shrink-0 rounded-t-3xl overflow-hidden border-b border-cyan-800 dark:border-cyan-900">
                    <button 
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    
                    <h2 className="relative z-10 text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
                        Bem-vindo ao seu novo Portal! 🎉
                    </h2>
                    <p className="relative z-10 text-cyan-100/90 text-sm md:text-base max-w-lg mx-auto">
                        Para que o seu site de agendamento e sua Inteligência Artificial comecem a funcionar perfeitamente, siga estes 5 passos.
                    </p>
                </div>

                {/* Steps Container Scrollável */}
                <div className="p-6 md:p-8 space-y-7 flex-1 overflow-y-auto">
                    
                    {/* Passo 1 */}
                    <div className="flex gap-4 items-start group">
                        <div className={`w-12 h-12 rounded-2xl ${bgPetrolBox} ${petrolColor} flex items-center justify-center shrink-0 border ${borderPetrolBox} group-hover:scale-110 transition-transform`}>
                            <Building className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                Passo 1: Lojas e Franquias
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-2">
                                Vá em <strong className="text-gray-800 dark:text-gray-200">Perfil da Loja</strong> e cadastre os endereços físicos onde os atendimentos ocorrem. Sem uma loja física ou local virtual, os clientes não sabem para onde ir.
                            </p>
                            <Link href="/dashboard/config" onClick={handleClose} className={`inline-flex items-center text-xs font-bold ${petrolColor} hover:underline`}>
                                Ir para Perfil da Loja <ArrowRight className="w-3 h-3 ml-1" />
                            </Link>
                        </div>
                    </div>

                    {/* Passo 2 */}
                    <div className="flex gap-4 items-start group">
                        <div className={`w-12 h-12 rounded-2xl ${bgPetrolBox} ${petrolColor} flex items-center justify-center shrink-0 border ${borderPetrolBox} group-hover:scale-110 transition-transform`}>
                            <Scissors className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                Passo 2: Catálogo de Serviços
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-2">
                                Em <strong className="text-gray-800 dark:text-gray-200">Serviços</strong>, liste tudo o que a sua empresa faz. Coloque preços, duração média e boas descrições para a IA oferecer aos clientes.
                            </p>
                            <Link href="/dashboard/servicos" onClick={handleClose} className={`inline-flex items-center text-xs font-bold ${petrolColor} hover:underline`}>
                                Cadastrar Serviços <ArrowRight className="w-3 h-3 ml-1" />
                            </Link>
                        </div>
                    </div>

                    {/* Passo 3 */}
                    <div className="flex gap-4 items-start group">
                        <div className={`w-12 h-12 rounded-2xl ${bgPetrolBox} ${petrolColor} flex items-center justify-center shrink-0 border ${borderPetrolBox} group-hover:scale-110 transition-transform`}>
                            <UserSquare2 className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                Passo 3: Equipe e Turnos
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-2">
                                Vá em <strong className="text-gray-800 dark:text-gray-200">Profissionais</strong>, crie o perfil da sua equipe, vincule-os a loja onde ficam e defina na grade o horário de atendimento.
                            </p>
                            <Link href="/dashboard/profissionais" onClick={handleClose} className={`inline-flex items-center text-xs font-bold ${petrolColor} hover:underline`}>
                                Montar Equipe <ArrowRight className="w-3 h-3 ml-1" />
                            </Link>
                        </div>
                    </div>

                    {/* BLOCO DE SERVIÇOS PREMIUM */}
                    <div className="mt-8 border-2 border-amber-300 dark:border-primary/50 bg-amber-50/40 dark:bg-primary/5 rounded-2xl relative p-5 pt-8">
                        <div className="absolute -top-3.5 left-6 px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 dark:from-primary dark:to-cyan-600 text-white dark:text-black text-[10px] md:text-xs uppercase font-extrabold tracking-widest rounded-full shadow-md flex items-center gap-1.5">
                            <Crown className="w-3 h-3" />
                            Recursos Premium
                        </div>
                        
                        <div className="space-y-6">
                            {/* Passo 4 */}
                            <div className="flex gap-4 items-start group">
                                <div className={`w-10 h-10 rounded-2xl ${bgPetrolBox} ${petrolColor} flex items-center justify-center shrink-0 border ${borderPetrolBox} group-hover:scale-110 transition-transform`}>
                                    <HelpCircle className="w-5 h-5" />
                                </div>
                                <div className="flex-1 pt-0.5">
                                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                        Passo 4: Treinamento da IA
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-2">
                                        Vá em <strong className="text-gray-800 dark:text-gray-200">FAQ Assistente</strong> e crie uma robusta base de conhecimento para que a sua IA saiba exatamente como responder qualquer dúvida dos clientes e saiba o comportamento da loja.
                                    </p>
                                    <Link href="/dashboard/faq" onClick={handleClose} className={`inline-flex items-center text-xs font-bold ${petrolColor} hover:underline`}>
                                        Treinar Inteligência Artificial <ArrowRight className="w-3 h-3 ml-1" />
                                    </Link>
                                </div>
                            </div>

                            {/* Passo 5 */}
                            <div className="flex gap-4 items-start group">
                                <div className={`w-10 h-10 rounded-2xl ${bgPetrolBox} ${petrolColor} flex items-center justify-center shrink-0 border ${borderPetrolBox} group-hover:scale-110 transition-transform`}>
                                    <MessageSquareCode className="w-5 h-5" />
                                </div>
                                <div className="flex-1 pt-0.5">
                                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                        Passo 5: Conectar WhatsApp
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-2">
                                        Vá em <strong className="text-gray-800 dark:text-gray-200">Conversas IA (WhatsApp)</strong> para escanear o QR Code de conectar o seu número corporativo. A IA começará a atender sozinha!
                                    </p>
                                    <Link href="/dashboard/mensagens" onClick={handleClose} className={`inline-flex items-center text-xs font-bold ${petrolColor} hover:underline`}>
                                        Conectar o WhatsApp agora <ArrowRight className="w-3 h-3 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Controls */}
                <div className="bg-gray-50 dark:bg-[#161616] shrink-0 p-5 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800 rounded-b-3xl">
                    <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors group">
                        <div className="relative flex items-center justify-center">
                            <input 
                                type="checkbox" 
                                checked={dontShowAgain}
                                onChange={(e) => setDontShowAgain(e.target.checked)}
                                className="peer appearance-none w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded cursor-pointer checked:bg-cyan-800 dark:checked:bg-cyan-600 checked:border-cyan-800 dark:checked:border-cyan-600 transition-all"
                            />
                            <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 10" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5l3.5 3.5L13 1"></path>
                            </svg>
                        </div>
                        Não mostrar este aviso novamente
                    </label>

                    <button 
                        onClick={handleClose}
                        className="w-full md:w-auto px-6 py-2.5 bg-cyan-900 dark:bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-950 dark:hover:bg-cyan-500 focus:ring-2 focus:ring-offset-2 focus:ring-cyan-900 dark:focus:ring-offset-black transition-all shadow-md active:scale-95"
                    >
                        Entendi, Vamos Começar!
                    </button>
                </div>
            </div>
        </div>
    );
}
