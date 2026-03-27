"use client";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Settings, User, Building, CreditCard, Bell, Shield, Palette, MapPin, X, Plus, Loader2, CheckCircle2, AlertTriangle, MessageSquare, ArrowRight, Trash2 } from "lucide-react";

const TABS = [
    { id: "profile", label: "Perfil da Empresa", icon: Building },
    { id: "locations", label: "Lojas / Franquias", icon: MapPin },
    { id: "appearance", label: "Aparência", icon: Palette },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "security", label: "Segurança", icon: Shield },
];

export default function ConfigPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
            <ConfigContent />
        </Suspense>
    );
}

function ConfigContent() {
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [showToast, setShowToast] = useState(false);
    const [locations, setLocations] = useState<any[]>([]);
    const [company, setCompany] = useState<any>({
        name: "",
        cnpj: "",
        legalName: "",
        imageUrl: ""
    });

    // New Location Modal State
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [isCreatingLocation, setIsCreatingLocation] = useState(false);
    const [newLocation, setNewLocation] = useState({
        name: "",
        cep: "",
        address: "",
        number: "",
        neighborhood: "",
        city: "",
        state: "",
        mapsLink: "",
        cnpj: ""
    });

    const maskCNPJ = (value: string) => {
        if (!value) return "";
        return value
            .replace(/\D/g, "")
            .replace(/^(\d{2})(\d)/, "$1.$2")
            .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1/$2")
            .replace(/(\d{4})(\d)/, "$1-$2")
            .slice(0, 18);
    };

    const maskCEP = (value: string) => {
        if (!value) return "";
        return value.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 9);
    };

    useEffect(() => {
        fetchProfile();
        
        // Handle Tab from URL
        const tab = searchParams.get("tab");
        if (tab && TABS.some(t => t.id === tab)) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/dashboard/notifications");
            const data = await res.json();
            if (data && data.notifications) {
                setNotifications(data.notifications);
                setUnreadCount(data.unreadCount);
            }
        } catch (e) { console.error("Erro fetch notifications:", e) }
    };

    const markAsRead = async (id: string, link: string | null) => {
        try {
            await fetch("/api/dashboard/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notificationId: id })
            });
            fetchNotifications();
            if (link) window.open(link, '_blank');
        } catch (e) {
            if (link) window.open(link, '_blank');
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch("/api/dashboard/notifications", { 
                method: "PATCH", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ markAll: true }) 
            });
            fetchNotifications();
        } catch (e) { console.error(e) }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 15000);
        return () => clearInterval(interval);
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/dashboard/profile');
            const data = await res.json();
            if (!data.error) setCompany(data);
        } catch (err) {
            console.error(err);
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
            if (!data.error) setLocations(data);
        } catch (error) {
            console.error("Erro ao buscar unidades:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddLocation = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreatingLocation(true);
        try {
            const res = await fetch('/api/locations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newLocation)
            });
            
            if (res.ok) {
                await fetchLocations();
                setIsLocationModalOpen(false);
                setNewLocation({
                    name: "",
                    cep: "",
                    address: "",
                    number: "",
                    neighborhood: "",
                    city: "",
                    state: "",
                    mapsLink: "",
                    cnpj: ""
                });
            } else {
                const data = await res.json();
                alert(data.error || "Erro ao criar unidade");
            }
        } catch (error) {
            console.error("Erro ao adicionar:", error);
            alert("Erro de conexão");
        } finally {
            setIsCreatingLocation(false);
        }
    };

    const handleUpdateLocation = async (id: string, field: string, value: string) => {
        try {
            // Update local state for immediate feedback
            setLocations(prev => prev.map(loc => 
                loc.id === id ? { ...loc, [field]: value } : loc
            ));

            const location = locations.find(l => l.id === id);
            if (!location) return;

            await fetch(`/api/locations/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...location, [field]: value })
            });
        } catch (error) {
            console.error("Erro ao atualizar campo:", error);
        }
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/dashboard/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(company)
            });
            if (res.ok) {
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            }
        } catch (error) {
            console.error("Erro ao salvar:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Building className="w-6 h-6 text-cyan-700 dark:text-primary" />
                        Perfil da loja
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Gerencie as preferências e opções da sua conta empresarial.
                    </p>
                </div>
                <button 
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 bg-cyan-700 hover:bg-cyan-800 text-white dark:bg-primary dark:hover:bg-cyan-400 dark:text-black"
                >
                    {isSaving ? "Salvando..." : "Salvar Alterações"}
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
                                    ? "bg-cyan-700 hover:bg-cyan-800 text-white dark:bg-primary dark:hover:bg-cyan-400 dark:text-gray-900"
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
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome Fantasia (Marketplace)</label>
                                        <input 
                                            type="text" 
                                            value={company.name || ""} 
                                            onChange={(e) => setCompany({...company, name: e.target.value})}
                                            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-600 dark:focus:ring-cyan-600/50 dark:focus:ring-primary/50" 
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Razão Social</label>
                                        <input 
                                            type="text" 
                                            value={company.legalName || ""} 
                                            onChange={(e) => setCompany({...company, legalName: e.target.value})}
                                            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-600 dark:focus:ring-cyan-600/50 dark:focus:ring-primary/50" 
                                        />
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
                                <button 
                                    onClick={() => setIsLocationModalOpen(true)}
                                    className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Adicionar Unidade</span>
                                </button>
                            </div>

                            <div className="space-y-4">
                                {isLoading ? (
                                    <div className="py-20 text-center text-gray-500">Carregando unidades...</div>
                                ) : locations.length > 0 ? locations.map((loc) => (
                                    <div key={loc.id} className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-cyan-600/50 dark:hover:border-cyan-600 dark:hover:border-primary/50 transition-colors relative group bg-gray-50/50 dark:bg-gray-800/20">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                    <MapPin className="w-5 h-5 text-cyan-700 dark:text-primary" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={loc.name}
                                                    onChange={(e) => handleUpdateLocation(loc.id, "name", e.target.value)}
                                                    className="font-bold text-lg bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:border-cyan-600 dark:focus:border-primary outline-none text-gray-900 dark:text-white px-1 py-0.5"
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
                                                <input 
                                                    type="text" 
                                                    value={maskCEP(loc.cep)} 
                                                    onChange={(e) => handleUpdateLocation(loc.id, "cep", e.target.value.replace(/\D/g, "").slice(0, 8))}
                                                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-cyan-600 dark:focus:ring-primary" 
                                                />
                                            </div>
                                            <div className="space-y-1 md:col-span-2">
                                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Rua / Avenida</label>
                                                <input 
                                                    type="text" 
                                                    value={loc.address} 
                                                    onChange={(e) => handleUpdateLocation(loc.id, "address", e.target.value)}
                                                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-cyan-600 dark:focus:ring-primary" 
                                                />
                                            </div>
                                            <div className="space-y-1 md:col-span-1">
                                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Número</label>
                                                <input 
                                                    type="text" 
                                                    value={loc.number} 
                                                    onChange={(e) => handleUpdateLocation(loc.id, "number", e.target.value)}
                                                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-cyan-600 dark:focus:ring-primary" 
                                                />
                                            </div>
                                            <div className="space-y-1 md:col-span-2">
                                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Bairro</label>
                                                <input 
                                                    type="text" 
                                                    value={loc.neighborhood} 
                                                    onChange={(e) => handleUpdateLocation(loc.id, "neighborhood", e.target.value)}
                                                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-cyan-600 dark:focus:ring-primary" 
                                                />
                                            </div>
                                            <div className="space-y-1 md:col-span-2">
                                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Link Google Maps (Como chegar)</label>
                                                <input 
                                                    type="url" 
                                                    value={loc.mapsLink || ""} 
                                                    onChange={(e) => handleUpdateLocation(loc.id, "mapsLink", e.target.value)}
                                                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md px-3 py-2 text-sm text-blue-500 outline-none focus:ring-1 focus:ring-cyan-600 dark:focus:ring-primary" 
                                                />
                                            </div>
                                            <div className="space-y-1 md:col-span-2">
                                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">CNPJ</label>
                                                <input 
                                                    type="text" 
                                                    value={maskCNPJ(loc.cnpj || "")} 
                                                    onChange={(e) => handleUpdateLocation(loc.id, "cnpj", e.target.value.replace(/\D/g, "").slice(0, 14))}
                                                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-cyan-600 dark:focus:ring-primary" 
                                                    placeholder="00.000.000/0000-00"
                                                />
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

                    {activeTab === "notifications" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Central de Notificações</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Acompanhe alertas importantes sobre agendamentos, estoque e sistema.</p>
                                </div>
                                {unreadCount > 0 && (
                                    <button 
                                        onClick={markAllAsRead}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-cyan-700 dark:text-primary rounded-lg text-sm font-bold border border-primary/20 hover:bg-primary/20 transition-all"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Limpar todas</span>
                                    </button>
                                )}
                            </div>

                            <div className="space-y-3">
                                {notifications.length > 0 ? (
                                    notifications.map((notif: any) => (
                                        <div 
                                            key={notif.id}
                                            onClick={() => markAsRead(notif.id, notif.link)}
                                            className={`group relative flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${
                                                !notif.isRead 
                                                    ? 'bg-cyan-50/30 dark:bg-primary/5 border-cyan-100 dark:border-primary/20 shadow-sm' 
                                                    : 'bg-white dark:bg-transparent border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                                            }`}
                                        >
                                            <div className={`mt-1 p-2.5 rounded-xl border shrink-0 ${
                                                notif.type === 'STOCK' 
                                                    ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/20 text-amber-500' 
                                                    : notif.type === 'WHATSAPP' 
                                                        ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/20 text-green-500' 
                                                        : 'bg-cyan-50 dark:bg-primary/10 border-cyan-100 dark:border-primary/20 text-cyan-600 dark:text-primary'
                                            }`}>
                                                {notif.type === 'STOCK' ? <AlertTriangle className="w-5 h-5" /> : notif.type === 'WHATSAPP' ? <MessageSquare className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                                                        notif.type === 'STOCK' ? 'text-amber-500' : notif.type === 'WHATSAPP' ? 'text-green-500' : 'text-cyan-600 dark:text-primary'
                                                    }`}>
                                                        {notif.title}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(notif.createdAt).toLocaleDateString('pt-BR')} às {new Date(notif.createdAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                                                    </span>
                                                </div>
                                                <p className={`text-sm leading-relaxed ${!notif.isRead ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                                                    {notif.message}
                                                </p>
                                            </div>

                                            <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl bg-gray-50/30 dark:bg-gray-800/20">
                                        <Bell className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4 opacity-50" />
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sem novidades</h3>
                                        <p className="text-gray-500 dark:text-gray-400 mt-1">Você está em dia com todas as notificações.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Segurança da Conta</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Em breve: Alteração de senha, autenticação de dois fatores e log de acessos.</p>
                        </div>
                    )}

                    {activeTab !== "profile" && activeTab !== "locations" && activeTab !== "appearance" && activeTab !== "notifications" && activeTab !== "security" && (
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

            {/* Modal de Adicionar Unidade */}
            {isLocationModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" />
                                Nova Unidade
                            </h3>
                            <button onClick={() => setIsLocationModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddLocation} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome da Unidade (Ex: Matriz, Loja Centro)</label>
                                <input 
                                    required
                                    type="text" 
                                    value={newLocation.name}
                                    onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-600 dark:focus:ring-cyan-600/50 dark:focus:ring-primary/50 outline-none" 
                                    placeholder="Ex: Unidade Paulista"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">CEP</label>
                                    <input 
                                        required
                                        type="text" 
                                        value={maskCEP(newLocation.cep)}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, "").slice(0, 8);
                                            setNewLocation({...newLocation, cep: val});
                                        }}
                                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-600 dark:focus:ring-cyan-600/50 dark:focus:ring-primary/50 outline-none" 
                                        placeholder="00000-000"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Número</label>
                                    <input 
                                        type="text" 
                                        value={newLocation.number}
                                        onChange={(e) => setNewLocation({...newLocation, number: e.target.value})}
                                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-600 dark:focus:ring-cyan-600/50 dark:focus:ring-primary/50 outline-none" 
                                        placeholder="123"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Logradouro (Rua/Av)</label>
                                <input 
                                    required
                                    type="text" 
                                    value={newLocation.address}
                                    onChange={(e) => setNewLocation({...newLocation, address: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-600 dark:focus:ring-cyan-600/50 dark:focus:ring-primary/50 outline-none" 
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bairro</label>
                                    <input 
                                        type="text" 
                                        value={newLocation.neighborhood}
                                        onChange={(e) => setNewLocation({...newLocation, neighborhood: e.target.value})}
                                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-600 dark:focus:ring-cyan-600/50 dark:focus:ring-primary/50 outline-none" 
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cidade</label>
                                    <input 
                                        type="text" 
                                        value={newLocation.city}
                                        onChange={(e) => setNewLocation({...newLocation, city: e.target.value})}
                                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-600 dark:focus:ring-cyan-600/50 dark:focus:ring-primary/50 outline-none" 
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">CNPJ (Opcional)</label>
                                <input 
                                    type="text" 
                                    value={maskCNPJ(newLocation.cnpj)}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, "").slice(0, 14);
                                        setNewLocation({...newLocation, cnpj: val});
                                    }}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-600 dark:focus:ring-cyan-600/50 dark:focus:ring-primary/50 outline-none" 
                                    placeholder="00.000.000/0000-00"
                                />
                            </div>

                            <div className="p-4 bg-gray-900 dark:bg-black rounded-xl flex items-center justify-between mt-6">
                                <button 
                                    type="button"
                                    onClick={() => setIsLocationModalOpen(false)}
                                    className="text-white hover:text-gray-300 px-4 py-2 text-sm font-bold"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isCreatingLocation}
                                    className="px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 translate-all disabled:opacity-50 bg-cyan-700 hover:bg-cyan-800 text-white dark:bg-primary dark:hover:bg-cyan-400 dark:text-black"
                                >
                                    {isCreatingLocation ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Salvando...
                                        </>
                                    ) : (
                                        'Criar Unidade'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Toast Premium Notification */}
            {showToast && (
                <div className="fixed bottom-8 right-8 z-[100] animate-in fade-in slide-in-from-right-10 duration-500">
                    <div className="bg-gray-900 dark:bg-primary text-white dark:text-gray-900 px-6 py-4 rounded-2xl shadow-2xl border border-white/10 dark:border-black/10 flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 dark:bg-black/20 flex items-center justify-center">
                            <Settings className="w-4 h-4 text-primary dark:text-gray-900" />
                        </div>
                        <div>
                            <p className="font-bold text-sm">Configurações Salvas</p>
                            <p className="text-xs opacity-80">As alterações foram aplicadas com sucesso.</p>
                        </div>
                        <button onClick={() => setShowToast(false)} className="ml-4 hover:opacity-50">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
