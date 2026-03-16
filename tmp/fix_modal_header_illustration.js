const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const searchBanner = `                            {/* Decorative Header Banner */}
                            <div className="h-[120px] bg-[#FFF1B8] dark:bg-[#111] relative overflow-hidden flex items-end px-6 border-b border-gray-100 dark:border-gray-800/50">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#FFF1B8] via-[#FFF5D1] to-[#FFE8A1] dark:from-[#2a2b2f] dark:to-[#111] opacity-50"></div>
                                <div className="absolute bottom-0 left-8 w-12 h-16 bg-[#E6D19C] dark:bg-gray-800/40 rounded-t-md"></div>
                                <div className="absolute bottom-6 left-[38px] w-8 h-10 bg-white dark:bg-gray-900 rounded-md shadow-sm"></div>
                                <div className="absolute bottom-0 right-16 w-16 h-20 bg-[#FFA5DA] dark:bg-pink-950/20 rounded-t-lg"></div>
                                <div className="absolute bottom-10 right-20 w-8 h-12 bg-white/40 dark:bg-white/5 rounded-sm"></div>
                            </div>`;

const replaceBanner = `                            {/* Decorative Header Banner */}
                            <div className="h-[120px] bg-[#FFF1B8] dark:bg-[#1a1a1a] relative overflow-hidden flex items-end px-6 border-b border-gray-100 dark:border-gray-800/50">
                                {/* Quadro Espelho Esquerda */}
                                <div className="absolute bottom-0 left-8 w-24 h-20 bg-[#FFE59E] dark:bg-[#2c2d31] rounded-t-xl border border-[#DCC78A] dark:border-gray-700/50">
                                    <div className="absolute -top-1 left-3 w-1 h-1 bg-white rounded-full"></div>
                                    <div className="absolute -top-1 right-3 w-1 h-1 bg-white rounded-full"></div>
                                </div>
                                
                                {/* Quadro Espelho Direita */}
                                <div className="absolute bottom-0 right-16 w-36 h-24 bg-[#FFE59E] dark:bg-[#2c2d31] rounded-t-xl border border-[#DCC78A] dark:border-gray-700/50">
                                    <div className="absolute -top-1 left-4 w-1 h-1 bg-white rounded-full"></div>
                                    <div className="absolute -top-1 right-4 w-1 h-1 bg-white rounded-full"></div>
                                    <div className="absolute -top-1 left-1/2 w-1 h-1 bg-white rounded-full"></div>
                                </div>

                                {/* Utensílios Vetoriais */}
                                {/* Máquina de Acabamento */}
                                <div className="absolute bottom-0 left-12 w-6 h-14 bg-[#1E1A35] rounded-t flex flex-col items-center">
                                    <div className="w-5 h-2 bg-[#6444B8] rounded mt-1"></div>
                                    <div className="w-1 h-4 bg-white/40 mt-1.5 rounded-full"></div>
                                </div>
                                
                                {/* Borrifador de Água Rosa */}
                                <div className="absolute bottom-0 left-22 w-10 h-14 bg-[#FFBADB] dark:bg-[#a64e72] rounded-lg flex flex-col items-center">
                                    <div className="absolute -top-2 w-4 h-4 bg-[#7BCBE6] rounded-sm"></div>
                                    <div className="absolute -top-3 left-6 w-3 h-1 bg-[#1E1A35]"></div>
                                    <div className="w-4 h-1 bg-[#1E1A35] mt-1"></div>
                                </div>

                                {/* Copo com Tesoura e Pente */}
                                <div className="absolute bottom-0 right-28 w-11 h-12 bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-white/40 rounded-t-md flex items-end">
                                    {/* Tesoura Rosa */}
                                    <div className="absolute bottom-4 left-1 w-7 h-12 border-2 border-[#FA97CF] rounded-full transform -rotate-12"></div>
                                    {/* Pente Azul */}
                                    <div className="absolute bottom-2 right-2 w-2 h-16 bg-[#50458C] rounded-sm"></div>
                                </div>
                            </div>`;

if (content.indexOf(searchBanner) !== -1) {
    content = content.replace(searchBanner, replaceBanner);
    console.log("Banner de Unhas substituído por Ilustração Vetorial de Salão!");
} else {
    console.log("Banner original não encontrado para substituição!");
}

fs.writeFileSync(path, content, 'utf8');
