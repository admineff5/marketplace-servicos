const fs = require('fs');
const pathLayout = 'c:\\Antigravity\\app\\dashboard\\layout.tsx';
const pathPage = 'c:\\Antigravity\\app\\dashboard\\config\\page.tsx';

// 1. Atualizar Layout (Sidebar)
if (fs.existsSync(pathLayout)) {
    let layoutContent = fs.readFileSync(pathLayout, 'utf8');
    
    // Trocar icon na lista
    const linkOld = `{ name: "Configurações", href: "/dashboard/config", icon: Settings },`;
    const linkNew = `{ name: "Configurações", href: "/dashboard/config", icon: Building },`;
    
    if (layoutContent.indexOf(linkOld) !== -1) {
        layoutContent = layoutContent.replace(linkOld, linkNew);
        console.log("Ícone da Sidebar atualizado para Building!");
        fs.writeFileSync(pathLayout, layoutContent, 'utf8');
    }
}

// 2. Atualizar Página (Título e CNPJ)
if (fs.existsSync(pathPage)) {
    let pageContent = fs.readFileSync(pathPage, 'utf8');
    
    // Trocar ícone no Título
    const iconPageOld = `<Settings className="w-6 h-6 text-cyan-700 dark:text-primary" />`;
    const iconPageNew = `<Building className="w-6 h-6 text-cyan-700 dark:text-primary" />`;
    
    if (pageContent.indexOf(iconPageOld) !== -1) {
        pageContent = pageContent.replace(iconPageOld, iconPageNew);
        console.log("Ícone do Título atualizado para Building!");
    }
    
    // Bloquear CNPJ
    const cnpjOld = `<input 
                                            type="text" 
                                            value={maskCNPJ(company.cnpj || "")} 
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\\D/g, "").slice(0, 14);
                                                setCompany({...company, cnpj: val});
                                            }}
                                            placeholder="00.000.000/0000-00"
                                            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-600 dark:focus:ring-cyan-600/50 dark:focus:ring-primary/50" 
                                        />`;
                                        
    const cnpjNew = `<input 
                                            type="text" 
                                            readOnly
                                            disabled
                                            value={maskCNPJ(company.cnpj || "")} 
                                            placeholder="00.000.000/0000-00"
                                            className="w-full bg-gray-100 dark:bg-gray-800/80 border-none rounded-lg px-4 py-2.5 text-gray-500 dark:text-gray-400 outline-none cursor-not-allowed select-none opacity-80" 
                                        />`;
                                        
    if (pageContent.indexOf('<label className="text-sm font-medium text-gray-700 dark:text-gray-300">CNPJ</label>') !== -1) {
         // Como o bloco do input pode ter variações de espaços, usar uma macro mais segura ou regex
         const inputRegex = /<input[^]*?value={maskCNPJ\(company\.cnpj \|\| ""\)}[^]*?\/>/;
         if (inputRegex.test(pageContent)) {
             pageContent = pageContent.replace(inputRegex, cnpjNew);
             console.log("Campo CNPJ travado como Readonly!");
         } else {
              console.log("Regex do input CNPJ não deu match.");
         }
    }

    fs.writeFileSync(pathPage, pageContent, 'utf8');
}
