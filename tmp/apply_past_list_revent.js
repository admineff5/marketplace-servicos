const fs = require('fs');
const path = 'c:\\Antigravity\\app\\cliente\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const pastPattern = /past\.map\(item => \([\s\S]*?\)\s*\)/g;
const pastReplacement = `past.map(item => (
                        <div key={item.id} className="bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md flex flex-col sm:flex-row gap-5 relative opacity-85 hover:opacity-100">
                            {/* Image */}
                            <div className="w-full sm:w-20 h-24 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-gray-200 dark:border-gray-800 grayscale">
                                <img src={item.image} alt={item.company} className="w-full h-full object-cover" />
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-md font-bold text-gray-900 dark:text-white mb-0.5">{item.service}</h3>
                                        <p className="font-medium text-gray-500 text-sm">{item.company}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={\`px-2.5 py-1 text-xs font-bold rounded-full \${item.status === 'cancelled' ? 'bg-red-500/10 text-red-600' : 'bg-green-500/10 text-green-600'}\`}>
                                            {item.status === 'cancelled' ? 'Cancelado' : 'Realizado'}
                                        </span>
                                        <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a1c] px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800">
                                            <Calendar className="w-3.5 h-3.5 text-gray-500" />
                                            <span className="text-xs font-semibold text-gray-500">
                                                {item.rawDate ? new Date(item.rawDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : item.date}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 mt-4">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{item.price}</p>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button 
                                                key={star} 
                                                onClick={() => handleRate(item.id, star)}
                                                className="focus:outline-none transition-transform hover:scale-110"
                                            >
                                                <Star className={\`w-3.5 h-3.5 \${star <= (item.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-700"}\`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex sm:flex-col justify-end items-center sm:items-end gap-2 border-t sm:border-t-0 border-gray-100 dark:border-gray-800 pt-4 sm:pt-0">
                                <button className="px-4 py-2 flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full sm:w-auto">
                                    <Receipt className="w-4 h-4" /> Recibo
                                </button>
                                <button 
                                    onClick={() => handleRebook(item)} 
                                    className="px-4 py-2 bg-cyan-500/10 text-cyan-700 dark:bg-primary/20 dark:text-primary border border-cyan-600/30 dark:border-primary/30 rounded-lg text-sm font-bold hover:bg-cyan-700 hover:text-white dark:hover:bg-primary dark:hover:text-black transition-colors"
                                >
                                    Agendar de Novo
                                </button>
                            </div>
                        </div>
                    ))`;

content = content.replace(pastPattern, pastReplacement);

fs.writeFileSync(path, content, 'utf8');
console.log('Past actions reverted on client page successfully!');
