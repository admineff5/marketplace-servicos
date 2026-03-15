const fs = require('fs');
const path = 'c:\\Antigravity\\app\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Inserir os states de scroll de datas (Adicionando o scrollRef de forma correta)
const scrollHooks = `const [companies, setCompanies] = useState<any[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);

  // Scroll de Datas do Modal de Agendamento
  const dateScrollRef = useRef<HTMLDivElement>(null);
  const scrollDays = (direction: 'left' | 'right') => {
    if (dateScrollRef.current) {
      dateScrollRef.current.scrollBy({ left: direction === 'left' ? -220 : 220, behavior: "smooth" });
    }
  };`;

content = content.replace(/const \[companies, setCompanies\] = useState<any\[\]>\(\[\]\);[\s\S]*?const \[isLoadingCompanies, setIsLoadingCompanies\] = useState\(true\);/m, scrollHooks);

// 2. Wrap das Datas no Carrosel com botões
const modalPattern = /<h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">[\s\S]*?3\. Escolha o Dia[\s\S]*?<\/h3>[\s\S]*?<div className="flex items-center gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide py-1 px-1">([\s\S]*?)<\/div>/g;

const modalReplacement = `<h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    3. Escolha o Dia
                  </h3>
                  <div className="relative group/scroll">
                    {/* Botão Esquerda */}
                    <button 
                      onClick={() => scrollDays('left')}
                      className="hidden md:flex absolute -left-2 top-[30px] z-10 bg-white/95 dark:bg-[#151516]/95 backdrop-blur-sm border border-gray-200 dark:border-gray-800 p-1.5 rounded-full shadow-md text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1a1c] hover:scale-105 transition-all opacity-0 group-hover/scroll:opacity-100"
                      aria-label="Rolar para esquerda"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div ref={dateScrollRef} className="flex items-center gap-3 overflow-x-auto pb-4 mb-3 scrollbar-hide py-1 px-1">
                      $1
                    </div>

                    {/* Botão Direita */}
                    <button 
                      onClick={() => scrollDays('right')}
                      className="hidden md:flex absolute -right-2 top-[30px] z-10 bg-white/95 dark:bg-[#151516]/95 backdrop-blur-sm border border-gray-200 dark:border-gray-800 p-1.5 rounded-full shadow-md text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1a1c] hover:scale-105 transition-all opacity-0 group-hover/scroll:opacity-100"
                      aria-label="Rolar para direita"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>`;

if (content.match(modalPattern)) {
    content = content.replace(modalPattern, modalReplacement);
    fs.writeFileSync(path, content, 'utf8');
    console.log('Scroll buttons applied to calendar modal successfully!');
} else {
    console.log('Pattern not found!');
}
