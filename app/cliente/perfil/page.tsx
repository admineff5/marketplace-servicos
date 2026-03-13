"use client";

import { User, Mail, CreditCard, MapPin, Phone, ShieldCheck, Save, ArrowLeft, Plus, Trash2, Star, CheckCircle2, X, Home } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function PerfilCliente() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Modals
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);

    // Form States
    const [newAddress, setNewAddress] = useState({
        cep: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: "", isDefault: false
    });
    const [newCard, setNewCard] = useState({
        cardName: "", cardNumber: "", expiry: "", brand: "Visa", isFavorite: false
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [userRes, addrRes, cardRes] = await Promise.all([
                fetch("/api/user/profile"),
                fetch("/api/user/addresses"),
                fetch("/api/user/payment-methods")
            ]);

            const userData = await userRes.json();
            const addrData = await addrRes.json();
            const cardData = await cardRes.json();

            if (!userData.error) setUser(userData);
            if (Array.isArray(addrData)) setAddresses(addrData);
            if (Array.isArray(cardData)) setPaymentMethods(cardData);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddAddress = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/user/addresses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newAddress)
            });
            if (res.ok) {
                setShowAddressModal(false);
                setNewAddress({ cep: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: "", isDefault: false });
                fetchData();
            }
        } catch (err) {
            setMessage({ type: "error", text: "Erro ao salvar endereço." });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAddress = async (id: string) => {
        if (!confirm("Excluir este endereço?")) return;
        try {
            await fetch(`/api/user/addresses/${id}`, { method: "DELETE" });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddCard = async () => {
        setIsSaving(true);
        try {
            const lastDigits = newCard.cardNumber.slice(-4);
            const res = await fetch("/api/user/payment-methods", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...newCard, lastDigits })
            });
            if (res.ok) {
                setShowCardModal(false);
                setNewCard({ cardName: "", cardNumber: "", expiry: "", brand: "Visa", isFavorite: false });
                fetchData();
            }
        } catch (err) {
            setMessage({ type: "error", text: "Erro ao salvar cartão." });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteCard = async (id: string) => {
        if (!confirm("Excluir este cartão?")) return;
        try {
            await fetch(`/api/user/payment-methods/${id}`, { method: "DELETE" });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const censorCPF = (cpf: string) => {
        if (!cpf) return "***.***.***-**";
        return `***.***.***-${cpf.slice(-2)}`;
    };

    if (isLoading) return <div className="p-8 text-center animate-pulse text-gray-400 font-bold">Carregando perfil...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div>
                <Link href="/cliente" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-cyan-700 dark:hover:text-primary mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Voltar aos agendamentos
                </Link>
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
                    Meu Perfil
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                    Centralize sua conta, endereços e facilitadores de pagamento.
                </p>
            </div>

            {/* Main Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Identification & Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-20 h-20 bg-cyan-100 dark:bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-cyan-200 dark:border-primary/20">
                                <User className="w-10 h-10 text-cyan-700 dark:text-primary" />
                            </div>
                            <h2 className="font-bold text-lg dark:text-white">{user?.name}</h2>
                            <span className="text-xs text-cyan-700 dark:text-primary font-bold uppercase tracking-widest">{user?.role}</span>
                        </div>

                        <div className="space-y-4">
                            <div className="p-3 bg-gray-50 dark:bg-[#080808] rounded-2xl">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1">E-mail</label>
                                <p className="text-sm truncate dark:text-gray-200">{user?.email}</p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-[#080808] rounded-2xl">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1">CPF</label>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm dark:text-gray-200">{censorCPF(user?.cpf)}</p>
                                    <ShieldCheck className="w-4 h-4 text-green-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Management areas */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Address List */}
                    <section className="bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-cyan-700 dark:text-primary" />
                                Meus Endereços
                            </h3>
                            <button 
                                onClick={() => setShowAddressModal(true)}
                                className="text-xs font-bold text-cyan-700 dark:text-primary hover:underline flex items-center gap-1"
                            >
                                <Plus className="w-3 h-3" /> ADICIONAR
                            </button>
                        </div>

                        <div className="space-y-3">
                            {addresses.length > 0 ? addresses.map((addr) => (
                                <div key={addr.id} className="group p-4 bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-gray-800 rounded-2xl flex items-start justify-between hover:border-primary/50 transition-all">
                                    <div className="flex gap-4">
                                        <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center ${addr.isDefault ? 'bg-cyan-700 dark:bg-primary text-white dark:text-black' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}`}>
                                            <Home className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-bold text-sm dark:text-white">{addr.street}, {addr.number}</p>
                                                {addr.isDefault && <span className="text-[10px] bg-cyan-100 dark:bg-primary/20 text-cyan-700 dark:text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Padrão</span>}
                                            </div>
                                            <p className="text-xs text-gray-500">{addr.neighborhood}, {addr.city} - {addr.state}</p>
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase">CEP: {addr.cep}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteAddress(addr.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )) : (
                                <div className="py-10 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl">
                                    <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300 opacity-20" />
                                    <p className="text-sm text-gray-400">Nenhum endereço cadastrado.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Payment methods */}
                    <section className="bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-cyan-700 dark:text-primary" />
                                Formas de Pagamento
                            </h3>
                            <button 
                                onClick={() => setShowCardModal(true)}
                                className="text-xs font-bold text-cyan-700 dark:text-primary hover:underline flex items-center gap-1"
                            >
                                <Plus className="w-3 h-3" /> ADICIONAR
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {paymentMethods.length > 0 ? paymentMethods.map((card) => (
                                <div key={card.id} className="relative group p-4 bg-gradient-to-br from-gray-50 to-white dark:from-[#080808] dark:to-[#111] border border-gray-100 dark:border-gray-800 rounded-3xl hover:border-primary/50 transition-all">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="h-10 w-14 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center font-bold text-[10px] italic">
                                            {card.brand}
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteCard(card.id)}
                                            className="p-1.5 text-gray-400 hover:text-red-500"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-sm font-bold dark:text-white mb-1">•••• •••• •••• {card.lastDigits}</p>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Vencimento</p>
                                            <p className="text-xs dark:text-gray-300">{card.expiry}</p>
                                        </div>
                                        {card.isFavorite && <Star className="w-4 h-4 text-cyan-700 dark:text-primary fill-cyan-700 dark:fill-primary" />}
                                    </div>
                                </div>
                            )) : (
                                <div className="sm:col-span-2 py-10 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl">
                                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-gray-300 opacity-20" />
                                    <p className="text-sm text-gray-400">Nenhum cartão cadastrado.</p>
                                </div>
                            )}
                        </div>
                    </section>

                </div>
            </div>

            {/* Address Modal */}
            {showAddressModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-[32px] w-full max-w-lg p-8 shadow-2xl overflow-hidden relative">
                        <button onClick={() => setShowAddressModal(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                        <h2 className="text-2xl font-bold dark:text-white mb-6">Novo Endereço</h2>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">CEP</label>
                                <input value={newAddress.cep} onChange={e => setNewAddress({...newAddress, cep: e.target.value})} className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 text-sm" placeholder="00000-000" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Rua / Logradouro</label>
                                <input value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 text-sm" placeholder="Ex: Av. Brasil" />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Número</label>
                                <input value={newAddress.number} onChange={e => setNewAddress({...newAddress, number: e.target.value})} className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 text-sm" placeholder="123" />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Bairro</label>
                                <input value={newAddress.neighborhood} onChange={e => setNewAddress({...newAddress, neighborhood: e.target.value})} className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 text-sm" placeholder="Centro" />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Cidade</label>
                                <input value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 text-sm" placeholder="São Paulo" />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Estado (UF)</label>
                                <input value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 text-sm" placeholder="SP" />
                            </div>
                        </div>

                        <div className="mt-6 flex items-center gap-2">
                            <input type="checkbox" id="isDefault" checked={newAddress.isDefault} onChange={e => setNewAddress({...newAddress, isDefault: e.target.checked})} className="rounded bg-primary" />
                            <label htmlFor="isDefault" className="text-xs text-gray-500">Definir como endereço padrão</label>
                        </div>

                        <button onClick={handleAddAddress} disabled={isSaving} className="w-full mt-8 bg-primary text-black font-bold py-4 rounded-2xl hover:bg-cyan-400 transition-all flex items-center justify-center gap-2">
                            {isSaving ? "Salvando..." : <><CheckCircle2 className="w-4 h-4" /> Salvar Endereço</>}
                        </button>
                    </div>
                </div>
            )}

            {/* Card Modal */}
            {showCardModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-[32px] w-full max-w-sm p-8 shadow-2xl relative">
                        <button onClick={() => setShowCardModal(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                        <h2 className="text-2xl font-bold dark:text-white mb-6 text-center">Novo Cartão</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nome no Cartão</label>
                                <input 
                                    value={newCard.cardName} 
                                    onChange={e => setNewCard({...newCard, cardName: e.target.value})} 
                                    className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-center uppercase" 
                                    placeholder="Nome conforme aparece no cartão" 
                                    autoComplete="cc-name"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Número do Cartão</label>
                                <input 
                                    value={newCard.cardNumber} 
                                    onChange={e => setNewCard({...newCard, cardNumber: e.target.value})} 
                                    className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-center" 
                                    placeholder="0000 0000 0000 0000" 
                                    autoComplete="cc-number"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Vencimento</label>
                                    <input 
                                        value={newCard.expiry} 
                                        onChange={e => setNewCard({...newCard, expiry: e.target.value})} 
                                        className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-center" 
                                        placeholder="MM/AA" 
                                        autoComplete="cc-exp"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Bandeira</label>
                                    <select value={newCard.brand} onChange={e => setNewCard({...newCard, brand: e.target.value})} className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-center appearance-none">
                                        <option>Visa</option>
                                        <option>Mastercard</option>
                                        <option>Elo</option>
                                        <option>Amex</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-2">
                            <input type="checkbox" id="isFavorite" checked={newCard.isFavorite} onChange={e => setNewCard({...newCard, isFavorite: e.target.checked})} className="rounded bg-primary" />
                            <label htmlFor="isFavorite" className="text-xs text-gray-500">Marcar como favorito</label>
                        </div>

                        <button onClick={handleAddCard} disabled={isSaving} className="w-full mt-8 bg-black dark:bg-primary text-white dark:text-black font-bold py-4 rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2">
                            {isSaving ? "Salvando..." : <><CheckCircle2 className="w-4 h-4" /> Cadastrar Cartão</>}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
