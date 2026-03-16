const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Atualizar o Filtro no useEffect (Fazer carregar apenas próximos)
const searchFilter = `                // Filtrar agendamentos cancelados para não poluir a dashboard
                const activeApts = Array.isArray(aptData) 
                    ? aptData.filter((a: any) => a.status !== 'CANCELLED' && a.status !== 'CANCELADO' && a.status !== 'CANCEL')
                    : [];`;

const replaceFilter = `                // Filtrar agendamentos cancelados e passados para não poluir a dashboard
                const activeApts = Array.isArray(aptData) 
                    ? aptData.filter((a: any) => {
                        const isCancelled = a.status === 'CANCELLED' || a.status === 'CANCELADO' || a.status === 'CANCEL';
                        if (isCancelled) return false;
                        
                        const aptDate = new Date(a.date);
                        const now = new Date();
                        now.setHours(0,0,0,0); // Considerar dia de hoje inteiro ativo
                        return aptDate >= now;
                    })
                    : [];`;

if (content.indexOf(searchFilter) !== -1) {
    content = content.replace(searchFilter, replaceFilter);
    console.log("Filtro de datas aplicado no Dashboard!");
}

// 2. Remover onClick de abrir Modal do Card
const searchOnClick = `<div key={apt.id} onClick={() => setSelectedAppointment(apt)} className="bg-white`;
const replaceOnClick = `<div key={apt.id} className="bg-white`;

if (content.indexOf(searchOnClick) !== -1) {
    content = content.replace(searchOnClick, replaceOnClick);
    console.log("Click de modal removido dos cards!");
}

// 3. Atualizar Texto e Link de Ver Agenda
const searchLink = `<Link href="/dashboard/agenda" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-cyan-700 dark:hover:text-primary transition-colors">
                            Ver agenda completa <ChevronRight className="w-4 h-4" />
                        </Link>`;

const replaceLink = `<Link href="/dashboard/agenda?view=list" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-cyan-700 dark:hover:text-primary transition-colors">
                            Ver lista completa <ChevronRight className="w-4 h-4" />
                        </Link>`;

if (content.indexOf(searchLink) !== -1) {
    content = content.replace(searchLink, replaceLink);
    console.log("Link de ver lista completa atualizado!");
}

// 4. Remover o Bloco do Modal que injetei no final
const regexModal = /\{selectedAppointment && \([\s\S]*?\}\s*<\/div>\s*\);\s*\}/g;

if (regexModal.test(content)) {
    // Para não quebrar o arquivo de volta, vou dar replace por apenas \n </div> \n ); \n }
    content = content.replace(regexModal, '}\n        </div>\n    );\n}');
    console.log("Modal removido do final do arquivo Dashboard!");
}

fs.writeFileSync(path, content, 'utf8');
