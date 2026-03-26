import { NextResponse } from 'next/server';
import prisma, { getCompanyByUserId } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { GoogleGenAI } from '@google/genai';

export async function GET(request: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        
        if (!query || query.length < 2) {
            return NextResponse.json({ clients: [], products: [], services: [], aiSuggestion: null });
        }

        const company = await getCompanyByUserId(session.id as string);
        if (!company) return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });

        const companyId = company.id;

        // 1. Buscas Relacionais (Paralelas)
        const searchPattern = `%${query}%`;
        
        const [clients, products, services] = await Promise.all([
            prisma.$queryRaw`
                SELECT id, name, email, phone 
                FROM "User" 
                WHERE "companyId" = ${companyId} AND "role" = 'CLIENT' 
                AND (name ILIKE ${searchPattern} OR email ILIKE ${searchPattern} OR phone ILIKE ${searchPattern})
                LIMIT 3
            `,
            prisma.$queryRaw`
                SELECT id, name, price, stock 
                FROM "Product" 
                WHERE "companyId" = ${companyId} 
                AND name ILIKE ${searchPattern}
                LIMIT 3
            `,
            prisma.$queryRaw`
                SELECT id, name, price, duration 
                FROM "Service" 
                WHERE "companyId" = ${companyId} 
                AND name ILIKE ${searchPattern}
                LIMIT 3
            `
        ]);

        // 2. IA Routing
        let aiSuggestion = null;
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            
            const prompt = `Você é um mapeador inteligente de intenções de um sistema SaaS.
O lojista digitou a seguinte intenção na barra de busca: "${query}"

Mapeie esta intenção APENAS para UMA das rotas abaixo.
Responda ESTRITAMENTE em formato JSON, e APENAS o JSON, sem markdown. 
Exemplo: {"url": "/dashboard/rota", "label": "Ação Inteligente...", "type": "Ação Sugerida"}.

Rotas disponíveis:
- /dashboard (Visão geral, métricas)
- /dashboard/agenda (Agendamentos)
- /dashboard/tarefas (Checklist)
- /dashboard/consulta (Consultar histórico)
- /dashboard/bloqueios (Feriados e folgas)
- /dashboard/clientes (Gerenciar clientes)
- /dashboard/profissionais (Equipe)
- /dashboard/servicos (Serviços oferecidos)
- /dashboard/produtos (Estoque)
- /dashboard/faq (Autoatendimento)
- /dashboard/mensagens (Chats de WhatsApp)
- /dashboard/relatorios (Finanças e extratos)
- /dashboard/config (Configurações da loja)

Opcional: Pode adicionar "?action=new" se quer cadastrar algo. Ex: "/dashboard/servicos?action=new" se a busca for "add serviço"`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            
            const textResponse = response.text || "";
            const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
            
            if (jsonMatch) {
                aiSuggestion = JSON.parse(jsonMatch[0]);
            }
        } catch (e) {
            console.error("AI Routing failed:", e);
        }

        return NextResponse.json({
            clients: clients || [],
            products: products || [],
            services: services || [],
            aiSuggestion
        });
        
    } catch (error: any) {
        console.error("GET Dashboard Search Error:", error);
        return NextResponse.json({ error: "Erro interno", details: error.message }, { status: 500 });
    }
}
