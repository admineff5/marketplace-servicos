import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(request: Request, context: { params: Promise<{ filename: string }> }) {
    try {
        const { filename } = await context.params;
        const filePath = join(process.cwd(), "public", "uploads", filename);
        
        try {
            const buffer = await readFile(filePath);
            
            // Determinar contentType básico para as imagens permitidas
            let contentType = "image/jpeg";
            const lowerFile = filename.toLowerCase();
            if (lowerFile.endsWith(".png")) contentType = "image/png";
            else if (lowerFile.endsWith(".webp")) contentType = "image/webp";
            
            const response = new NextResponse(buffer);
            response.headers.set("Content-Type", contentType);
            // Cache por 1 ano (imutável)
            response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
            
            return response;
        } catch (readError) {
            return new NextResponse("File not found on disk", { status: 404 });
        }
    } catch (e) {
        return new NextResponse("Invalid request", { status: 400 });
    }
}
