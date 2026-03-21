"use client";

import { useState, useEffect } from "react";
import { MessageSquareCode, CheckCircle2, Bot, User, Send, Smartphone, Loader2, Power, AlertTriangle } from "lucide-react";

export default function MensagensPage() {
    const [isConnected, setIsConnected] = useState(false);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [status, setStatus] = useState<"DISCONNECTED" | "QRCODE" | "CONNECTED" | "DISCONNECTING" | "ERROR">("DISCONNECTED");
    const [myNumber, setMyNumber] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedChat, setSelectedChat] = useState<string | null>(null);

    // 🕵️‍♀️ Agrupa mensagens por Cliente (senderNum)
    const chats = messages.reduce((acc: any, msg: any) => {
        const chatKey = msg.senderNum; 
        
        // ⚠️ Ignora mensagens de 'AI' antigas que ficaram órfãs no banco
        if (chatKey === 'AI' || !chatKey) return acc; 

        if (!acc[chatKey]) {
            acc[chatKey] = {
                senderNum: chatKey,
                senderName: msg.senderName && msg.senderName !== 'Assistente IA' ? msg.senderName : "Cliente",
                lastMessage: msg.content,
                timestamp: msg.timestamp,
                items: []
            };
        }
        acc[chatKey].items.push(msg);
        return acc;
    }, {});

    const chatList = Object.values(chats).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // 🔄 Auto-seleciona a primeira conversa na carga inicial
    useEffect(() => {
        if (!selectedChat && chatList.length > 0) {
            setSelectedChat((chatList[0] as any).senderNum);
        }
    }, [messages, selectedChat, chatList]);

    const loadData = async () => {
        try {
            const res = await fetch("/api/dashboard/whatsapp");
            const data = await res.json();
            
            if (data && !data.error) {
                setStatus(data.session.status);
                setQrCode(data.session.qrCode);
                setMyNumber(data.session.number);
                setIsConnected(data.session.status === "CONNECTED");
                const mappedMessages = (data.messages || []).map((msg: any) => {
                    const realName = data.clientNames && data.clientNames[msg.senderNum];
                    return {
                        ...msg,
                        senderName: realName || (msg.senderName && msg.senderName !== 'Assistente IA' ? msg.senderName : "Cliente")
                    };
                });
                setMessages(mappedMessages);
            }
        } catch (error) {
            console.error("Erro ao carregar sessão WhatsApp:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 4000);
        return () => clearInterval(interval);
    }, []);

    const handleAction = async (action: "CONNECT" | "DISCONNECT") => {
        try {
            await fetch("/api/dashboard/whatsapp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action })
            });
            loadData();
        } catch (error) {
            console.error(`Erro ao disparar ação ${action}:`, error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-600 dark:text-primary" />
            </div>
        );
    }

    if (!isConnected) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="max-w-md w-full p-8 bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl text-center space-y-6 animate-in fade-in slide-in-from-bottom-5">
                    <div className="mx-auto w-16 h-16 bg-cyan-50 dark:bg-cyan-900/10 rounded-full flex items-center justify-center text-cyan-700 dark:text-primary animate-pulse">
                        <Smartphone className="w-8 h-8" />
                    </div>
                    
                    <div className="space-y-2">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Ative a sua IA no WhatsApp</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Conecte o número da sua loja. Lembre-se que você precisa estar rodando o script `scripts/whatsapp_worker.js` no servidor para o robô Processar a conexão!
                        </p>
                    </div>

                    {status === "ERROR" && (
                        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-600 dark:text-red-400 text-left flex gap-3">
                            <AlertTriangle className="w-5 h-5 shrink-0" />
                            <div className="space-y-1">
                                <p className="font-bold">Falha na Conexão</p>
                            </div>
                        </div>
                    )}

                    {status === "QRCODE" && qrCode ? (
                        <div className="p-4 bg-gray-50 dark:bg-[#161618] rounded-2xl flex flex-col items-center space-y-4 border border-gray-100 dark:border-gray-800">
                            <img src={qrCode} alt="WhatsApp QR Code" className="w-56 h-56 rounded-lg shadow-md border-2 border-white dark:border-gray-600" />
                            <p className="text-xs text-center text-gray-500 font-mediumLeading">
                                Abra o WhatsApp {">"} Dispositivos Conectados {">"} Escaneie o QR Code.
                            </p>
                            <button
                                onClick={() => handleAction("DISCONNECT")}
                                className="mt-2 text-xs text-red-600 hover:text-red-700 underline font-medium cursor-pointer"
                            >
                                Cancelar / Renovar QR Code
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => handleAction("CONNECT")}
                            disabled={status === "QRCODE"}
                            className="w-full py-3 px-6 bg-cyan-600 dark:bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-cyan-700 dark:hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                        >
                            {status === "QRCODE" ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Smartphone className="w-4 h-4" />
                            )}
                            {status === "QRCODE" ? "Gerando QR Code..." : status === "ERROR" ? "Tentar Novamente" : "Iniciar Conexão/Gerar QR Code"}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    const currentChatMessages = selectedChat && chats[selectedChat] ? chats[selectedChat].items : [];
    const currentChatName = selectedChat && chats[selectedChat] ? chats[selectedChat].senderName : "Conversa";

    return (
        <div className="w-[94%] mx-auto w-full h-[calc(100vh-140px)] flex border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111] rounded-2xl shadow-xl overflow-hidden animate-in fade-in">
            <div className="w-80 border-r border-gray-100 dark:border-gray-800 flex flex-col">
                <header className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between text-gray-900 dark:text-white">
                    <h2 className="font-bold text-base flex items-center gap-2">
                        <Bot className="w-5 h-5 text-cyan-600 dark:text-primary" />
                        Conversas
                    </h2>
                </header>

                <div className="flex-1 overflow-y-auto">
                    {chatList.length === 0 ? (
                        <div className="p-4 text-center text-gray-400 text-xs">Nenhuma conversa recente</div>
                    ) : (
                        <div className="p-2 space-y-1">
                            {chatList.map((chat: any) => (
                                <button
                                    key={chat.senderNum}
                                    onClick={() => setSelectedChat(chat.senderNum)}
                                    className={`w-full p-3 rounded-xl text-left border transition-all flex items-center gap-3 ${
                                        selectedChat === chat.senderNum
                                            ? "bg-cyan-50 border-cyan-100 dark:bg-cyan-900/20 dark:border-cyan-800"
                                            : "border-transparent hover:bg-gray-50 dark:hover:bg-[#161616]"
                                    }`}
                                >
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-xs">
                                        {chat.senderName.substring(0, 1).toUpperCase()}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{chat.senderName}</h4>
                                        <p className="text-[10px] text-gray-400 truncate mt-0.5">{chat.lastMessage}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                    <button 
                        onClick={() => handleAction("DISCONNECT")}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold transition-all"
                    >
                        <Power className="w-4 h-4" />
                        Desativar IA no WhatsApp
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col h-full bg-[#e5ddd5] dark:bg-[#0b141a] relative overflow-hidden">
                {/* 📱 Background Doodle WhatsApp */}
                <div 
                    className="absolute inset-0 bg-repeat bg-center bg-[length:400px] opacity-[0.06] dark:opacity-[0.04] pointer-events-none" 
                    style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" }}
                ></div>

                <header className="p-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111] flex justify-between items-center z-10">
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">{currentChatName}</h3>
                        <p className="text-[10px] text-gray-400">{selectedChat}</p>
                    </div>
                </header>

                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar z-10">
                    {currentChatMessages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                            <Bot className="w-12 h-12 text-gray-300 animate-bounce" />
                            <p className="text-xs">Inicie uma conversa para visualizar.</p>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto w-full flex flex-col gap-2.5">
                            {[...currentChatMessages].reverse().map((msg) => (
                                <div 
                                    key={msg.id} 
                                    className={`flex flex-col ${msg.from === "CLIENT" ? "items-start" : "items-end"}`}
                                >
                                    <div className={`max-w-md p-2.5 px-3.5 rounded-xl text-sm shadow-sm ${
                                        msg.from === "CLIENT" 
                                            ? "bg-white dark:bg-[#202c33] text-gray-800 dark:text-gray-100 rounded-tl-none" 
                                            : "bg-[#d9fdd3] dark:bg-[#005c4b] text-gray-800 dark:text-gray-100 rounded-tr-none"
                                    }`}>
                                        {msg.content}
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-1 px-1">
                                        {msg.from === "CLIENT" ? (msg.senderName || "Cliente") : "Assistente IA"} • {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
