import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const sessions = await prisma.whatsappSession.findMany();
        const debugData = sessions.map(s => {
            const updatedAtTime = s.updatedAt ? new Date(s.updatedAt).getTime() : 0;
            const now = Date.now();
            const diffMinutes = (now - updatedAtTime) / 1000 / 60;
            return {
                companyId: s.companyId,
                status: s.status,
                hasQr: !!s.qrCode,
                updatedAt: s.updatedAt,
                now: new Date(now).toISOString(),
                diffMinutes
            };
        });
        return NextResponse.json(debugData);
    } catch (error: any) {
        return NextResponse.json({ error: error.message });
    }
}
