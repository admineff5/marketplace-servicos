const fs = require('fs');
const path = 'c:\\Antigravity\\app\\cliente\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Corrigir Imagem nos Próximos Agendamentos
const imgUpcomingOld = `<img 
                                    src={item.image} 
                                    alt={item.company} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />`;

const imgUpcomingNew = `<img 
                                    src={item.image} 
                                    alt={item.company} 
                                    onError={(e: any) => e.target.style.display = 'none'}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />`;

if (content.indexOf('src={item.image}') !== -1) {
    content = content.replace(imgUpcomingOld, imgUpcomingNew);
    console.log("FallbackonError adicionado nos Próximos!");
}

// 2. Corrigir Imagem no Histórico
const imgPastOld = `<img src={item.image} alt={item.company} className="w-full h-full object-cover" />`;
const imgPastNew = `<img src={item.image} alt={item.company} onError={(e: any) => e.target.style.display = 'none'} className="w-full h-full object-cover" />`;

if (content.indexOf(imgPastOld) !== -1) {
    content = content.replace(imgPastOld, imgPastNew);
    console.log("Fallback onError adicionado no Histórico!");
}

fs.writeFileSync(path, content, 'utf8');
