import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const companies = await prisma.company.findMany({
            include: {
                locations: {
                    select: { id: true, address: true, name: true },
                },
                services: {
                    select: { id: true, name: true, price: true, duration: true },
                },
                employees: {
                    select: { id: true, name: true, hours: true, image: true, locationId: true },
                },
                blocks: {
                    where: {
                        date: { gte: new Date(new Date().setHours(0,0,0,0)) }
                    },
                    select: { id: true, date: true, situation: true, employeeId: true, isAllDay: true, openTime: true, closeTime: true }
                }
            },
        });

        // Transformar para o formato esperado pelo layout (Por Unidade)
        const transformedLocations: any[] = [];

        companies.forEach(company => {
            company.locations.forEach(loc => {
                transformedLocations.push({
                    id: `${company.id}-${loc.id}`,
                    companyId: company.id,
                    locationId: loc.id,
                    name: company.name + (company.locations.length > 1 ? ` - ${loc.name}` : ""),
                    niche: company.niche || "Serviços",
                    rating: "5.0",
                    reviews: Math.floor(Math.random() * 100),
                    address: loc.address || "Endereço não informado",
                    image: company.imageUrl || "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800",
                    logo: company.imageUrl || "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=150",
                    description: "Especialista em " + (company.niche || "serviços de qualidade"),
                    services: company.services.map(s => ({
                        id: s.id,
                        companyId: company.id,
                        name: s.name,
                        price: "R$ " + s.price,
                        duration: s.duration || "30 min"
                    })),
                    staff: company.employees
                        .filter(e => !e.locationId || e.locationId === loc.id)
                        .map(e => ({
                            id: e.id,
                            name: e.name,
                            hours: e.hours,
                            image: e.image || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=60"
                        })),
                    blocks: company.blocks
                });
            });
        });

        return NextResponse.json(transformedLocations);
    } catch (error) {
        console.error("Fetch Companies Error:", error);
        return NextResponse.json({ error: "Erro ao buscar empresas" }, { status: 500 });
    }
}
