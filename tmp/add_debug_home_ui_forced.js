const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remover a condicional {debugText && (   e deixar a tag Pre fixa
const oldText = `{debugText && (
                <pre className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-4 rounded-xl text-[11px] font-mono text-amber-800 dark:text-amber-400 overflow-auto max-h-48 shadow-inner">
                    <div className="font-bold mb-1 uppercase text-xs">⚠️ Diagnóstico de Logs da API (Agendamentos Encontrados):</div>
                    {debugText}
                </pre>
            )}`;

const newText = `<div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-4 rounded-xl text-[11px] font-mono text-amber-800 dark:text-amber-400 overflow-auto max-h-48 shadow-inner">
                    <div className="font-bold mb-1 uppercase text-xs">⚠️ Diagnóstico de Logs da API (Agendamentos Encontrados):</div>
                    {debugText || "Nenhum dado atribuido ao debugText"}
                </div>`;

if (content.indexOf('{debugText && (') !== -1) {
    content = content.replace(oldText, newText);
    console.log("Visualizador de Debug FORÇADO na interface!");
    fs.writeFileSync(path, content, 'utf8');
} else {
     console.log("Condicional de debugText não encontrada.");
}
