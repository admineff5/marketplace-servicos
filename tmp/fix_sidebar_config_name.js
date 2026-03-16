const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\layout.tsx';
let content = fs.readFileSync(path, 'utf8');

const linkOld = `{ name: "Configurações", href: "/dashboard/config", icon: Building },`;
const linkNew = `{ name: "Perfil da Loja", href: "/dashboard/config", icon: Building },`;

if (content.indexOf(linkOld) !== -1) {
    content = content.replace(linkOld, linkNew);
    console.log("Nome da Sidebar alterado para Perfil da Loja!");
    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("Nome da Sidebar antigo não encontrado.");
}
