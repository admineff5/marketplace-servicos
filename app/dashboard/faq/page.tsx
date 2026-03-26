"use client";

import { useState, useEffect } from "react";
import { HelpCircle, Save, CheckCircle2, AlertTriangle, Loader2, Sparkles } from "lucide-react";

const ESTETICA_QUESTIONS = [
    { id: "q2", question: "Vocês atendem por ordem de chegada ou apenas com agendamento?" },
    { id: "q3", question: "Qual é a política de cancelamento ou atraso (tolerância) da loja?" },
    { id: "q4", question: "Vocês possuem estacionamento no local ou convênio?" },
    { id: "q5", question: "Quais são as formas de pagamento aceitas (Pix, cartão, dinheiro)?" },
    { id: "q6", question: "Quais são os dias e horários de funcionamento padrão?" },
    { id: "q7", question: "Vocês realizam atendimento para eventos (ex: Dia da Noiva, Formaturas)?" },
    { id: "q8", question: "Existe algum preparo necessário para os procedimentos (ex: depilação, peeling)?" },
    { id: "q9", question: "Vocês trabalham com venda de pacotes de sessões ou planos recorrentes?" },
    { id: "q10", question: "Como funciona a garantia ou retorno de procedimentos oferecidos?" },
    { id: "knowledge_rag", question: "Base de Conhecimento da Empresa (Treinamento Avançado)", isRag: true }
];

export default function FaqPage() {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

    useEffect(() => {
        // Carrega respostas salvas (simulado ou real API)
        fetch("/api/dashboard/faq")
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    const loadedAnswers: Record<string, string> = {};
                    data.forEach((ans: any) => {
                        loadedAnswers[ans.questionId] = ans.answer;
                    });
                    setAnswers(loadedAnswers);
                }
            })
            .catch(() => {});
    }, []);

    const handleChange = (id: string, value: string) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        setSaveStatus("saving");

        try {
            const res = await fetch("/api/dashboard/faq", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers }),
            });

            if (res.ok) {
                setSaveStatus("success");
                setTimeout(() => setSaveStatus("idle"), 3000);
            } else {
                setSaveStatus("error");
            }
        } catch (error) {
            setSaveStatus("error");
        } finally {
            setLoading(false);
        }
    };

    const answeredCount = Object.values(answers).filter(a => a.trim().length > 0).length;
    const progress = (answeredCount / ESTETICA_QUESTIONS.length) * 100;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <HelpCircle className="w-6 h-6 text-cyan-600 dark:text-primary" />
                        FAQ Assistente (IA)
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Responda às perguntas abaixo para alimentar o conhecimento da sua Inteligência Artificial. 
                        Ela usará essas informações para conversar e responder automaticamente aos seus clientes via WhatsApp.
                    </p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={loading || answeredCount === 0}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 ${
                        answeredCount === 0 
                            ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed" 
                            : "bg-cyan-600 dark:bg-primary text-white dark:text-black hover:bg-cyan-700 dark:hover:bg-primary/90"
                    }`}
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : saveStatus === "success" ? (
                        <CheckCircle2 className="w-4 h-4" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {saveStatus === "saving" ? "Salvando..." : saveStatus === "success" ? "Salvo!" : saveStatus === "error" ? "Erro ao Salvar" : "Salvar Respostas"}
                </button>
            </header>

            {/* Barra de Progresso */}
            <div className="bg-white dark:bg-[#111] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-500">
                    <span>Progresso do Treinamento</span>
                    <span>{answeredCount} de {ESTETICA_QUESTIONS.length} respondidas</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-cyan-600 dark:bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Lista de Perguntas */}
            <div className="space-y-4">
                {ESTETICA_QUESTIONS.map((q, index) => (
                    <div 
                        key={q.id}
                        className={`bg-white dark:bg-[#111] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-200 group ${q.isRag ? 'border-primary/30 dark:border-primary/30 shadow-[0_0_15px_rgba(0,255,255,0.05)]' : 'hover:border-cyan-200 dark:hover:border-cyan-900/40'}`}
                    >
                        <div className="flex items-start gap-3">
                            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 mt-0.5 ${q.isRag ? 'bg-gray-900 text-white dark:bg-primary dark:text-black' : 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-primary'}`}>
                                {q.isRag ? <Sparkles className="w-3.5 h-3.5" /> : index + 1}
                            </span>
                            <div className="flex-1 space-y-2">
                                <label className="block text-sm font-bold text-gray-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-primary transition-colors">
                                    {q.question}
                                </label>
                                {q.isRag && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                        Insira textos abertos, regras exclusivas, perguntas e respostas extras que você quer que 
                                        sua IA saiba. Este campo é indexado para a memória livre da Inteligência Artificial.
                                    </p>
                                )}
                                <textarea
                                    value={answers[q.id] || ""}
                                    onChange={(e) => handleChange(q.id, e.target.value)}
                                    placeholder={q.isRag ? "Ex: O dono da loja se chama Rodrigo. A senha do Wi-Fi é #Loja123. Se o cliente perguntar sobre cortes infantis, diga que só atendemos crianças maiores que 5 anos..." : "Escreva como se estivesse explicando para um cliente direto no WhatsApp..."}
                                    rows={q.isRag ? 8 : 3}
                                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-cyan-600 dark:focus:border-primary focus:ring-1 focus:ring-cyan-600 transition-all ${q.isRag ? 'resize-y min-h-[150px]' : 'resize-none'}`}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {answeredCount === 0 && (
                <div className="flex items-center gap-2 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/50 rounded-xl text-amber-800 dark:text-amber-400 text-sm">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <span>Responda pelo menos 1 pergunta para capacitar a IA a responder como sua secretária digital.</span>
                </div>
            )}
        </div>
    );
}
