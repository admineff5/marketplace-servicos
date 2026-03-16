const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\config\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const divOld = `<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome Fantasia (Marketplace)</label>
                                        <input 
                                            type="text" 
                                            readOnly
                                            disabled
                                            value={maskCNPJ(company.cnpj || "")} 
                                            placeholder="00.000.000/0000-00"
                                            className="w-full bg-gray-100 dark:bg-gray-800/80 border-none rounded-lg px-4 py-2.5 text-gray-500 dark:text-gray-400 outline-none cursor-not-allowed select-none opacity-80" 
                                        />
                                    </div>
                                </div>`;

const divNew = `<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome Fantasia (Marketplace)</label>
                                        <input 
                                            type="text" 
                                            value={company.name || ""} 
                                            onChange={(e) => setCompany({...company, name: e.target.value})}
                                            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-600 dark:focus:ring-cyan-600/50 dark:focus:ring-primary/50" 
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Razão Social</label>
                                        <input 
                                            type="text" 
                                            value={company.legalName || ""} 
                                            onChange={(e) => setCompany({...company, legalName: e.target.value})}
                                            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-600 dark:focus:ring-cyan-600/50 dark:focus:ring-primary/50" 
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">CNPJ</label>
                                        <input 
                                            type="text" 
                                            readOnly
                                            disabled
                                            value={maskCNPJ(company.cnpj || "")} 
                                            placeholder="00.000.000/0000-00"
                                            className="w-full bg-gray-100 dark:bg-gray-800/80 border-none rounded-lg px-4 py-2.5 text-gray-500 dark:text-gray-400 outline-none cursor-not-allowed select-none opacity-80" 
                                        />
                                    </div>
                                </div>`;

if (content.indexOf('value={maskCNPJ(company.cnpj || "")}') !== -1) {
    // Usar Regex para arrumar o bloco danificado
    const errorRegex = /<div className="grid grid-cols-1 md:grid-cols-2 gap-4">[^]*?<label[^]*?>Nome Fantasia \(Marketplace\)<\/label>[^]*?<input[^]*?\/>\s*<\/div>\s*<\/div>/;
    if (errorRegex.test(content)) {
        content = content.replace(errorRegex, divNew);
        console.log("Inputs de Nome e Razão Social restaurados com sucesso!");
    } else {
        console.log("Regex de erro não deu match no arquivo.");
    }
    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("Texto do CNPJ não encontrado no arquivo.");
}
