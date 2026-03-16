const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const filterOld = `const activeApts = Array.isArray(aptData) 
                    ? aptData.filter((a: any) => {
                        const isCancelled = a.status === 'CANCELLED' || a.status === 'CANCELADO' || a.status === 'CANCEL';
                        if (isCancelled) return false;
                        
                        const aptDate = new Date(a.date);
                        const now = new Date();
                        now.setHours(0,0,0,0); // Considera hoje o dia inteiro
                        return aptDate >= now;
                    })
                    : [];`;

const filterNew = `const activeApts = Array.isArray(aptData) 
                    ? aptData.filter((a: any) => {
                        const isCancelled = a.status === 'CANCELLED' || a.status === 'CANCELADO' || a.status === 'CANCEL';
                        return !isCancelled;
                    })
                    : [];`;

if (content.indexOf('const activeApts = Array.isArray(aptData)') !== -1) {
    content = content.replace(filterOld, filterNew);
    console.log("Filtro redundante da Dashboard Home removido!");
    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("Filtro redundante não encontrado da forma esperada.");
}
