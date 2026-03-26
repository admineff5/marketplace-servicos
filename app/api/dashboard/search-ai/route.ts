import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma, { getCompanyByUserId } from "@/lib/prisma";
import { GoogleGenAI } from '@google/genai';

export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const url = new URL(req.url);
        const query = url.searchParams.get("q") || "";

        if (query.trim().length < 2) {
            return NextResponse.json({ aiSuggestions: [] });
        }

        const company = await getCompanyByUserId(session.id as string);
        if (!company) return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
        const companyId = company.id;

        const [recentAppointments, recentLeads] = await Promise.all([
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

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const todayStr = new Date().toISOString().split('T')[0];
        
        const prompt = `Você é o Roteador Inteligente (OmniSearch) de um sistema SaaS. O usuário digitou na barra de busca: "${query}"

Sua tarefa: Devolver 1 a 3 links diretos (Deep Links) em formato ARRAY JSON.

ROTAS REAIS DO SISTEMA PERMITIDAS (NUNCA INVENTE OUTRA, EVITE ERRO 404):
- /dashboard
- /dashboard/agenda
- /dashboard/clientes
- /dashboard/profissionais
- /dashboard/servicos
- /dashboard/produtos (Aqui fica o Controle de Estoque)
- /dashboard/relatorios

Nomes de Clientes válidos no BD: [${clientNames}].
Data de Hoje: ${todayStr}

REGRAS RÍGIDAS:
1) NOME DE CLIENTE SOLTO: Se o texto parecer um nome e estiver na lista, devolva APENAS:
   [{"url": "/dashboard/clientes?q=NOME_CORRETO", "label": "Buscar NOME_CORRETO [Gestão de Cliente]"}]
   *Só devolva link para a Agenda se ele pedir "agenda rodrigo" explicitamente.*

2) FILTROS NA AGENDA:
   - "agenda de hoje" -> {"url": "/dashboard/agenda?view=list&startDate=${todayStr}&endDate=${todayStr}", "label": "Ver Agendamentos de Hoje"}
   - "amanhã" ou "ontem" -> Calcule baseando-se em ${todayStr} (sempre formato YYYY-MM-DD).

3) ROTAS COMUNS (Mapeamento Forte):
   - "estoque" -> {"url": "/dashboard/produtos", "label": "Acessar Estoque de Produtos"}
   - "novo servico" -> {"url": "/dashboard/servicos?action=new", "label": "Cadastrar Novo Serviço"}
   - "finanças" -> {"url": "/dashboard/relatorios", "label": "Acessar Relatórios Financeiros"}

Retorne ESTE ARRAY JSON PURO. Se não tiver certeza, sugira a tela mais próxima das PERMITIDAS.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const textResponse = response.text || "";
        const jsonMatch = textResponse.match(/\[[\s\S]*\]/);
        
        let aiSuggestions = [];
        if (jsonMatch) {
            aiSuggestions = JSON.parse(jsonMatch[0]);
        }

        return NextResponse.json({ aiSuggestions });

    } catch (error: any) {
        console.error("Search AI API Error:", error);
        return NextResponse.json({ aiSuggestions: [] }); // Safe fallback
    }
}
