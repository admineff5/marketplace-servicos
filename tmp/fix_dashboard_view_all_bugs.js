const fs = require('fs');

// 1. Atualizar API de agendamentos para aceitar fromToday
const apiPath = 'c:\\Antigravity\\app\\api\\appointments\\route.ts';
if (fs.existsSync(apiPath)) {
    let apiContent = fs.readFileSync(apiPath, 'utf8');
    const searchApi = `            if (dateStr) {
                // Forçar meio-dia para evitar problemas de fuso ao extrair o dia
                const date = new Date(dateStr + 'T12:00:00');
                const startOfDay = new Date(date);
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date(date);
                endOfDay.setHours(23, 59, 59, 999);
                whereClause.date = { gte: startOfDay, lte: endOfDay };
            }`;
            
    const replaceApi = `            if (dateStr) {
                // Forçar meio-dia para evitar problemas de fuso ao extrair o dia
                const date = new Date(dateStr + 'T12:00:00');
                const startOfDay = new Date(date);
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date(date);
                endOfDay.setHours(23, 59, 59, 999);
                whereClause.date = { gte: startOfDay, lte: endOfDay };
            }

            const fromTodayStr = searchParams.get("fromToday");
            if (fromTodayStr === "true") {
                const now = new Date();
                now.setHours(0, 0, 0, 0);
                if (whereClause.date) {
                    whereClause.date.gte = now; // Se já houver data, combinar
                } else {
                    whereClause.date = { gte: now };
                }
            }`;

    if (apiContent.indexOf(searchApi) !== -1) {
        apiContent = apiContent.replace(searchApi, replaceApi);
        fs.writeFileSync(apiPath, apiContent, 'utf8');
        console.log("API de Appointments atualizada com suporte a fromToday!");
    } else {
        console.log("Trecho da API não encontrado para replace.");
    }
}

// 2. Atualizar o Fetch em /app/dashboard/page.tsx
const dashPath = 'c:\\Antigravity\\app\\dashboard\\page.tsx';
if (fs.existsSync(dashPath)) {
    let dashContent = fs.readFileSync(dashPath, 'utf8');
    const searchFetch = `const aptRes = await fetch('/api/appointments?limit=10');`;
    const replaceFetch = `const aptRes = await fetch('/api/appointments?limit=10&fromToday=true');`;
    
    if (dashContent.indexOf(searchFetch) !== -1) {
        dashContent = dashContent.replace(searchFetch, replaceFetch);
        fs.writeFileSync(dashPath, dashContent, 'utf8');
        console.log("Fetch da Dashboard atualizado para puxar próximos!");
    } else {
        console.log("Fetch da Dashboard não encontrado.");
    }
}

// 3. Atualizar Inicializador de State em /app/dashboard/agenda/page.tsx
const agendaPath = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
if (fs.existsSync(agendaPath)) {
    let agendaContent = fs.readFileSync(agendaPath, 'utf8');
    const searchLayoutState = `const [agendaLayout, setAgendaLayout] = useState<"calendar" | "list">("calendar");`;
    const replaceLayoutState = `const [agendaLayout, setAgendaLayout] = useState<"calendar" | "list">(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('view') === 'list') return 'list';
        }
        return 'calendar';
    });`;

    if (agendaContent.indexOf(searchLayoutState) !== -1) {
        agendaContent = agendaContent.replace(searchLayoutState, replaceLayoutState);
        fs.writeFileSync(agendaPath, agendaContent, 'utf8');
        console.log("Agenda Layout dinamizado com sucesso!");
    } else {
        console.log("State de Layout da Agenda não encontrado.");
    }
}
