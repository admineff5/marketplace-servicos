import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

        return NextResponse.json({ users, messages });
    } catch (e: any) {
        return NextResponse.json({ error: e.message });
    }
}
