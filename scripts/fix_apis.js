const fs = require('fs');
const path = require('path');

const filesToFix = [
    "c:\\Antigravity\\app\\api\\user\\profile\\route.ts",
    "c:\\Antigravity\\app\\api\\user\\payment-methods\\[id]\\route.ts",
    "c:\\Antigravity\\app\\api\\user\\payment-methods\\route.ts",
    "c:\\Antigravity\\app\\api\\user\\appointments\\route.ts",
    "c:\\Antigravity\\app\\api\\user\\addresses\\[id]\\route.ts",
    "c:\\Antigravity\\app\\api\\user\\addresses\\route.ts",
    "c:\\Antigravity\\app\\api\\services\\route.ts",
    "c:\\Antigravity\\app\\api\\products\\route.ts",
    "c:\\Antigravity\\app\\api\\locations\\route.ts",
    "c:\\Antigravity\\app\\api\\locations\\[id]\\route.ts",
    "c:\\Antigravity\\app\\api\\employees\\[id]\\route.ts",
    "c:\\Antigravity\\app\\api\\employees\\route.ts",
    "c:\\Antigravity\\app\\api\\dashboard\\stats\\route.ts",
    "c:\\Antigravity\\app\\api\\dashboard\\whatsapp\\route.ts",
    "c:\\Antigravity\\app\\api\\dashboard\\profile\\route.ts",
    "c:\\Antigravity\\app\\api\\dashboard\\faq\\route.ts",
    "c:\\Antigravity\\app\\api\\clients\\route.ts",
    "c:\\Antigravity\\app\\api\\blocks\\route.ts",
    "c:\\Antigravity\\app\\api\\blocks\\[id]\\route.ts",
    "c:\\Antigravity\\app\\api\\auth\\session\\route.ts",
    "c:\\Antigravity\\app\\api\\appointments\\route.ts"
];

for (const file of filesToFix) {
    if (!fs.existsSync(file)) {
        console.log(`[-] Skip missing file: ${file}`);
        continue;
    }

    let content = fs.readFileSync(file, 'utf8');

    if (!content.includes('import { getSession } from "@/lib/auth"')) {
        content = `import { getSession } from "@/lib/auth";\n` + content;
    }

    // Regex centralizada para remover o bloco antigo e injetar o helper getSession()
    // Remove lines that match cookies(), cookieStore.get, session parsing
    content = content.replace(
        /const\s+cookieStore\s*=\s*(await\s+)?cookies\(\);?\s*const\s+session\s*=\s*cookieStore\.get\("auth_session"\);?\s*if\s*\(!session\)\s*\{\s*return\s+NextResponse\.json\(\{\s*error:\s*"Sessão expirada"\s*\}\s*,\s*\{\s*status:\s*401\s*\}\);?\s*\}\s*const\s+\{([^}]+)\}\s*=\s*JSON\.parse\(session\.value\);?/g,
        'const session = await getSession();\n        if (!session) {\n            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });\n        }\n        const { $2 } = session;'
    );

    // Outra variação: const userData = JSON.parse(session.value)
    content = content.replace(
        /const\s+cookieStore\s*=\s*(await\s+)?cookies\(\);?\s*const\s+session\s*=\s*cookieStore\.get\("auth_session"\);?\s*if\s*\(!session\)\s*\{\s*return\s+NextResponse\.json\(\{\s*error:\s*"Sessão expirada"\s*\}\s*,\s*\{\s*status:\s*401\s*\}\);?\s*\}\s*const\s+(\w+)\s*=\s*JSON\.parse\(session\.value\);?/g,
        'const session = await getSession();\n        if (!session) {\n            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });\n        }\n        const $2 = session;'
    );

    // Ajustes pontuais onde faltavam os blocos completos via regex simples:
    content = content.replace(/JSON\.parse\(session\.value\)/g, "(await getSession())");

    fs.writeFileSync(file, content, 'utf8');
    console.log(`[+] Fixed: ${file}`);
}
console.log("=== Refactoring Complete ===");
