const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const buttonRegex = /<div className="flex items-center gap-2 sm:mt-0 mt-2 sm:border-t-0 border-t[^]*?">[\s\S]*?\{apt\.phone/g;

const buttonNew = `<div className="flex items-center gap-2 sm:mt-0 mt-2 sm:border-t-0 border-t border-gray-100 dark:border-gray-800 sm:pt-0 pt-3">
                                                    {(apt.status === 'PENDING' || apt.status === 'PENDENTE') && (
                                                        <button 
                                                            onClick={(e) => approveAppointment(apt.id, e)} 
                                                            className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 rounded-md hover:bg-green-200 dark:hover:bg-green-500/20 transition-colors"
                                                        >
                                                            Aprovar
                                                        </button>
                                                    )}
                                                    {apt.phone`;

if (buttonRegex.test(content)) {
    content = content.replace(buttonRegex, buttonNew);
    console.log("Botão Aprovar injetado com sucesso via Regex!");
    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("Regex do Botão Aprovar falhou.");
}
