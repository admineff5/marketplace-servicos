const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Localizar o título da Agenda no Modo Lista
const headerOld = `<h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {selectedMiniDate ? \`Agendamentos - \${selectedMiniDate} de \${MONTHS[currentMonth]}\` : \`Agendamentos - \${MONTHS[currentMonth]} de \${currentYear}\`}
                    </h2>`;

const headerNew = `<div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {selectedMiniDate ? \`Agendamentos - \${selectedMiniDate} de \${MONTHS[currentMonth]}\` : \`Agendamentos - \${MONTHS[currentMonth]} de \${currentYear}\`}
                        </h2>
                        {selectedMiniDate && (
                            <button 
                                onClick={() => setSelectedMiniDate(null)} 
                                className="px-3 py-1.5 text-xs font-semibold bg-cyan-700 text-white dark:bg-primary dark:text-black rounded-xl hover:shadow-md transition-all flex items-center gap-1"
                            >
                                ✕ Ver Todos
                            </button>
                        )}
                    </div>`;

if (content.indexOf('{selectedMiniDate ?') !== -1) {
    // Regex flexível para achar h2 com selectedMiniDate
    const h2Regex = /<h2 className="text-xl font-bold[^]*?selectedMiniDate[^]*?MONTHS\[currentMonth\][^]*?<\/h2>/;
    
    if (h2Regex.test(content)) {
        content = content.replace(h2Regex, headerNew);
        console.log("Botão 'Ver Todos' injetado no Cabeçalho da Lista!");
        fs.writeFileSync(path, content, 'utf8');
    } else {
        console.log("Regex não deu match no h2 do selectedMiniDate.");
    }
} else {
    console.log("Expressão selectedMiniDate não encontrada no arquivo.");
}
