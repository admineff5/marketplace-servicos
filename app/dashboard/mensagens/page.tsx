"use client";

import { useState, useEffect } from "react";
import { MessageSquareCode, QrCode, CheckCircle2, Bot, User, Send, Smartphone } from "lucide-react";

const MOCK_MESSAGES = [
    { id: 1, sender: "CLIENT", senderName: "Mariana Silva", senderNum: "+55 11 99999-8888", content: "Olá, tem horário para amanhã?", timestamp: "10:30", type: "text" },
    { id: 2, sender: "AI", senderName: "Atendente IA", senderNum: "AI", content: "Olá Mariana! Sim, temos horários disponíveis amanhã. Você gostaria de realizar qual procedimento? Temos Limpeza de Pele às 14h e Design de Sobrancelha às 16h.", timestamp: "10:31", type: "text" },
    { id: 3, sender: "CLIENT", senderName: "Mariana Silva", senderNum: "+55 11 99999-8888", content: "Limpeza de pele de preferência", timestamp: "10:32", type: "text" },
    { id: 4, sender: "AI", senderName: "Atendente IA", senderNum: "AI", content: "Perfeito! Consegui agendar sua Limpeza de Pele para amanhã, dia 19/03 às 14:00. Posso confirmar?", timestamp: "10:32", type: "text" },
    { id: 5, sender: "CLIENT", senderName: "Mariana Silva", senderNum: "+55 11 99999-8888", content: "Pode sim, obrigada!", timestamp: "10:33", type: "text" },
    { id: 6, sender: "AI", senderName: "Atendente IA", senderNum: "AI", content: "Agendamento CONFIRMADO! ✅ Nos vemos amanhã às 14h na Clínica Estética. Qualquer dúvida estou à disposição!", timestamp: "10:33", type: "text" },
];

export default function MensagensPage() {
    const [isConnected, setIsConnected] = useState(false);
    const [showQrCode, setShowQrCode] = useState(false);
    const [selectedChat, setSelectedChat] = useState<string | null>(null);

    // Conectar simulação
    const handleSimulateConnection = () => {
        setShowQrCode(true);
        setTimeout(() => {
            setIsConnected(true);
            setShowQrCode(false);
            setSelectedChat("+55 11 99999-8888");
        }, 3000); // 3 segundos simulando leitura de QR Code
    };

    if (!isConnected) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="max-w-md w-full p-8 bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl text-center space-y-6 animate-in fade-in slide-in-from-bottom-5">
                    <div className="mx-auto w-16 h-16 bg-cyan-50 dark:bg-cyan-900/10 rounded-full flex items-center justify-center text-cyan-700 dark:text-primary animate-pulse">
                        <Smartphone className="w-8 h-8" />
                    </div>
                    
                    <div className="space-y-2">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Conecte o seu WhatsApp</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Para que a IA responda aos seus clientes em tempo real, você precisa linkar o WhatsApp da sua loja no nosso painel.
                        </p>
                    </div>

                    {showQrCode ? (
                        <div className="p-4 bg-gray-50 dark:bg-[#161618] rounded-2xl flex flex-col items-center space-y-4 border border-gray-100 dark:border-gray-800">
                            <QrCode className="w-44 h-44 text-gray-800 dark:text-gray-200" />
                            <p className="text-xs text-center text-gray-500 font-medium">
                                Abra o WhatsApp {">"} Dispositivos Conectados {">"} Conectar um Dispositivo.
                            </p>
                            <span className="text-[10px] text-cyan-600 dark:text-primary font-bold animate-bounce mt-2">
                                Simulando Leitura de QR Code... ⏳
                            </span>
                        </div>
                    ) : (
                        <button
                            onClick={handleSimulateConnection}
                            className="w-full py-3 px-6 bg-cyan-600 dark:bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-cyan-700 dark:hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                        >
                            <QrCode className="w-4 h-4" />
                            Gerar QR Code de Conexão
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-140px)] flex border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111] rounded-2xl shadow-xl overflow-hidden animate-in fade-in">
            {/* Sidebar de Chats */}
            <div className="w-80 border-r border-gray-100 dark:border-gray-800 flex flex-col">
                <header className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between text-gray-900 dark:text-white">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        <Bot className="w-5 h-5 text-cyan-600 dark:text-primary" />
                        Conversas IA
                    </h2>
                    <span className="text-[10px] bg-green-500/10 text-green-600 dark:text-green-400 font-bold px-2 py-0.5 rounded-full">Online</span>
                </header>

                <div className="flex-1 overflow-y-auto">
                    {["+55 11 99999-8888"].map((phone) => (
                        <button
                            key={phone}
                            onClick={() => setSelectedChat(phone)}
                            className={`w-full p-4 flex items-center gap-3 border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/10 transition-colors ${selectedChat === phone ? 'bg-cyan-50/50 dark:bg-cyan-900/10' : ''}`}
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                                <User className="w-5 h-5" />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Mariana Silva</h3>
                                <p className="text-xs text-gray-500 truncate">{MOCK_MESSAGES[MOCK_MESSAGES.length-1].content}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Area de Conversa */}
            <div className="flex-1 flex flex-col h-full">
                <header className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-gray-50/50 dark:bg-[#161618]">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                        <User className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Mariana Silva</h3>
                        <p className="text-xs text-cyan-600 dark:text-primary font-bold flex items-center gap-1">
                            <Bot className="w-3 h-3" /> Assistente IA respondendo...
                        </p>
                    </div>
                </header>

                <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar bg-gray-50/20 dark:bg-[#0a0a0a]">
                    {MOCK_MESSAGES.map((msg) => (
                        <div 
                            key={msg.id} 
                            className={`flex flex-col ${msg.sender === "CLIENT" ? "items-start" : "items-end"}`}
                        >
                            <div className={`max-w-md p-3.5 rounded-2xl text-sm shadow-sm ${
                                msg.sender === "CLIENT" 
                                    ? "bg-white dark:bg-[#18181a] border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none" 
                                    : "bg-cyan-600 dark:bg-primary text-white rounded-tr-none"
                            }`}>
                                {msg.content}
                            </div>
                            <span className="text-[10px] text-gray-400 mt-1 px-1">
                                {msg.sender === "AI" ? "IA Atendente" : "Cliente"} • {msg.timestamp}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                    <input 
                        type="text" 
                        placeholder="A IA está no controle. Digite algo para assumir o chat..." 
                        disabled 
                        className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-400 cursor-not-allowed"
                    />
                    <button disabled className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed">
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
