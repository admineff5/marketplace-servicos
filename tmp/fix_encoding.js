const { execSync } = require('child_process');
const fs = require('fs');

try {
    // 1. Puxar o conteúdo do commit original
    console.log("Extraindo arquivo do Git...");
    const content = execSync('git show 4e4f264:app/cliente/page.tsx', { encoding: 'utf8' });
    
    // 2. Gravar em UTF-8 Puro (Sem BOM)
    const filePath = 'c:\\Antigravity\\app\\cliente\\page.tsx';
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log("SUCESSO: Arquivo salvo em UTF-8 Puro!");
} catch (error) {
    console.error("Erro ao rodar script:", error);
}
