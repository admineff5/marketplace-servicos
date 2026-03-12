import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const session = request.cookies.get('auth_session');
    const { pathname } = request.nextUrl;

    // Se o usuário está logado e tenta acessar login/register, manda para o dashboard/cliente
    if (session && (pathname === '/login' || pathname === '/register')) {
        try {
            const userData = JSON.parse(session.value);
            const redirectUrl = userData.role === 'CLIENT' ? '/cliente' : '/dashboard';
            return NextResponse.redirect(new URL(redirectUrl, request.url));
        } catch (e) {
            // Se o cookie estiver corrompido, deixa passar para o login
        }
    }

    // Se o usuário não está logado e tenta acessar áreas restritas
    if (!session && (pathname.startsWith('/dashboard') || pathname.startsWith('/cliente'))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Atualiza a expiração do cookie (Autologoff por inatividade de 15min)
    if (session) {
        const response = NextResponse.next();
        response.cookies.set('auth_session', session.value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60, // 7 dias de persistência
            path: "/",
        });
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/cliente/:path*', '/dashboard', '/cliente', '/login', '/register'],
};
