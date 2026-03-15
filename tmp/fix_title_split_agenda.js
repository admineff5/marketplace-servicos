const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Corrigir TODOS os `.title.split('-')[0].trim()` para evitar tela branca de "split of undefined"
content = content.replace(/apt\.title\.split\('-'\)\[0\]\.trim\(\)/g, "(apt.service?.name || apt.title?.split('-')[0]?.trim() || 'Serviço')");

// 2. Corrigir os filtros `selectedPros.includes(apt.prof)` que estão removendo reais do calendário
content = content.replace(/selectedPros\.includes\(apt\.prof\)/g, "(selectedPros.includes(apt.employeeId) || selectedPros.includes(apt.employee?.id) || selectedPros.includes(apt.prof))");

// 3. Adicionar filtro de agendamentos ativos (Diferentes de Cancelados) na Grid do Mês
const filterMonth = `const dayAppointments = appointments.filter((apt: any) => {
                                                    if (!day.date) return false;
                                                    const aptDate = new Date(apt.date);
                                                    
                                                    // Usar getUTCDate para evitar problemas de fuso horário
                                                    const aptDay = aptDate.getUTCDate();
                                                    const aptMonth = aptDate.getUTCMonth();
                                                    const aptYear = aptDate.getUTCFullYear();

                                                    return (
                                                        aptDay === day.date &&
                                                        aptMonth === month &&
                                                        aptYear === year &&
                                                        (selectedPros.length === 0 || selectedPros.includes(apt.employeeId || apt.employee?.id) || selectedPros.includes(apt.prof)) &&
                                                        apt.status !== 'CANCELLED' && apt.status !== 'CANCELADO'
                                                    );
                                                });`;

// Replace literal na Grid do Mês para assegurar o filtro de status e profissional
const monthPattern = /const dayAppointments = appointments\.filter\([\s\S]*?return \([\s\S]*?aptDay === day\.date[\s\S]*?aptMonth === month[\s\S]*?aptYear === year[\s\S]*?\([\s\S]*?\)[\s\S]*?\);[\s\S]*?\}\);/m;

if (content.match(monthPattern)) {
    content = content.replace(monthPattern, filterMonth);
    console.log("Filtro de Mês atualizado!");
}

// 4. Correção filtro Semana (Status)
const filterWeek = `const colApts = appointments.filter((apt: any) => {
                                                    const aptDate = new Date(apt.date);
                                                    return (
                                                        aptDate.getUTCDate() === cDate &&
                                                        aptDate.getUTCMonth() === cMon &&
                                                        aptDate.getUTCFullYear() === cYear &&
                                                        (selectedPros.includes(apt.employeeId) || selectedPros.includes(apt.employee?.id) || selectedPros.includes(apt.prof)) &&
                                                        apt.status !== 'CANCELLED' && apt.status !== 'CANCELADO'
                                                    );
                                                });`;

const weekPattern = /const colApts = appointments\.filter\([\s\S]*?return \([\s\S]*?aptDate\.getUTCDate\(\) === cDate[\s\S]*?aptDate\.getUTCMonth\(\) === cMon[\s\S]*?aptDate\.getUTCFullYear\(\) === cYear[\s\S]*?selectedPros\.includes\([\s\S]*?\)[\s\S]*?\);[\s\S]*?\}\);/m;

if (content.match(weekPattern)) {
    content = content.replace(weekPattern, filterWeek);
    console.log("Filtro de Semana atualizado!");
}

// 5. Correção filtro Dia (Status) - Mudar de loop completo para o retorno
const filterDay = `appointments.filter((apt: any) => {
                                                    const aptDate = new Date(apt.date);
                                                    return (
                                                        aptDate.getUTCDate() === currentDate.getDate() &&
                                                        aptDate.getUTCMonth() === currentDate.getMonth() &&
                                                        aptDate.getUTCFullYear() === currentDate.getFullYear() &&
                                                        (selectedPros.includes(apt.employeeId) || selectedPros.includes(apt.employee?.id) || selectedPros.includes(apt.prof)) &&
                                                        apt.status !== 'CANCELLED' && apt.status !== 'CANCELADO'
                                                    );
                                                })`;

const dayPattern = /appointments\.filter\([\s\S]*?return \([\s\S]*?aptDate\.getUTCDate\(\) === currentDate[\s\S]*?aptDate\.getUTCMonth\(\) === currentDate[\s\S]*?aptDate\.getUTCFullYear\(\) === currentDate[\s\S]*?selectedPros\.includes\([\s\S]*?\)[\s\S]*?\);[\s\S]*?\}\)/m;

if (content.match(dayPattern)) {
    content = content.replace(dayPattern, filterDay);
    console.log("Filtro de Dia atualizado!");
}

fs.writeFileSync(path, content, 'utf8');
console.log("Correções de Title e Filtros aplicadas com sucesso!");
