const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const duplicateBlock = `                                 <div className="absolute bottom-0 left-8 w-12 h-16 bg-[#E6D19C] dark:bg-gray-800/40 rounded-t-md"></div>
                                 <div className="absolute bottom-6 left-[38px] w-8 h-10 bg-white dark:bg-gray-900 rounded-md shadow-sm"></div>
                                 <div className="absolute bottom-0 right-16 w-16 h-20 bg-[#FFA5DA] dark:bg-pink-950/20 rounded-t-lg"></div>
                                 <div className="absolute bottom-10 right-20 w-8 h-12 bg-white/40 dark:bg-white/5 rounded-sm"></div>
                             </div>`;

if (content.indexOf(duplicateBlock) !== -1) {
    content = content.replace(duplicateBlock, '');
    console.log("Sobras do Modal removidas com sucesso!");
    fs.writeFileSync(path, content, 'utf8');
} else {
    // Procura com \n apenas (Se for o caso)
    const duplicateBlockLF = `                                 <div className="absolute bottom-0 left-8 w-12 h-16 bg-[#E6D19C] dark:bg-gray-800/40 rounded-t-md"></div>\n                                 <div className="absolute bottom-6 left-[38px] w-8 h-10 bg-white dark:bg-gray-900 rounded-md shadow-sm"></div>\n                                 <div className="absolute bottom-0 right-16 w-16 h-20 bg-[#FFA5DA] dark:bg-pink-950/20 rounded-t-lg"></div>\n                                 <div className="absolute bottom-10 right-20 w-8 h-12 bg-white/40 dark:bg-white/5 rounded-sm"></div>\n                             </div>`;
    if (content.indexOf(duplicateBlockLF) !== -1) {
        content = content.replace(duplicateBlockLF, '');
        console.log("Sobras do Modal removidas via LF!");
        fs.writeFileSync(path, content, 'utf8');
    } else {
        console.log("Sobras do Modal não encontradas!");
    }
}
