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

        // Retorna APENAS o Instant SQL (menos de 50ms)
        return NextResponse.json({
            clients: matchLeads || [],
            products: products || [],
            services: services || []
        });

    } catch (error: any) {
        console.error("Search API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
