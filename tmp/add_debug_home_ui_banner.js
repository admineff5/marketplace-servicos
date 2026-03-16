const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Injetar Variável de Estado de Debug
const stateOld = 'const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);';
const stateNew = `const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
    const [debugText, setDebugText] = useState<string>("");`;

if (content.indexOf('const [debugText, setDebugText]') === -1 && content.indexOf(stateOld) !== -1) {
    content = content.replace(stateOld, stateNew);
    console.log("Estado debugText injetado!");
}

// 2. Setar debugText no FetchData
const fetchOld = `if (Array.isArray(aptData)) {
                    const debugStr = aptData.map(a => \`\${a.date} - \${a.title} [\${a.status}]\`).join('\\n');
                    alert("⚠️ DIAGNÓSTICO DE AGENDAMENTOS:\\n\\n" + (debugStr || "⚠️ NENHUM AGENDAMENTO RETORNADO DA API !"));
                }`;

const fetchNew = `if (Array.isArray(aptData)) {
                    setDebugText(JSON.stringify(aptData.map((a: any) => ({
                        id: a.id,
                        date: a.date,
                        status: a.status,
                        title: a.title
                    })), null, 2));
                }`;

if (content.indexOf('alert("⚠️ DIAGNÓSTICO') !== -1) {
    content = content.replace(fetchOld, fetchNew);
    console.log("Atualização do debugText inserida no Fetch!");
}

// 3. Renderizar o Bloco de Debug no Topo da Tela
const renderOld = `<div className="space-y-6 max-w-7xl mx-auto pb-10">`;
const renderNew = `<div className="space-y-6 max-w-7xl mx-auto pb-10">
            {debugText && (
                <pre className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-4 rounded-xl text-[11px] font-mono text-amber-800 dark:text-amber-400 overflow-auto max-h-48 shadow-inner">
                    <div className="font-bold mb-1 uppercase text-xs">⚠️ Diagnóstico de Logs da API (Agendamentos Encontrados):</div>
                    {debugText}
                </pre>
            )}`

if (content.indexOf('{debugText && (') === -1 && content.indexOf(renderOld) !== -1) {
    content = content.replace(renderOld, renderNew);
    console.log("Visualizador de Debug injetado na interface!");
}

fs.writeFileSync(path, content, 'utf8');
