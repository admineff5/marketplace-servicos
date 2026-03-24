import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("auth_session");
        
        if (!session) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        // Validar assinatura do Token JWT
        try {
            const secretText = process.env.AUTH_SECRET;
            if (!secretText) throw new Error("Chave secreta não configurada");
            const secret = new TextEncoder().encode(secretText);
            await jwtVerify(session.value, secret);
        } catch (e) {
            return NextResponse.json({ error: "Sessão inválida ou corrompida" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
        }

        // 🚨 Validação de Tipo (Prevent XSS/Malware)
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type.toLowerCase())) {
            return NextResponse.json({ error: "Formato de arquivo não permitido (Apenas JPG, PNG, WEBP)" }, { status: 400 });
        }

        // 🚨 Validação de Tamanho (Prevent DoS)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json({ error: "Arquivo muito grande (Máximo 5MB)" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Path to save
        const uploadDir = join(process.cwd(), "public", "uploads");
        
        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {}

        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, "-")}`;
        const path = join(uploadDir, filename);

        await writeFile(path, buffer);
        
        const fileUrl = `/api/file/${filename}`;
        
        return NextResponse.json({ success: true, url: fileUrl });
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: "Erro ao processar upload" }, { status: 500 });
    }
}
