import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            where: { name: { contains: "Rodrigo", mode: "insensitive" } },
            select: { id: true, name: true, phone: true, email: true, role: true }
        });

        const messages = await prisma.whatsappMessage.findMany({
            where: { senderName: { contains: "Rodrigo", mode: "insensitive" } },
            orderBy: { timestamp: "desc" },
            take: 5
        });

        const debugPath = path.join(process.cwd(), 'scripts', 'baileys_debug.txt');
        let debugLog = null;
        if (fs.existsSync(debugPath)) {
            debugLog = fs.readFileSync(debugPath, 'utf-8');
        }

        return NextResponse.json({ users, messages, debugLog });
    } catch (e: any) {
        return NextResponse.json({ error: e.message });
    }
}
