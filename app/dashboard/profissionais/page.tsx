"use client";
import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, X, UserSquare2, Check, Clock, CalendarDays, Upload, Image as ImageIcon, MapPin } from "lucide-react";

// AVATARES PRE-DEFINIDOS PARA NOVOS CADASTROS
const DEFAULT_AVATARS = [
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
];

export default function GestaoProfissionaisPage() {
    const [professionals, setProfessionals] = useState<any[]>([]);
    const [locations, setLocations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [unitFilter, setUnitFilter] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAvatarSelector, setShowAvatarSelector] = useState(false);
    const [editingProf, setEditingProf] = useState<any>(null);

    // Form State
    const [formName, setFormName] = useState("");
    const [formRole, setFormRole] = useState("");
    const [formDays, setFormDays] = useState("Segunda a Sexta");
    const [formTimeStart, setFormTimeStart] = useState("09:00");
    const [formTimeEnd, setFormTimeEnd] = useState("18:00");
    const [formAvatar, setFormAvatar] = useState("");
    const [formUnitId, setFormUnitId] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [profRes, locRes] = await Promise.all([
                fetch('/api/employees'),
                fetch('/api/locations')
            ]);
            const profs = await profRes.json();
            const locs = await locRes.json();
            setProfessionals(Array.isArray(profs) ? profs : []);
            setLocations(Array.isArray(locs) ? locs : []);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredProfessionals = (professionals || []).filter(p => {
        const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.role?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesUnit = !unitFilter || p.locationId === unitFilter;
        return matchesSearch && matchesUnit;
    });

    const resetForm = () => {
        setFormName("");
        setFormRole("");
        setFormDays("Segunda a Sexta");
        setFormTimeStart("09:00");
        setFormTimeEnd("18:00");
        setFormAvatar("");
        setFormUnitId("");
        setShowAvatarSelector(false);
        setEditingProf(null);
    };

    const openNewModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleEdit = (prof: any) => {
        setEditingProf(prof);
        setFormName(prof.name);
        setFormRole(prof.role || "");
        
        // Parse "Dias | Horário"
        const [savedDays, savedHours] = (prof.hours || "Segunda a Sexta | 09:00 - 18:00").split(" | ");
        setFormDays(savedDays || "Segunda a Sexta");
        
        const [start, end] = (savedHours || "09:00 - 18:00").split(" - ");
        setFormTimeStart(start);
        setFormTimeEnd(end);
        
        setFormAvatar(prof.image || "");
        setFormUnitId(prof.locationId || "");
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este profissional?")) {
            try {
                const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    fetchData();
                } else {
                    const data = await res.json();
                    alert(data.error || "Não foi possível excluir o profissional. Ele pode possuir agendamentos vinculados. Caso queira tirá-lo do ar, edite o perfil dele.");
                }
            } catch (error) {
                console.error("Erro ao excluir:", error);
                alert("Erro de conexão ao excluir.");
            }
        }
    };

    const handleSave = async () => {
        if (!formName || !formRole || !formUnitId) return;

        const payload = {
            name: formName,
            role: formRole,
            hours: `${formDays} | ${formTimeStart} - ${formTimeEnd}`,
            locationId: formUnitId,
            image: formAvatar || (editingProf?.image || DEFAULT_AVATARS[0]),
        };

        try {
            const url = editingProf ? `/api/employees/${editingProf.id}` : '/api/employees';
            const method = editingProf ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setIsModalOpen(false);
                resetForm();
                fetchData();
            }
        } catch (error) {
            console.error("Erro ao salvar:", error);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-8 bg-gray-50/50 dark:bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                            <UserSquare2 className="w-6 h-6 text-cyan-700 dark:text-primary" />
                            Gestão de Profissionais
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Organize a equipe da sua loja, defina especialidades e horários de atendimento.
                        </p>
                    </div>

                    <button
                        onClick={openNewModal}
                        className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 bg-cyan-700 hover:bg-cyan-800 text-white dark:bg-primary dark:hover:bg-cyan-400 dark:text-black"
                    >
                        <Plus className="w-4 h-4" />
                        Novo Profissional
                    </button>
                </div>

                {/* Filter Bar */}
                <div className="bg-white dark:bg-[#111112] rounded-2xl border border-gray-200 dark:border-[#222] p-4 flex flex-col sm:flex-row gap-4 shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou especialidade..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-600 dark:focus:ring-primary focus:border-cyan-600 dark:focus:border-primary transition-all"
                        />
                    </div>
                    <div className="sm:w-64">
                        <select
                            value={unitFilter}
                            onChange={e => setUnitFilter(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-cyan-600 dark:focus:ring-primary transition-all appearance-none cursor-pointer"
                        >
                            <option value="">Todas as Unidades</option>
                            {locations.map(loc => (
                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table / Grid Box - Layout Adaptable */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProfessionals.length > 0 ? filteredProfessionals.map((prof) => (
                        <div key={prof.id} className="bg-white dark:bg-[#111112] border border-gray-200 dark:border-[#222] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden flex flex-col items-center text-center">

                            {/* Profile Avatar Frame */}
                            <div className="relative mb-4">
                                <div className="w-24 h-24 rounded-full border-4 border-gray-50 dark:border-[#1a1a1c] shadow-md overflow-hidden bg-gray-200 dark:bg-gray-800">
                                    <img src={prof.image} alt={prof.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                            </div>

                            {/* Data block */}
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-0.5">{prof.name}</h3>
                            <p className="text-sm font-semibold text-cyan-700 dark:text-primary mb-2">{prof.role}</p>

                            {/* Unit Tag */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 border border-gray-200 dark:border-gray-700">
                                <MapPin className="w-3 h-3" />
                                {locations.find(l => l.id === prof.locationId)?.name}
                            </div>                             {(() => {
                                const containsPipe = prof.hours && prof.hours.includes(" | ");
                                const savedDays = containsPipe ? prof.hours.split(" | ")[0] : "Segunda a Sexta";
                                const savedHours = containsPipe ? prof.hours.split(" | ")[1] : (prof.hours || "09:00 - 18:00");
                                return (
                                    <div className="w-full flex flex-col gap-2 mt-auto">
                                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-[#1a1a1c] px-3 py-2 rounded-lg border border-gray-100 dark:border-[#2a2a2c]">
                                            <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="truncate">{savedDays}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-[#1a1a1c] px-3 py-2 rounded-lg border border-gray-100 dark:border-[#2a2a2c]">
                                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="truncate">{savedHours}</span>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Hover Actions */}
                            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(prof)}
                                    className="p-2 bg-white dark:bg-[#222] text-gray-600 dark:text-gray-300 hover:text-cyan-700 dark:hover:text-primary rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 transition-colors" title="Editar"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(prof.id)}
                                    className="p-2 bg-white dark:bg-[#222] text-gray-600 dark:text-gray-300 hover:text-red-500 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 transition-colors" title="Excluir"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                        </div>
                    )) : (
                        <div className="col-span-full py-16 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-[#111112] rounded-2xl border border-dashed border-gray-300 dark:border-[#333]">
                            <div className="flex flex-col items-center justify-center gap-3">
                                <UserSquare2 className="w-12 h-12 opacity-20" />
                                <p className="text-lg">Nenhum profissional encontrado.</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* CREATE MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm sm:items-center items-end" onClick={() => setIsModalOpen(false)}>
                    <div
                        className="w-full max-w-xl bg-white dark:bg-[#111112] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-200 dark:border-[#222]"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#222] bg-gray-50/50 dark:bg-[#161618]">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                {editingProf ? (
                                    <Edit2 className="w-5 h-5 text-cyan-700 dark:text-primary" />
                                ) : (
                                    <Plus className="w-5 h-5 text-cyan-700 dark:text-primary" />
                                )}
                                {editingProf ? "Editar Profissional" : "Novo Profissional"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">

                            {/* Profile Photo Area */}
                            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start p-4 bg-gray-50 dark:bg-[#161618] rounded-2xl border border-gray-200 dark:border-[#2a2a2c]">
                                <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111] overflow-hidden flex items-center justify-center shrink-0 shadow-sm relative group cursor-pointer" onClick={() => setShowAvatarSelector(!showAvatarSelector)}>
                                    {formAvatar ? (
                                        <img src={formAvatar} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="w-8 h-8 text-gray-400 group-hover:text-cyan-700 dark:hover:text-primary transition-colors" />
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Upload className="w-6 h-6 text-white" />
                                    </div>
                                </div>

                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Foto do Perfil</h3>
                                    <p className="text-xs text-gray-500 mb-3">Escolha um avatar da galeria rápida.</p>

                                    {/* Avatar Fast Picker */}
                                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                        {DEFAULT_AVATARS.map((av, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => setFormAvatar(av)}
                                                className={`w-10 h-10 rounded-full border-2 cursor-pointer overflow-hidden transition-all ${formAvatar === av ? 'border-cyan-700 dark:border-primary ring-2 ring-cyan-700/30 dark:ring-primary/30 scale-110 shadow-lg' : 'border-transparent hover:border-gray-400'} `}
                                            >
                                                <img src={av} alt="Avatar" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="col-span-1 sm:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                                        Unidade / Loja *
                                    </label>
                                    <select
                                        value={formUnitId}
                                        onChange={e => setFormUnitId(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:ring-1 focus:ring-cyan-600 dark:focus:ring-primary focus:border-cyan-600 dark:focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Selecione a Unidade</option>
                                        {locations.map(loc => (
                                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                                        Nome Completo *
                                    </label>
                                    <input
                                        type="text"
                                        value={formName} onChange={e => setFormName(e.target.value)}
                                        placeholder="Ex: João da Silva"
                                        className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:ring-1 focus:ring-cyan-600 dark:focus:ring-primary focus:border-cyan-600 dark:focus:border-primary outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                                        Especialidade Principal *
                                    </label>
                                    <input
                                        type="text"
                                        value={formRole} onChange={e => setFormRole(e.target.value)}
                                        placeholder="Ex: Barbeiro Sênior"
                                        className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:ring-1 focus:ring-cyan-600 dark:focus:ring-primary focus:border-cyan-600 dark:focus:border-primary outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Working Hours Box */}
                            <div className="p-5 border border-gray-200 dark:border-[#2a2a2c] rounded-2xl bg-white dark:bg-[#111] space-y-4">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-[#2a2a2c] pb-2 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-cyan-700 dark:text-primary" /> Atendimento Padrão
                                </h3>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                                        Dias da Semana (Recorrente) *
                                    </label>
                                    <select
                                        value={formDays} onChange={e => setFormDays(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:ring-1 focus:ring-cyan-600 dark:focus:ring-primary focus:border-cyan-600 dark:focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="Segunda a Sexta">Segunda a Sexta</option>
                                        <option value="Segunda a Sábado">Segunda a Sábado</option>
                                        <option value="Terça a Sábado">Terça a Sábado</option>
                                        <option value="Sábado e Domingo">Sábado e Domingo</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                                            Hora Início *
                                        </label>
                                        <input
                                            type="time"
                                            value={formTimeStart} onChange={e => setFormTimeStart(e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:ring-1 focus:ring-cyan-600 dark:focus:ring-primary focus:border-cyan-600 dark:focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                                            Hora Fim *
                                        </label>
                                        <input
                                            type="time"
                                            value={formTimeEnd} onChange={e => setFormTimeEnd(e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2a2a2c] rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:ring-1 focus:ring-cyan-600 dark:focus:ring-primary focus:border-cyan-600 dark:focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>

                            </div>

                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-[#222] bg-gray-50/50 dark:bg-[#161618] flex items-center justify-end gap-3 z-0 relative">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#222] rounded-xl transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!formName || !formRole || !formUnitId}
                                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-cyan-700 hover:bg-cyan-800 text-white dark:bg-primary dark:hover:bg-cyan-400 dark:text-black"
                            >
                                <Check className="w-4 h-4" />
                                Salvar Profissional
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
