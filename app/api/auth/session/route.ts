import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getSession();
 
         if (!session) {
             return NextResponse.json({ authenticated: false });
         }
 
         const { id } = session;
        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, name: true, email: true, role: true }
        });

        if (!user) {
            return NextResponse.json({ authenticated: false });
        }
        
        return NextResponse.json({
            authenticated: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("GET Session Error:", error);
        return NextResponse.json({ authenticated: false }, { status: 500 });
    }
}
