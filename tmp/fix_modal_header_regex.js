const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Regex para engolir o Bloco de Inserções das Unhas
const bannerRegex = /\{\/\* Decorative Header Banner \*\/\}\s+<div className="h-\[120px\] bg-\[#FFF1B8\][\s\S]*?<\/div>/g;

const newBanner = `{/* Decorative Header Banner */}
                            <div className="h-[120px] bg-[#FFF1B8] dark:bg-[#1a1a1a] relative overflow-hidden flex items-end px-6 border-b border-gray-200 dark:border-gray-800/50">
                                {/* Quadro/Espelho Esquerda */}
                                <div className="absolute bottom-0 left-8 w-24 h-20 bg-[#FFE59E] dark:bg-[#2c2d31] rounded-t-xl border border-[#DCC78A] dark:border-gray-700/50">
                                    <div className="absolute -top-1 left-3 w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>
                                    <div className="absolute -top-1 right-3 w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>
                                </div>
                                
                                {/* Quadro/Espelho Direita */}
                                <div className="absolute bottom-0 right-16 w-36 h-24 bg-[#FFE59E] dark:bg-[#2c2d31] rounded-t-xl border border-[#DCC78A] dark:border-gray-700/50">
                                    <div className="absolute -top-1 left-4 w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>
                                    <div className="absolute -top-1 right-4 w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>
                                </div>

                                {/* Utensílios de Salão Vetoriais */}
                                {/* Máquina de Corte */}
                                <div className="absolute bottom-0 left-12 w-6 h-14 bg-[#1E1A35] rounded-t flex flex-col items-center">
                                    <div className="w-5 h-2 bg-[#6444B8] rounded mt-1"></div>
                                    <div className="w-1 h-4 bg-white/30 mt-1.5 rounded-full"></div>
                                </div>

                                {/* Borrifador Rosa */}
                                <div className="absolute bottom-0 left-24 w-10 h-14 bg-[#FFBADB] dark:bg-[#a64e72] rounded-lg flex flex-col items-center">
                                    <div className="absolute -top-3 w-4 h-4 bg-[#7BCBE6] rounded"></div>
                                    <div className="absolute -top-4 left-6 w-3 h-1 bg-[#1E1A35]"></div>
                                    <div className="w-4 h-1 bg-[#1E1A35] mt-1"></div>
                                </div>

                                {/* Copo de Tesoura e Pente */}
                                <div className="absolute bottom-0 right-32 w-11 h-12 bg-white/40 dark:bg-white/10 backdrop-blur-sm border border-white/30 rounded-t-md flex items-end">
                                    {/* Tesoura Rosa */}
                                    <div className="absolute bottom-5 left-1 w-7 h-12 border-2 border-[#FA97CF] rounded-full transform -rotate-12"></div>
                                    {/* Pente Roxo */}
                                    <div className="absolute bottom-2 right-2 w-2 h-16 bg-[#50458C] rounded-sm"></div>
                                </div>
                            </div>`;

if (bannerRegex.test(content)) {
    content = content.replace(bannerRegex, newBanner);
    console.log("Ilustração Vetorial de Salão aplicada com sucesso!");
    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("Regex do Banner falhou em dar Match!");
}
