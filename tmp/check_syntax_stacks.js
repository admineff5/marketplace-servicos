const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
const content = fs.readFileSync(path, 'utf8');

// Analisador de Tags Div
const lines = content.split('\n');
let divStack = [];
let braceStack = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimLine = line.trim();
    
    // Contar divs
    const openDivs = (line.match(/<div/g) || []).length;
    const closeDivs = (line.match(/<\/div>/g) || []).length;
    
    for(let j=0; j<openDivs; j++) divStack.push(i+1);
    for(let j=0; j<closeDivs; j++) divStack.pop();
    
    // Contar braces { }
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    
    for(let j=0; j<openBraces; j++) braceStack.push(i+1);
    for(let j=0; j<closeBraces; j++) braceStack.pop();

    if (i+1 === 307) {
        console.log(`Linha 307:`);
        console.log(`Stack de Divs abertas (Início na linha): ${divStack.join(', ')}`);
        console.log(`Stack de Braces abertas (Início na linha): ${braceStack.join(', ')}`);
        break;
    }
}
