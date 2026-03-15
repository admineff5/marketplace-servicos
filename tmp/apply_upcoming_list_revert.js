const fs = require('fs');
const path = 'c:\\Antigravity\\app\\cliente\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Reverter a Div principal para space-y-4
content = content.replace(
    /<div className=\{activeTab === "upcoming" \? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"\}>/g,
    '<div className="space-y-4">'
);

// 2. Substituir upcoming.map para o formato em Lista Anterior
const upcomingPattern = /upcoming\.map\(item => \([\s\S]*?\)\s*\)\s*:\s*\(/g;

const upcomingReplacement = `upcoming.map(item => (
                        <div key={item.id} className="bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md flex flex-col sm:flex-row gap-5 relative overflow-hidden group">
                            {/* Image */}
                            <div className="w-full sm:w-24 h-32 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-gray-200 dark:border-gray-800">
                                <img 
                                    src={item.image} 
                                    alt={item.company} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{item.service}</h3>
                                            <p className="font-medium text-cyan-700 dark:text-primary text-sm">{item.company}</p>
                                        </div>
                                        <span className={\`px-2.5 py-1 text-xs font-bold rounded-full \${item.status === 'confirmed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}\`}>
                                            {item.status === 'confirmed' ? 'Confirmado' : 'Aguardando'}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 lg:flex lg:flex-row gap-4 mt-4 text-xs font-medium text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a1c] px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800/50">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {item.rawDate ? new Date(item.rawDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : item.date}
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a1c] px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800/50">
                                        <Clock className="w-3.5 h-3.5" />
                                        {item.rawDate ? new Date(item.rawDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : item.time}
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a1c] px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800/50">
                                        <User className="w-3.5 h-3.5" /> {item.professional}
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a1c] px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800/50">
                                        <MapPin className="w-3.5 h-3.5" /> {item.address.split('-')[0]}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex sm:flex-col justify-end items-center sm:items-end gap-2 border-t sm:border-t-0 border-gray-100 dark:border-gray-800 pt-4 sm:pt-0">
                                <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.price}</p>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleCancel(item.id)} className="px-3 py-2 border border-red-200 bg-red-50 dark:bg-red-900/10 rounded-lg text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors">Cancelar</button>
                                    <button onClick={() => handleRebook(item)} className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-colors">Reagendar</button>
                                    <button onClick={() => window.open(item.mapsLink || \`https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent(item.address)}\`, '_blank')} className="px-3 py-2 bg-cyan-500/10 text-cyan-700 dark:bg-primary/20 dark:text-primary border border-cyan-600/30 dark:border-primary/30 rounded-lg text-xs font-bold hover:bg-cyan-700 hover:text-white dark:hover:bg-primary dark:hover:text-black transition-colors flex items-center gap-1">Ver Rota</button>
                                </div>
                            </div>
                        </div>
                    )) : (`;

content = content.replace(upcomingPattern, upcomingReplacement);

fs.writeFileSync(path, content, 'utf8');
console.log('Upcoming list format applied successfully!');
