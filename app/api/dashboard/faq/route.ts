import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma, { getCompanyByUserId } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const session = await getSession();
        
        if (!session) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        const { id: userId } = session;
        const company = await getCompanyByUserId(userId);

        if (!company) {
            return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
        }

        const answers = await prisma.companyAnswer.findMany({
            where: { companyId: company.id }
        });

        return NextResponse.json(answers || []);
    } catch (error) {
        console.error("Dashboard FAQ GET Error:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession();
        
        if (!session) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        const { id: userId } = session;
        const company = await getCompanyByUserId(userId);

        if (!company) {
            return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
        }

        const body = await request.json();
        const { answers } = body; // Objeto { questionId: "resposta" }

        if (!answers || typeof answers !== 'object') {
            return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
        }

        // Para evitar erros de chave estrangeira, nós garantimos que a NicheQuestion correspondente exista no Banco antes de salvar a resposta.
        const operations = Object.entries(answers).map(async ([qId, answer]) => {
            if (!answer || (answer as string).trim() === '') return null;

            // Cria a pergunta se for mock "q1", "q2", etc para não quebrar a Foreign Key
            await prisma.nicheQuestion.upsert({
                where: { id: qId },
                update: {},
                create: {
                    id: qId,
                    niche: "GERAL",
                    question: `Pergunta ${qId}`,
                    order: parseInt(qId.replace('q', '')) || 0,
                }
            });

            return prisma.companyAnswer.upsert({
                where: {
                    companyId_questionId: {
                        companyId: company.id,
                        questionId: qId,
                    }
                },
                update: { answer: answer as string },
                create: {
                    companyId: company.id,
                    questionId: qId,
                    answer: answer as string,
                }
            });
        });

        const resolvedQueries = (await Promise.all(operations)).filter(Boolean);

        if (resolvedQueries.length > 0) {
            // Executa todas as inserções
            await prisma.$transaction(resolvedQueries as any[]);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Dashboard FAQ POST Error:", error);
        return NextResponse.json({ error: "Erro ao salvar" }, { status: 500 });
    }
}
