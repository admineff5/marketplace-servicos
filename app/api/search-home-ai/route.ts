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

        const prompt = `Você é um extrator de intenções ultrassensível para um Marketplace de Serviços.
O usuário digitou: "${query}"

Sua tarefa é extrair as seguintes informações em formato JSON:
- service: (O tipo de serviço, nicho ou o que ele quer fazer. Ex: "corte", "unha", "barba", "limpeza de pele")
- location: (Extraia a parte geográfica: Cidade, Bairro, CEP ou nome de Rua. Remova palavras como "perto de", "ao lado de", "na")
- date: (YYYY-MM-DD. Hoje é ${dateStr}. Se ele falar "hoje", use ${dateStr}. Se não falar nada, mas falar horário, assuma ${dateStr})
- time: (HH:mm. Se ele disser "agora", use o horário aproximado mais próximo. Se disser "manhã", use "09:00", "tarde" "15:00")
- name: (Nome de uma loja específica se ele mencionar)

REGRAS DE OURO:
1. Seja FLEXÍVEL. Se ele disser "quero arrumar o rosto", service = "estética". Se disser "tô com dor", service = "clínica".
2. No 'location', extraia apenas o NÚCLEO (ex: de "perto da rua teste" extraia "rua teste").
3. Se não houver nada, retorne null.
4. Retorne APENAS o JSON puro.`;

        const result = await (ai as any).models.generateContent({
            model: 'gemini-1.5-flash',
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
