const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Regex fallback para garantir a alteração das condições
const conditionPattern = /aptDate\.getDate\(\)\s*===\s*currentDate\.getDate\(\)\s*&&\s*aptDate\.getMonth\(\)\s*===\s*currentDate\.getMonth\(\)\s*&&\s*aptDate\.getFullYear\(\)\s*===\s*currentDate\.getFullYear\(\)/g;

if (conditionPattern.test(content)) {
    content = content.replace(conditionPattern, 'aptDate.getUTCDate() === currentDate.getDate() &&\n                                                        aptDate.getUTCMonth() === currentDate.getMonth() &&\n                                                        aptDate.getUTCFullYear() === currentDate.getFullYear()');
    fs.writeFileSync(path, content, 'utf8');
    console.log('Substituição realizada com sucesso via regex!');
} else {
    console.log('Condição não encontrada no arquivo.');
}
