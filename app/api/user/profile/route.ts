import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

// Helper: Mascarar CPF — retorna ***.***. ***-XX
function maskCPF(cpf: string | null): string | null {
    if (!cpf) return null;
    const clean = cpf.replace(/\D/g, "");
    if (clean.length !== 11) return "***.***.***-**";
    return `***.***. ***-${clean.slice(-2)}`;
}

export async function GET() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("auth_session");
        
        if (!session) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        const { id } = JSON.parse(session.value);

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                cpf: true,
                address: true,
                phone: true,
                imageUrl: true,
            }
        });

        if (!user) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        // Retornar CPF mascarado (LGPD compliance)
        return NextResponse.json({
            ...user,
            cpf: maskCPF(user.cpf),
        });
    } catch (error) {
        console.error("Profile GET Error:", error);
        return NextResponse.json({ error: "Erro ao buscar perfil" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("auth_session");
        
        if (!session) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        const { id } = JSON.parse(session.value);
        const body = await request.json();
        const { name, address, phone, imageUrl } = body;

        // Construir objeto de atualização apenas com campos permitidos
        const updateData: Record<string, string> = {};
        if (name) updateData.name = name;
        if (address) updateData.address = address;
        if (phone) updateData.phone = phone;
        if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: "Nenhum campo válido para atualizar" }, { status: 400 });
        }

        const updated = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                phone: true,
                imageUrl: true,
            }
        });

        return NextResponse.json({ success: true, user: updated });
    } catch (error) {
        console.error("Profile PUT Error:", error);
        return NextResponse.json({ error: "Erro ao atualizar perfil" }, { status: 500 });
    }
}
