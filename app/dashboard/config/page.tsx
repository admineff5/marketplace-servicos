"use client";
import { useState, useEffect } from "react";
import { Settings, User, Building, CreditCard, Bell, Shield, Palette, MapPin, X } from "lucide-react";

const TABS = [
    { id: "profile", label: "Perfil da Empresa", icon: Building },
    { id: "locations", label: "Lojas / Franquias", icon: MapPin },
    { id: "appearance", label: "Aparência", icon: Palette },
    { id: "payments", label: "Pagamentos", icon: CreditCard },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "security", label: "Segurança", icon: Shield },
];

export default function ConfigPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [locations, setLocations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (activeTab === "locations") {
            fetchLocations();
        }
    }, [activeTab]);

    const fetchLocations = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/locations');
            const data = await res.json();
            setLocations(data);
        } catch (error) {
            console.error("Erro ao buscar unidades:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteLocation = async (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir esta unidade?")) {
            try {
                const res = await fetch(`/api/locations/${id}`, { method: 'DELETE' });
                if (res.ok) fetchLocations();
            } catch (error) {
                console.error("Erro ao excluir unidade:", error);
            }
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Settings className="w-6 h-6 text-cyan-700 dark:text-primary" />
                        Configurações
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Gerencie as preferências e opções da sua conta empresarial.
                    </p>
                </div>
                <button className="bg-primary hover:bg-cyan-400 text-black font-bold px-4 py-2 rounded-lg transition-colors">
                    Salvar Alterações
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mt-6">
                {/* Sidebar Nav */}
                <div className="w-full md:w-64 shrink-0 flex flex-col gap-1">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-colors ${isActive
                                    ? "bg-primary text-gray-900 dark:text-gray-900"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl p-6 md:p-8">

                    {activeTab === "profile" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Informações da Empresa</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome da Empresa</label>
                                        <input type="text" defaultValue="EFF5 Automação Inteligente" className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">CNPJ</label>
                                        <input type="text" defaultValue="00.000.000/0001-00" className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email de Contato</label>
                                        <input type="email" defaultValue="contato@eff5.com" className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Telefone / WhatsApp</label>
                                        <input type="text" defaultValue="(27) 99266-1278" className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "locations" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Lojas / Franquias</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gerencie os endereços físicos onde sua empresa atende.</p>
                                </div>
                                <button className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                                    <MapPin className="w-4 h-4" />
                                    <span>Adicionar Unidade</span>
                                </button>
                            </div>

                            <div className="space-y-4">
                                {isLoading ? (
                                    <div className="py-20 text-center text-gray-500">Carregando unidades...</div>
                                ) : locations.length > 0 ? locations.map((loc) => (
                                    <div key={loc.id} className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-primary/50 transition-colors relative group bg-gray-50/50 dark:bg-gray-800/20">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                    <MapPin className="w-5 h-5 text-cyan-700 dark:text-primary" />
                                                </div>
                                                <input
                                                    type="text"
                                                    defaultValue={loc.name}
                                                    className="font-bold text-lg bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:border-primary outline-none text-gray-900 dark:text-white px-1 py-0.5"
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleDeleteLocation(loc.id)}
                                                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                Remover
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pl-14">
                                            <div className="space-y-1 md:col-span-1">
                                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">CEP</label>
                                                <input type="text" defaultValue={loc.cep} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary" />
                                            </div>
                                            <div className="space-y-1 md:col-span-2">
                                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Rua / Avenida</label>
                                                <input type="text" defaultValue={loc.address} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary" />
                                            </div>
                                            <div className="space-y-1 md:col-span-1">
                                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Número</label>
                                                <input type="text" defaultValue={loc.number} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary" />
                                            </div>
                                            <div className="space-y-1 md:col-span-2">
                                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Bairro</label>
                                                <input type="text" defaultValue={loc.neighborhood} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary" />
                                            </div>
                                            <div className="space-y-1 md:col-span-2">
                                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Link Google Maps (Como chegar)</label>
                                                <input type="url" defaultValue={loc.mapsLink} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md px-3 py-2 text-sm text-blue-500 outline-none focus:ring-1 focus:ring-primary" />
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-20 text-center text-gray-500 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/10">
                                        Nenhuma unidade cadastrada.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "appearance" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Personalização de Marca</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Ajuste como a sua página de marketplace será vista pelos clientes.</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Cor Principal</label>
                                    <div className="flex gap-3">
                                        {['bg-blue-600', 'bg-purple-600', 'bg-rose-600', 'bg-emerald-600', 'bg-amber-500', 'bg-black dark:bg-white'].map((color, i) => (
                                            <button key={i} className={`w-10 h-10 rounded-full ${color} ring-2 ring-transparent hover:ring-gray-300 dark:hover:ring-gray-600 transition-all ${i === 0 ? 'ring-primary ring-offset-2 dark:ring-offset-gray-900' : ''}`}></button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Logo da Empresa</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-600">
                                            <span className="text-xs text-gray-400">Upload</span>
                                        </div>
                                        <button className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                                            Escolher Arquivo...
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab !== "profile" && activeTab !== "locations" && activeTab !== "appearance" && (
                        <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in-95 duration-300">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                <Settings className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Aba em Desenvolvimento</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">
                                Estaremos adicionando as configurações funcionais para <b>{TABS.find(t => t.id === activeTab)?.label}</b> em breve.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
