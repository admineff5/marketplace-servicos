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

        // 1. Buscas Relacionais (Paralelas, Tipadas usando Prisma)
        const [products, services, matchLeads, recentAppointments, recentLeads] = await Promise.all([
            prisma.product.findMany({
                where: { companyId, name: { contains: query, mode: 'insensitive' } },
                select: { id: true, name: true, price: true, stock: true },
                take: 3
            }),
            prisma.service.findMany({
                where: { companyId, name: { contains: query, mode: 'insensitive' } },
                select: { id: true, name: true, price: true, duration: true },
                take: 3
            }),
            prisma.lead.findMany({
                where: { companyId, name: { contains: query, mode: 'insensitive' } },
                select: { id: true, name: true, phone: true },
                take: 3
            }),
            prisma.appointment.findMany({
                where: { location: { companyId } },
                select: { user: { select: { name: true } } },
                orderBy: { date: 'desc' },
                take: 100
            }),
            prisma.lead.findMany({
                where: { companyId },
                select: { name: true },
                orderBy: { createdAt: 'desc' },
                take: 50
            })
        ]);

        const allNames = [
            ...recentAppointments.map((a: any) => a.user?.name),
            ...recentLeads.map((l: any) => l.name)
        ].filter(Boolean);
        
        const clientNames = Array.from(new Set(allNames)).join(', ');

        // 2. IA Routing com Fuzzy Matching Dinâmico
        let aiSuggestions = [];
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const todayStr = new Date().toISOString().split('T')[0];
            
            const prompt = `Você é o Roteador Inteligente (OmniSearch) de um sistema SaaS. O usuário digitou na barra de busca: "${query}"

Sua tarefa: Devolver até 3 links diretos (Deep Links) que resolvam a intenção dele em formato ARRAY JSON.

Nomes de Clientes no BD: [${clientNames}].
Data de Hoje: ${todayStr}

DICAS EXTREMAMENTE IMPORTANTES:
1) FUZZY MATCH AGRESSIVO: Se a busca for uma palavra solta que parece um nome próprio (ex: "rodrt", "maria", "jooa"), assuma IMEDIATAMENTE que ele quer buscar um cliente! Procure na lista [${clientNames}], ache o correto (ex: Rodrigo) e gere 2 links obrigatórios:
- {"url": "/dashboard/clientes?q=Rodrigo", "label": "Buscar Rodrigo [Gestão de Cliente]"}
- {"url": "/dashboard/agenda?view=list&q=Rodrigo", "label": "Buscar Rodrigo [Agenda]"}

2) FILTROS NATURAIS: 
- "agenda de hoje" -> {"url": "/dashboard/agenda?view=list&startDate=${todayStr}&endDate=${todayStr}", "label": "Agenda de Hoje"}
- "amanha", "ontem", "semana que vem": calcule com base na Data de Hoje (${todayStr}).

3) AÇÕES RÁPIDAS: "adicionar fulano" -> /dashboard/clientes?action=new

Retorne APENAS o JSON puro (NUNCA markdown, comece com '[' e termine com ']'). Tente sempre sugerir algo!`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            
            const textResponse = response.text || "";
            const jsonMatch = textResponse.match(/\[[\s\S]*\]/);
            
            if (jsonMatch) {
                aiSuggestions = JSON.parse(jsonMatch[0]);
            }
        } catch (e) {
            console.error("AI Routing failed:", e);
        }

        return NextResponse.json({
            clients: matchLeads || [],
            products: products || [],
            services: services || [],
            aiSuggestions
        });
        
    } catch (error: any) {
        console.error("GET Dashboard Search Error:", error);
        return NextResponse.json({ error: "Erro interno", details: error.message }, { status: 500 });
    }
}
