const fs = require('fs');
const path = 'c:\\Antigravity\\app\\api\\appointments\\route.ts';
let content = fs.readFileSync(path, 'utf8');

const searchStart = "start: apt.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),";
const replaceStart = "start: apt.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }),";

const searchEnd = "end: new Date(apt.date.getTime() + (apt.service?.duration || 30) * 60000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),";
const replaceEnd = "end: new Date(apt.date.getTime() + (apt.service?.duration || 30) * 60000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }),";

if (content.indexOf(searchStart) !== -1) {
    content = content.replace(searchStart, replaceStart);
    console.log("Start Timezone corrigido!");
}

if (content.indexOf(searchEnd) !== -1) {
    content = content.replace(searchEnd, replaceEnd);
    console.log("End Timezone corrigido!");
}

fs.writeFileSync(path, content, 'utf8');
console.log("Timezone da API corrigido com sucesso!");
