import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("auth_session");

        if (!session) {
            return NextResponse.json({ authenticated: false });
        }

        const userData = JSON.parse(session.value);
        
        return NextResponse.json({
            authenticated: true,
            user: {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                role: userData.role
            }
        });
    } catch (error) {
        console.error("GET Session Error:", error);
        return NextResponse.json({ authenticated: false }, { status: 500 });
    }
}
