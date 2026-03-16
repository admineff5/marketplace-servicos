const fs = require('fs');
const path = 'c:\\Antigravity\\app\\api\\appointments\\route.ts';
let content = fs.readFileSync(path, 'utf8');

const oldApi = `if (dateStr) {
                // Forçar meio-dia para evitar problemas de fuso ao extrair o dia
                const date = new Date(dateStr + 'T12:00:00');
                const startOfDay = new Date(date);
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date(date);
                endOfDay.setHours(23, 59, 59, 999);
                whereClause.date = { gte: startOfDay, lte: endOfDay };
            }`;

const newApi = `const startDateStr = searchParams.get("startDate");
            const endDateStr = searchParams.get("endDate");

            if (startDateStr && endDateStr) {
                const start = new Date(startDateStr + 'T00:00:00');
                const end = new Date(endDateStr + 'T23:59:59');
                whereClause.date = { gte: start, lte: end };
            } else if (dateStr) {
                // Forçar meio-dia para evitar problemas de fuso ao extrair o dia
                const date = new Date(dateStr + 'T12:00:00');
                const startOfDay = new Date(date);
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date(date);
                endOfDay.setHours(23, 59, 59, 999);
                whereClause.date = { gte: startOfDay, lte: endOfDay };
            }`;

if (content.indexOf('if (dateStr)') !== -1) {
    content = content.replace(oldApi, newApi);
    fs.writeFileSync(path, content, 'utf8');
    console.log("API de Appointments atualizada para suportar startDate/endDate!");
} else {
    console.log("Trecho da API não encontrado.");
}
