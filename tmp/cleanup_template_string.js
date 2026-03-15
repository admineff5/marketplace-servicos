const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Visão de Dia / Semana (Onde tem o .replace no template string)
content = content.replace(
    /className=\{\`absolute left-\[5%\][^\`]*?\$\{apt\.dot\.replace\('bg-', 'border-'\)\.replace\('500', '600'\)\}[^\`]*?\`\}/g,
    "className={`absolute left-[5%] w-[90%] rounded-md border-l-[6px] p-3 text-sm shadow-md cursor-pointer hover:brightness-110 overflow-hidden bg-white dark:bg-gray-800 ${apt.color}`}"
);

// 2. Outro replace similar na Semana
content = content.replace(
    /className=\{\`absolute left-1 right-1[^\`]*?\$\{apt\.dot\.replace\('bg-', 'border-'\)\.replace\('500', '600'\)\}[^\`]*?\`\}/g,
    "className={`absolute left-1 right-1 rounded border-l-4 p-1.5 text-xs shadow-sm cursor-pointer hover:brightness-110 overflow-hidden bg-white dark:bg-gray-800 ${apt.color}`}"
);

// 3. Extrair a lógica do título e `.start` para Variáveis Auxiliares logo após o `.map((apt: any`
// Exemplo: `.map((apt: any, idx: any) => {`
// Nós podemos fazer um replace geral no bloco de renderizador que o usuário está tendo problema.

// Vamos rodar o Replacement cirúrgico via Script Node assistido
const searchBlock = `                                                    return (
                                                        <div
                                                            key={apt.id}
                                                            onClick={() => setSelectedAppointment(apt)}
                                                            className={\`absolute left-[5%] w-[90%] rounded-md border-l-[6px] p-3 text-sm shadow-md cursor-pointer hover:brightness-110 overflow-hidden \${apt.dot.replace('bg-', 'border-').replace('500', '600')} bg-white dark:bg-gray-800 \${apt.color}\`}
                                                            style={{ top: \`\${topOffset}px\`, height: '76px' }}
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <p className="font-semibold text-gray-900 dark:text-gray-100">{apt.service?.name || apt.title?.split('-')[0]?.trim() || 'Serviço'}</p>
                                                                <span className="text-xs font-bold bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{apt.start} - {apt.end}</span>
                                                            </div>
                                                            <p className="mt-1 text-gray-600 dark:text-gray-400">Profissional: <span className="font-semibold">{apt.prof}</span></p>
                                                        </div>
                                                    )`;

const newBlock = `                                                    const aptDotClass = apt.dot ? apt.dot.replace('bg-', 'border-').replace('500', '600') : '';
                                                    const aptTitle = apt.service?.name || apt.title?.split('-')[0]?.trim() || 'Serviço';
                                                    
                                                    return (
                                                        <div
                                                            key={apt.id}
                                                            onClick={() => setSelectedAppointment(apt)}
                                                            className={\`absolute left-[5%] w-[90%] rounded-md border-l-[6px] p-3 text-sm shadow-md cursor-pointer hover:brightness-110 overflow-hidden \${aptDotClass} bg-white dark:bg-gray-800 \${apt.color}\`}
                                                            style={{ top: \`\${topOffset}px\`, height: '76px' }}
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <p className="font-semibold text-gray-900 dark:text-gray-100">{aptTitle}</p>
                                                                <span className="text-xs font-bold bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{apt.start} - {apt.end}</span>
                                                            </div>
                                                            <p className="mt-1 text-gray-600 dark:text-gray-400">Profissional: <span className="font-semibold">{apt.prof}</span></p>
                                                        </div>
                                                    )`;

if (content.indexOf(searchBlock) !== -1) {
    content = content.replace(searchBlock, newBlock);
    console.log("Variáveis auxiliares injetadas na View Dia!");
} else {
    console.log("SearchBlock 1 não encontrado!");
}

fs.writeFileSync(path, content, 'utf8');
console.log("Limpeza de template string aplicada!");
