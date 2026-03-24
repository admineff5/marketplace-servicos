import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Bypass total para a rota de cadastro (necessário para usuários logados PF/PJ)
    if (pathname === '/register') {
        return NextResponse.next();
    }

    const session = request.cookies.get('auth_session');

    // Se o usuário está logado e tenta acessar login, redireciona para sua área
    if (session && pathname === '/login') {
        try {
            const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
            const { payload } = await jwtVerify(session.value, secret);
            const redirectUrl = payload.role === 'CLIENT' ? '/cliente' : '/dashboard';
            return NextResponse.redirect(new URL(redirectUrl, request.url));
        } catch (e) {
            // Cookie corrompido — limpar e deixar passar para o login
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('auth_session');
            return response;
        }
    }

    // Se o usuário não está logado e tenta acessar áreas restritas
    if (!session && (pathname.startsWith('/dashboard') || pathname.startsWith('/cliente'))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // RBAC — Verificar papéis corretos por rota
    if (session) {
        try {
            const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
            const { payload } = await jwtVerify(session.value, secret);
            const role = payload.role as string;

            // BUSINESS tentando acessar área de CLIENT
            if (pathname.startsWith('/cliente') && role === 'BUSINESS') {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }

            // CLIENT tentando acessar área de BUSINESS
            if (pathname.startsWith('/dashboard') && role === 'CLIENT') {
                return NextResponse.redirect(new URL('/cliente', request.url));
            }
        } catch (e) {
            // Cookie corrompido — limpar e redirecionar para login
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('auth_session');
            return response;
        }

        // Renovar cookie com sameSite e flags de segurança
        const response = NextResponse.next();
        response.cookies.set('auth_session', session.value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60, // 7 dias
            path: "/",
        });
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/cliente/:path*', '/dashboard', '/cliente', '/login', '/register'],
};
