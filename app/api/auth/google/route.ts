import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
        return NextResponse.json({ error: "GOOGLE_CLIENT_ID não configurado no ambiente (.env)" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role") || "CLIENT"; // 'CLIENT' ou 'BUSINESS'

    const redirectUri = `${new URL(request.url).origin}/api/auth/google/callback`;
    const scope = "email profile";

    // Constrói a URL do Google OAuth 2.0
    const url = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code` +
        `&scope=${encodeURIComponent(scope)}` +
        `&state=${role}` + // Salva o papel do usuário no parâmetro state
        `&access_type=offline` +
        `&prompt=consent`;

    return NextResponse.redirect(url);
}
