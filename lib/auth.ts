import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretText = process.env.AUTH_SECRET;

export async function getSession() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("auth_session");
        
        if (!session || !session.value) return null;

        if (!secretText) {
            throw new Error("AUTH_SECRET não configurada no .env");
        }

        const secret = new TextEncoder().encode(secretText);
        const { payload } = await jwtVerify(session.value, secret);
        
        return payload as { id: string; role: string };
    } catch (error) {
        // Token inválido, expirado ou erro de assinatura
        return null;
    }
}
