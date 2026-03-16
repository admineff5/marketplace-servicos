const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const filterRegex = /\.filter\(\(apt: any\) => \{[\s\S]*?return true;[\s\S]*?\}\)/g;

const filterNew = `.filter((apt: any) => {
                                            const isCancelled = apt.status === 'CANCELLED' || apt.status === 'CANCELADO';
                                            if (isCancelled) return false;
                                            const matchesPro = selectedPros.includes(apt.employeeId) || selectedPros.includes(apt.employee?.id) || selectedPros.includes(apt.prof);
                                            if (!matchesPro) return false;

                                            // Se houver filtro por periodo, aceitar tudo que a API mandar
                                            if (startDate && endDate) return true;

                                            if (selectedMiniDate) {
                                                const aptDate = new Date(apt.date);
                                                const aptDay = aptDate.getUTCDate();
                                                const aptMonth = aptDate.getUTCMonth();
                                                const aptYear = aptDate.getUTCFullYear();
                                                if (aptDay !== selectedMiniDate || aptMonth !== month || aptYear !== year) {
                                                    return false;
                                                }
                                            }
                                            
                                            // Se nao houver data selecionada, manter o padrao de 'Proximos' para nao poluir
                                            if (!selectedMiniDate && listFilter === "Proximos") {
                                                const aptDate = new Date(apt.date);
                                                const now = new Date();
                                                now.setHours(0,0,0,0);
                                                return aptDate >= now;
                                            }
                                            return true;
                                        })`;

if (content.indexOf('.filter((apt: any) => {') !== -1) {
    // Usar Regex para dar replace em todo o bloco .filter de LISTA
    const parts = content.split('.filter((apt: any) => {');
    if (parts.length > 2) {
        // O segundo .filter é o da lista (O primeiro é o do Calendario).
        // Vamos remontar o arquivo com o segundo filter substituido
        const secondPart = parts[2];
        const closeIndex = secondPart.indexOf('})');
        
        parts[2] = filterNew.replace('.filter((apt: any) => {', '') + secondPart.substring(closeIndex + 2);
        content = parts.join('.filter((apt: any) => {');
        fs.writeFileSync(path, content, 'utf8');
        console.log("Filtro do Front-end atualizado para suportar RANGE livrememente!");
    } else {
         console.log("Nao foi possivel individualizar o segundo .filter");
    }
} else {
    console.log("Trecho do .filter não encontrado.");
}
