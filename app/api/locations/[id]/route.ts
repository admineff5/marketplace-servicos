import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma, { getCompanyByUserId } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        const { id: userId } = session;
        const company = await getCompanyByUserId(userId);

        if (!company) {
            return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
        }

        // Verificar se a unidade pertence à empresa
        const location = await prisma.location.findUnique({
            where: { id }
        });

        if (!location || location.companyId !== company.id) {
            return NextResponse.json({ error: "Unidade não encontrada ou acesso negado" }, { status: 403 });
        }

        await prisma.location.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE Location Error:", error);
        return NextResponse.json({ error: "Erro ao excluir unidade" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        const { id: userId } = session;
        const company = await getCompanyByUserId(userId);

        if (!company) {
            return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
        }

        const body = await request.json();
        const { name, cep, address, number, neighborhood, city, state, mapsLink, cnpj } = body;

        // Verificar se a unidade pertence à empresa
        const location = await prisma.location.findUnique({
            where: { id }
        });

        if (!location || location.companyId !== company.id) {
            return NextResponse.json({ error: "Unidade não encontrada ou acesso negado" }, { status: 403 });
        }

        const updated = await prisma.location.update({
            where: { id },
            data: {
                name,
                cep,
                address,
                number,
                neighborhood,
                city,
                state,
                mapsLink,
                cnpj: cnpj || null
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("PUT Location Error:", error);
        return NextResponse.json({ error: "Erro ao atualizar unidade" }, { status: 500 });
    }
}
