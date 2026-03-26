"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, User, Package, Scissors, Sparkles, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function OmniSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [results, setResults] = useState<any>({ clients: [], products: [], services: [], aiSuggestions: [] });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Busca Debounced
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ clients: [], products: [], services: [], aiSuggestions: [] });
      setIsLoading(false);
      setIsAiLoading(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);

    const timer = setTimeout(async () => {
      try {
        setResults((prev: any) => ({ ...prev, aiSuggestions: [] }));
        setIsAiLoading(true);

        // 1. Instant DB Search
        const res = await fetch(`/api/dashboard/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (!data.error) {
          setResults((prev: any) => ({ ...data, aiSuggestions: prev.aiSuggestions || [] }));
        }
        setIsLoading(false);

        // 2. Background AI Semantic Routing
        fetch(`/api/dashboard/search-ai?q=${encodeURIComponent(query)}`)
          .then(r => r.json())
          .then(aiData => {
            if (!aiData.error && aiData.aiSuggestions) {
              setResults((prev: any) => ({ ...prev, aiSuggestions: aiData.aiSuggestions }));
            }
          })
          .catch(e => console.error("AI Search erro:", e))
          .finally(() => setIsAiLoading(false));

      } catch (e) {
        console.error("Busca falhou:", e);
        setIsLoading(false);
        setIsAiLoading(false);
      }
    }, 400); // 400ms DB debounce (ultra fast response)

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (url: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(url);
  };

  const hasResults = results.clients.length > 0 || results.products.length > 0 || results.services.length > 0 || (results.aiSuggestions && results.aiSuggestions.length > 0);

  return (
    <div className="relative w-full max-w-lg hidden sm:block" ref={wrapperRef}>
      {/* Input de Busca */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-cyan-600 dark:text-primary animate-spin" />
          ) : (
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-cyan-600 dark:group-focus-within:text-primary transition-colors" />
          )}
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-800 rounded-full leading-5 bg-gray-50 dark:bg-[#161618] text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm sm:w-96 transition-all duration-300 focus:sm:w-[28rem] hover:bg-white dark:hover:bg-[#1f1f22]"
          placeholder="Busque clientes, serviços ou diga o que precisa..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim().length >= 2) setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim().length >= 2) setIsOpen(true);
          }}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
           <span className="text-xs text-gray-400 font-mono hidden group-focus-within:hidden md:block border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5 bg-white dark:bg-[#111]">Ctrl K</span>
        </div>
      </div>

      {/* Dropdown de Resultados */}
      {isOpen && (query.trim().length >= 2) && (
        <div className="absolute z-50 mt-2 w-[calc(100%+2rem)] -ml-4 bg-white dark:bg-[#111] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
          
          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
            {isLoading && !hasResults && (
              <div className="p-8 text-center text-sm text-gray-500 flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-600 dark:text-primary" />
                <p>Buscando no banco de dados...</p>
              </div>
            )}

            {!isLoading && !hasResults && !isAiLoading && (
              <div className="p-8 text-center text-sm text-gray-500">
                Nenhum resultado encontrado para "{query}".<br/>Tente ser mais direto.
              </div>
            )}

            {!isLoading && !hasResults && isAiLoading && (
              <div className="p-8 text-center text-sm text-gray-500 flex flex-col items-center gap-3">
                <Sparkles className="w-5 h-5 animate-pulse text-cyan-600 dark:text-primary" />
                <p>Nenhuma correspondência exata. A IA está analisando sua intenção...</p>
              </div>
            )}

            {/* Ações Inteligentes (IA) */}
            {results.aiSuggestions && results.aiSuggestions.length > 0 && (
              <div className="p-2 border-b border-gray-100 dark:border-gray-800 bg-cyan-50/30 dark:bg-primary/5">
                <div className="px-3 py-1.5 flex items-center gap-2">
                   <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-primary" />
                   <span className="text-xs font-bold text-cyan-700 dark:text-primary uppercase tracking-widest">Navegação Inteligente (IA)</span>
                </div>
                <div className="space-y-0.5">
                  {results.aiSuggestions.map((ai: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(ai.url)}
                      className="w-full text-left px-3 py-3 rounded-xl hover:bg-white dark:hover:bg-[#1a1a1c] transition-colors group flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        {ai.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-600 dark:group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clientes */}
            {results.clients.length > 0 && (
              <div className="p-2 border-b border-gray-100 dark:border-gray-800">
                <div className="px-3 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <User className="w-3.5 h-3.5" /> Clientes Encontrados
                </div>
                <div className="space-y-0.5">
                  {results.clients.map((c: any) => (
                    <button
                      key={c.id}
                      onClick={() => handleSelect(`/dashboard/clientes?id=${c.id}`)}
                      className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{c.name}</span>
                        <span className="text-xs text-gray-500">{c.phone || c.email}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-transparent group-hover:text-gray-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Serviços */}
            {results.services.length > 0 && (
              <div className="p-2 border-b border-gray-100 dark:border-gray-800">
                <div className="px-3 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Scissors className="w-3.5 h-3.5" /> Serviços Relacionados
                </div>
                <div className="space-y-0.5">
                  {results.services.map((s: any) => (
                    <button
                      key={s.id}
                      onClick={() => handleSelect(`/dashboard/servicos?id=${s.id}`)}
                      className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex justify-between items-center group"
                    >
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{s.name}</span>
                      <span className="text-xs font-bold text-gray-500">R$ {Number(s.price).toFixed(2).replace('.',',')}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Produtos */}
            {results.products.length > 0 && (
              <div className="p-2">
                <div className="px-3 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Package className="w-3.5 h-3.5" /> Produtos / Estoque
                </div>
                <div className="space-y-0.5">
                  {results.products.map((p: any) => (
                    <button
                      key={p.id}
                      onClick={() => handleSelect(`/dashboard/produtos?id=${p.id}`)}
                      className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex justify-between items-center group"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{p.name}</span>
                        <span className="text-xs text-gray-500">Estoque: {p.stock} unid.</span>
                      </div>
                      <span className="text-xs font-bold text-gray-500">R$ {Number(p.price).toFixed(2).replace('.',',')}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
          
          <div className="bg-gray-50 dark:bg-[#161618] px-4 py-2 border-t border-gray-100 dark:border-gray-800 text-[10px] text-gray-500 text-center uppercase tracking-widest">
            Alimentado por Banco Relacional e AI Semantic Routing
          </div>
        </div>
      )}
    </div>
  );
}
