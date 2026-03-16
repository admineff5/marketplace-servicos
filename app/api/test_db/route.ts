import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const appointments = await prisma.appointment.findMany({
            include: { 
                employee: { select: { id: true, name: true, companyId: true } },
                user: { select: { id: true, name: true } }
            },
            orderBy: { date: 'asc' }
        });
        return NextResponse.json(appointments);
    } catch (error: any) {
        return NextResponse.json({ error: error.message });
    }
}
