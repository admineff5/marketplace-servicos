import prisma from "./prisma";

/**
 * Enfileira uma mensagem para ser disparada pelo worker do WhatsApp.
 */
export async function sendWhatsAppMessage(phone: string, content: string) {
    try {
        // Normaliza o telefone: remove tudo que não é dígito e garante o prefixo 55
        let cleanPhone = phone.replace(/\D/g, "");
        if (cleanPhone.length <= 11 && !cleanPhone.startsWith("55")) {
            cleanPhone = `55${cleanPhone}`;
        }

        console.log(`[WhatsApp-Lib] 📤 Enfileirando mensagem para ${cleanPhone}`);

        await prisma.whatsappQueue.create({
            data: {
                phone: cleanPhone,
                content: content,
                status: "PENDING"
            }
        });

        return { success: true };
    } catch (error) {
        console.error("[WhatsApp-Lib] ❌ Erro ao enfileirar mensagem:", error);
        return { success: false, error };
    }
}

/**
 * Envia o código de verificação de 6 dígitos via WhatsApp.
 */
export async function sendVerificationWhatsApp(phone: string, token: string) {
    const message = `*AgendaJá* 🛸\n\nSeu código de verificação é: *${token}*\n\nDigite este código no site para ativar sua conta.`;
    return sendWhatsAppMessage(phone, message);
}
