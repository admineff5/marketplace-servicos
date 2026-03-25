const dns = require("dns").promises;

async function checkDNS() {
    const domain = "eff5.com.br";
    console.log(`=== 🔍 DIAGNÓSTICO DE SEGURANÇA DNS: ${domain} ===\n`);

    try {
        // 1. Verificar registros TXT (Onde fica o SPF)
        console.log("1️⃣ Verificando registro SPF (Autorização de Envio)...");
        const txtRecords = await dns.resolveTxt(domain);
        
        let spfFound = false;
        txtRecords.forEach(record => {
            const txtLine = record.join(" ");
            if (txtLine.includes("v=spf1")) {
                spfFound = true;
                console.log(`✅ SPF Encontrado: "${txtLine}"`);
                
                if (txtLine.includes("hostgator") || txtLine.includes("69.6.212.251")) {
                    console.log("   👉 A Hostgator PARECE estar listada corretamente.");
                } else {
                    console.log("   ❌ ALERTA: A Hostgator NÃO está listada nesse SPF! O Gmail vai bloquear.");
                }
            }
        });

        if (!spfFound) {
            console.log("❌ ERRO: Nenhum registro SPF encontrado para o domínio!");
        }

        console.log("\n2️⃣ Verificando registro DKIM (Assinatura Digital)...");
        try {
            // O cPanel geralmente usa 'default._domainkey'
            const dkimRecords = await dns.resolveTxt(`default._domainkey.${domain}`);
            console.log(`✅ DKIM Encontrado (default): "${dkimRecords[0].join(" ")}"`);
        } catch (e) {
            console.log("❌ DKIM (default._domainkey) não encontrado. Isso pode causar bloqueios.");
        }

    } catch (error) {
        console.error("❌ Falha crítica ao consultar DNS:", error.message);
    }
}

checkDNS();
