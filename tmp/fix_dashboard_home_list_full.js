const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Alterar o Fetch para remover limit=10
const fetchOld = `const aptRes = await fetch('/api/appointments?limit=10&fromToday=true');`;
const fetchNew = `const aptRes = await fetch('/api/appointments?fromToday=true');`;

if (content.indexOf('limit=10') !== -1) {
    content = content.replace(fetchOld, fetchNew);
    console.log("Limite de Fetch removido da Home!");
}

// 2. Adicionar o Sort de Garantia na Linha de setRecentAppointments
const setOld = `setRecentAppointments(activeApts.slice(0, 5));`;
const setNew = `setRecentAppointments([...activeApts].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5));`;

if (content.indexOf(setOld) !== -1) {
    content = content.replace(setOld, setNew);
    console.log("Sort de Garantia adicionado na Home!");
}

// 3. Limpar o bloco de DebugText (Amarelo) para não sujar a interface se resolver o problema
const debugBlockOld = `<div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-4 rounded-xl text-[11px] font-mono text-amber-800 dark:text-amber-400 overflow-auto max-h-48 shadow-inner">
                    <div className="font-bold mb-1 uppercase text-xs">⚠️ Diagnóstico de Logs da API (Agendamentos Encontrados):</div>
                    {debugText || "Nenhum dado atribuido ao debugText"}
                </div>`;

const debugBlockNew = `{/* Bloco de Debug removido */}`;

if (content.indexOf('Diagnóstico de Logs') !== -1) {
    content = content.replace(debugBlockOld, debugBlockNew);
    console.log("Bloco de Debug removido da Dashboard Home!");
}

// 4. Se houver título TESTE DE DIAGNOSTICO ATIVO, remover também
content = content.replace('Visão Geral (TESTE DE DIAGNOSTICO ATIVO)', 'Visão Geral');

fs.writeFileSync(path, content, 'utf8');
