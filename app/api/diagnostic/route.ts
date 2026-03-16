import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        const appointments = await prisma.appointment.findMany({
            include: { employee: true, user: true, company: true },
            orderBy: { date: 'asc' }
        });
        const out = appointments.map((a: any) => ({
            id: a.id,
            title: a.title,
            date: a.date.toISOString(),
            status: a.status,
            company: a.company?.name,
            companyId: a.companyId,
            prof: a.employee?.name,
            client: a.user?.name
        }));
        
        fs.writeFileSync(path.join(process.cwd(), 'diagnostic_appointments.json'), JSON.stringify(out, null, 2));
        
        return NextResponse.json({ ok: true, count: out.length });
    } catch (error: any) {
        return NextResponse.json({ error: error.message });
    }
}
