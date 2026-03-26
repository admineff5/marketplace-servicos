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
        
        const [clients, products, services, popularClients] = await Promise.all([
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
            `,
            prisma.$queryRaw`
                SELECT name 
                FROM "User" 
                WHERE "companyId" = ${companyId} AND "role" = 'CLIENT' 
                ORDER BY "createdAt" DESC 
                LIMIT 100
            `
        ]);

        const clientNames = (popularClients as any[]).map((c: any) => c.name).join(', ');

        // 2. IA Routing com Fuzzy Matching Dinâmico
        let aiSuggestions = [];
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            
            const prompt = `Você é o Roteador Inteligente de um sistema SaaS. O usuário digitou: "${query}"

Sua tarefa: Descobrir o que ele quer fazer e devolver até 3 links que resolvem a intenção dele.

DICAS EXTREMAMENTE IMPORTANTES:
1) Tolerância a erros (Fuzzy Match): Se o usuário digitou "rodrt", "jooa", ou "corte decrade", assuma que é um typo! 
Aqui estão alguns clientes cadastrados: [${clientNames}]. Se parecer com algum deles, USE O NOME CORRETO NAS URLs!

2) Múltiplos Destinos: Se o usuário pesquisar o nome de alguém, ofereça ir para o Perfil do Cliente E ir para a Agenda dele.
- Gestão de Cliente: /dashboard/clientes?q=NOME_CORRETO
- Ver na Agenda: /dashboard/agenda?view=list&q=NOME_CORRETO

3) Filtros de Tempo Naturais:
- "agendamentos de hoje": /dashboard/agenda?view=list&startDate=HOJE&endDate=HOJE (use formato YYYY-MM-DD para as datas atuais).
- "agendamentos do dia 13 a 20": /dashboard/agenda?view=list&startDate=YYYY-03-13&endDate=YYYY-03-20

4) Ações Rápidas:
- "cadastrar fulano": /dashboard/clientes?action=new
- "novo corte": /dashboard/servicos?action=new

Responda ESTRITAMENTE em formato ARRAY JSON. Apresente o JSON puro (SEM \`\`\`json).
Exemplo:
[
  {"url": "/dashboard/clientes?q=rodrigo", "label": "rodrigo [Gestão de Cliente]"},
  {"url": "/dashboard/agenda?view=list&q=rodrigo", "label": "rodrigo [Agenda]"}
]`;

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
            clients: clients || [],
            products: products || [],
            services: services || [],
            aiSuggestions
        });
        
    } catch (error: any) {
        console.error("GET Dashboard Search Error:", error);
        return NextResponse.json({ error: "Erro interno", details: error.message }, { status: 500 });
    }
}
