const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Regex para engolir a div de Tendência (Trend) no loop de KPIs
const trendRegex = /<div className="flex items-center gap-1 mt-1 opacity-80">[\s\S]*?<\/div>/g;

if (trendRegex.test(content)) {
    content = content.replace(trendRegex, '');
    console.log("Trend Information removida dos KPIs!");
    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("Regex de Trend falhou em dar Match.");
}
