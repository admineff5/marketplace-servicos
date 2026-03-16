const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Iniciar selectedMiniDate com o dia de hoje
const stateOld = 'const [selectedMiniDate, setSelectedMiniDate] = useState<number | null>(null);';
const stateNew = 'const [selectedMiniDate, setSelectedMiniDate] = useState<number | null>(new Date().getDate());';

if (content.indexOf(stateOld) !== -1) {
    content = content.replace(stateOld, stateNew);
    console.log("Estado selectedMiniDate iniciado com Hoje!");
}

// 2. Harmonizar o destaque no Calendário Central (diaIsToday)
const calendarOld = `\${dayIsToday ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300'}`;
const calendarNew = `\${dayIsToday ? 'bg-cyan-700 text-white dark:bg-primary dark:text-black font-bold shadow-md' : 'text-gray-700 dark:text-gray-300'}`;

if (content.indexOf(calendarOld) !== -1) {
    content = content.replace(calendarOld, calendarNew);
    console.log("Destaque do Calendário Central unificado para Azul Petróleo/Ciano!");
}

fs.writeFileSync(path, content, 'utf8');
