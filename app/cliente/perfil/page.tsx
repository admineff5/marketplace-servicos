"use client";

import { User, Mail, CreditCard, MapPin, Phone, ShieldCheck, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function PerfilCliente() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [address, setAddress] = useState("");
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        fetch("/api/user/profile")
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setUser(data);
                    setAddress(data.address || "");
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        setMessage({ type: "", text: "" });
        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address })
            });
            if (res.ok) {
                setMessage({ type: "success", text: "Perfil atualizado com sucesso!" });
            } else {
                setMessage({ type: "error", text: "Erro ao salvar alterações." });
            }
        } catch (err) {
            setMessage({ type: "error", text: "Erro de conexão." });
        } finally {
            setIsSaving(false);
        }
    };

    const censorCPF = (cpf: string) => {
        if (!cpf) return "***.***.***-**";
        return `***.***.***-${cpf.slice(-2)}`;
    };

    if (isLoading) return <div className="p-8 text-center">Carregando perfil...</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div>
                <Link href="/cliente" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-cyan-700 dark:hover:text-primary mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Voltar aos agendamentos
                </Link>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                    Dados Pessoais
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Gerencie suas informações e formas de pagamento.
                </p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
                
                {/* Identification */}
                <section>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-cyan-700 dark:text-primary" />
                        Identificação
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Nome Completo</label>
                            <div className="px-4 py-3 bg-gray-50 dark:bg-[#1a1a1c] border border-gray-100 dark:border-gray-800 rounded-xl text-gray-400 cursor-not-allowed">
                                {user?.name}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">CPF (Apenas visualização)</label>
                            <div className="px-4 py-3 bg-gray-50 dark:bg-[#1a1a1c] border border-gray-100 dark:border-gray-800 rounded-xl text-gray-400 flex items-center justify-between">
                                <span>{censorCPF(user?.cpf)}</span>
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-cyan-700 dark:text-primary" />
                        Contato e Endereço
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">E-mail</label>
                            <div className="px-4 py-3 bg-gray-50 dark:bg-[#1a1a1c] border border-gray-100 dark:border-gray-800 rounded-xl text-gray-400 cursor-not-allowed">
                                {user?.email}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 font-bold">Endereço de Entrega/Atendimento</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                <input 
                                    type="text" 
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Rua, Número, Complemento, Cidade"
                                    className="w-full px-12 py-3 bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Payments */}
                <section>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-cyan-700 dark:text-primary" />
                        Pagamento
                    </h3>
                    <div className="p-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-center text-gray-400 py-10">
                        <CreditCard className="w-8 h-8 mx-auto mb-3 opacity-20" />
                        <p className="text-sm">Nenhum cartão cadastrado.</p>
                        <button className="mt-4 text-xs font-bold text-cyan-700 dark:text-primary uppercase tracking-widest hover:underline">
                            + Adicionar Cartão
                        </button>
                    </div>
                </section>

                {/* Footer Actions */}
                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-primary px-8 py-3 rounded-xl font-bold text-black hover:bg-cyan-400 transition-all shadow-[0_4px_15px_rgba(0,255,255,0.2)] disabled:opacity-50"
                    >
                        {isSaving ? "Salvando..." : <><Save className="w-4 h-4" /> Salvar Alterações</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
