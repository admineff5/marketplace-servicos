import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("auth_session");
        
        if (!session) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        const { id: userId } = JSON.parse(session.value);

        const appointments = await (prisma.appointment as any).findMany({
            where: { userId },
            include: {
                service: {
                    select: {
                        name: true,
                        price: true
                    }
                },
                location: {
                    select: {
                        name: true,
                        address: true,
                        mapsLink: true
                    }
                },
                employee: {
                    select: {
                        name: true,
                        image: true
                    }
                },
                company: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: { date: 'desc' }
        });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { balance: true }
        });


        const now = new Date();
        const upcoming = appointments.filter((a: any) => new Date(a.date) > now && a.status !== 'CANCELLED');
        const past = appointments.filter((a: any) => new Date(a.date) <= now || a.status === 'CANCELLED' || a.status === 'COMPLETED');

        const stats = {
            scheduled: upcoming.length,
            completed: appointments.filter((a: any) => a.status === 'COMPLETED' || (new Date(a.date) <= now && a.status !== 'CANCELLED')).length,
            totalSpent: appointments
                .filter((a: any) => a.status === 'COMPLETED' || (new Date(a.date) <= now && a.status !== 'CANCELLED'))
                .reduce((acc: number, curr: any) => acc + curr.service.price, 0),
            balance: user?.balance || 0
        };

        return NextResponse.json({
            upcoming: upcoming.map(formatApt),
            past: past.map(formatApt),
            stats
        });
    } catch (error) {
        console.error("GET User Appointments Error:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("auth_session");
        
        if (!session) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        const { id: userId, role } = JSON.parse(session.value);

        if (role === "BUSINESS") {
            return NextResponse.json({ 
                error: "Contas de empresa não podem realizar agendamentos. Por favor, use uma conta de Pessoa Física." 
            }, { status: 403 });
        }

        const body = await request.json();
        const { employeeId, serviceId, locationId, companyId, date, note, rebookId } = body;

        // Validar dados básicos
        if (!employeeId) return NextResponse.json({ error: "Escolha um profissional" }, { status: 400 });
        if (!serviceId) return NextResponse.json({ error: "Escolha um serviço" }, { status: 400 });
        if (!locationId) return NextResponse.json({ error: "Localização não identificada" }, { status: 400 });
        if (!date) return NextResponse.json({ error: "Escolha uma data e horário" }, { status: 400 });

        const appointment = await prisma.$transaction(async (tx) => {
            if (rebookId) {
                // Cancelar o agendamento antigo
                await (tx.appointment as any).updateMany({
                    where: { id: rebookId, userId: userId },
                    data: { status: "CANCELLED" }
                });
            }

            return await (tx.appointment as any).create({
                data: {
                    userId,
                    employeeId,
                    serviceId,
                    locationId,
                    companyId,
                    date: new Date(date),
                    status: "PENDING"
                }
            });
        });

        // Se houver nota, poderíamos salvar em uma tabela de comentários ou campo extra no futuro
        // Por enquanto, apenas confirmamos o agendamento
        
        return NextResponse.json({ success: true, id: appointment.id });
    } catch (error) {
        console.error("POST User Appointment Error:", error);
        return NextResponse.json({ error: "Erro interno ao agendar" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("auth_session");
        
        if (!session) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        const { id: userId } = JSON.parse(session.value);
        const { appointmentId, rating, comment, action } = await request.json();

        if (action === "cancel") {
            if (!appointmentId) return NextResponse.json({ error: "ID Inválido" }, { status: 400 });

            // Transação: Cancela e soma saldo
            const result = await prisma.$transaction(async (tx) => {
                const apt = await (tx.appointment as any).findFirst({
                    where: { id: appointmentId, userId: userId },
                    include: { service: { select: { price: true } } }
                });

                if (!apt) throw new Error("Agendamento não encontrado");
                if (apt.status === "CANCELLED") throw new Error("Já está cancelado");

                // 1. Atualiza agendamento
                await (tx.appointment as any).update({
                    where: { id: appointmentId },
                    data: { status: "CANCELLED" }
                });

                // 2. Incrementa saldo
                await tx.user.update({
                    where: { id: userId },
                    data: { balance: { increment: apt.service.price } }
                });

                return { success: true };
            });

            return NextResponse.json(result);
        }

        if (!appointmentId || !rating) {
            return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
        }

        const appointment = await (prisma.appointment as any).updateMany({
            where: {
                id: appointmentId,
                userId: userId
            },
            data: {
                rating: parseInt(rating),
                comment: comment || null
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PATCH User Appointment Error:", error);
        return NextResponse.json({ error: "Erro ao salvar avaliação" }, { status: 500 });
    }
}

function formatApt(apt: any) {
    return {
        id: apt.id,
        service: apt.service.name,
        company: apt.company?.name || "Empresa", 
        date: new Date(apt.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        time: new Date(apt.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        professional: apt.employee.name,
        address: apt.location.name + " - " + apt.location.address,
        price: "R$ " + apt.service.price.toFixed(2),
        status: apt.status.toLowerCase(),
        rating: apt.rating,
        comment: apt.comment,
        image: apt.employee.image || "https://images.unsplash.com/photo-1560066914-1f29b3bbec3e?w=150&auto=format&fit=crop&q=80",
        locationId: apt.locationId,
        companyId: apt.companyId,
        employeeId: apt.employeeId,
        mapsLink: apt.location.mapsLink
    };
}
