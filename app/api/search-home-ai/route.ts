import { NextResponse } from "next/server";
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
    try {
        const { query } = await req.json();

        if (!query || query.trim().length < 3) {
            return NextResponse.json({ 
                extracted: null, 
                error: "Query muito curta" 
            });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
        
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        const dayOfWeek = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"][today.getDay()];

        const prompt = `Você é um motor de busca semântico ultra-inteligente para o marketplace "AgendeJá".
O usuário digitou: "${query}"

Sua missão é extrair um JSON com:
- service: (O nicho ou serviço. Priorize usar um destes se possível: "Barbearia", "Clínica", "Estética")
- location: (Cidade, Bairro, CEP ou Rua. Extraia só o nome, sem "perto de")
- date: (YYYY-MM-DD. Hoje é ${dateStr} (${dayOfWeek}). Se disser "amanhã", use a data correta do dia seguinte)
- time: (HH:mm. Horário exato ou aproximado)
- name: (Nome de loja específica)

REGRAS CRÍTICAS:
1. Se o usuário falar algo como "procuro um serviço padrão barbearia", o 'service' deve ser "Barbearia".
2. Se ele disser "quero cortar o cabelo", 'service' é "Barbearia".
3. Se ele disser "limpeza de pele", 'service' é "Estética".
4. NÃO invente dados. Se não houver local, retorne null.
5. Retorne APENAS o JSON. Sem explicações.`;

        const result = await (ai as any).models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const text = result.text || "";
        
        // Limpar possíveis blocos de código markdown que o Gemini possa enviar
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const extracted = JSON.parse(cleanedText);

        return NextResponse.json({ extracted });

    } catch (error) {
        console.error("AI Search Home Error:", error);
        return NextResponse.json({ extracted: null, error: "Falha na análise da IA" });
    }
}
