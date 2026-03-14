import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("auth_session");
        
        if (!session) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
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
