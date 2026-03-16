const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const stateOld = `const [selectedMiniDate, setSelectedMiniDate] = useState<number | null>(new Date().getDate());`;
const stateNew = `const [selectedMiniDate, setSelectedMiniDate] = useState<number | null>(null);`;

if (content.indexOf('new Date().getDate()') !== -1) {
    content = content.replace(stateOld, stateNew);
    console.log("selectedMiniDate alterado para null (Ver Todos) por padrão!");
    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("Estado selectedMiniDate antigo não encontrado.");
}
