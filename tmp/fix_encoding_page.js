const { execSync } = require('child_process');
const fs = require('fs');

try {
    console.log("Extraindo arquivo do Git commit 516eefe...");
    const content = execSync('git show 516eefe:app/page.tsx', { encoding: 'utf8' });
    
    // Gravar em UTF-8 Puro (Sem BOM)
    const filePath = 'c:\\Antigravity\\app\\page.tsx';
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log("SUCESSO: Arquivo original restaurado em UTF-8 Puro!");
} catch (error) {
    console.error("Erro ao rodar script:", error);
}
