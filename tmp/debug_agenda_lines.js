const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
const content = fs.readFileSync(path, 'utf8');

// Achar linhas com "selectedAppointment" para ver o popup
const lines = content.split('\n');
let matches = [];
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('selectedAppointment')) {
        matches.push(`[${i+1}] ${lines[i].trim()}`);
    }
}

console.log(matches.join('\n'));
