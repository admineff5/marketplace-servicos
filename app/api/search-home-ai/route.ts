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

        const prompt = `Você é um extrator de intenções para um Marketplace de Serviços chamado AgendeJá.
O usuário digitou: "${query}"

Sua tarefa é extrair as seguintes informações em formato JSON puro:
- service: (O tipo de serviço ou categoria, ex: "Barbearia", "Corte de Cabelo")
- location: (Cidade, Bairro ou CEP mencionado. Se for CEP, retorne apenas os números)
- date: (Data mencionada no formato YYYY-MM-DD. Hoje é ${dateStr} (${dayOfWeek}). Calcule datas relativas como "amanhã", "sábado", "dia 27")
- time: (Horário mencionado no formato HH:mm. Ex: "11:00")
- name: (Se o usuário estiver buscando uma loja específica pelo nome)

Regras:
1. Se a informação não existir, retorne null.
2. Para horários aproximados como "final da tarde", retorne "17:00".
3. Retorne APENAS o JSON, sem markdown ou explicações.

Exemplo de Saída:
{
  "service": "barbeiro",
  "location": "São Paulo",
  "date": "2026-03-27",
  "time": "11:00",
  "name": null
}`;

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
