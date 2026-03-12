import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const companies = await prisma.company.findMany({
            include: {
                services: true,
                employees: true,
                locations: true,
            },
        });

        // Transformar para o formato esperado pelo layout (com ratings mockados por enquanto se não houver tabela de reviews)
        const transformedCompanies = companies.map(company => ({
            id: company.id,
            name: company.name,
            niche: company.niche || "Serviços",
            rating: "5.0", // Mock por enquanto
            reviews: Math.floor(Math.random() * 100), // Mock por enquanto
            address: company.locations[0]?.address || "Endereço não informado",
            image: company.imageUrl || "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800",
            logo: company.imageUrl || "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=150",
            description: "Especialista em " + (company.niche || "serviços de qualidade"),
            services: company.services.map(s => ({
                name: s.name,
                price: "R$ " + s.price,
                duration: s.duration || "30 min"
            })),
            staff: company.employees.map(e => ({
                id: e.id,
                name: e.name,
                image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=60"
            }))
        }));

        return NextResponse.json(transformedCompanies);
    } catch (error) {
        console.error("Fetch Companies Error:", error);
        return NextResponse.json({ error: "Erro ao buscar empresas" }, { status: 500 });
    }
}
