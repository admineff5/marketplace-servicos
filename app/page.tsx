"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Scissors,
  Dog,
  Stethoscope,
  Sparkles,
  Wrench,
  Grid,
  X,
  MapPin,
  Star,
  Phone,
  LayoutGrid,
  List,
  UserSquare2,
  CalendarOff,
  Search,
  CalendarDays,
  CheckCircle2,
  ArrowRight,
  Building2,
  BarChart3,
  Package,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ThemeToggle } from "./components/ThemeToggle";
import { Footer } from "./components/Footer";
import { useTheme } from "next-themes";

const CATEGORIES = [
  { name: "Todos", icon: Grid },
  { name: "Barbearia", icon: Scissors },
  { name: "Clínica", icon: Stethoscope },
  { name: "Estética", icon: Sparkles },
  { name: "Petshop", icon: Dog },
];

// Note: Original MOCK_COMPANIES moved to a dynamic fetch from /api/companies

// Enhanced companies logic moved inside useEffect fetch

export default function Home() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);

  // Scroll de Datas do Modal de Agendamento
  const dateScrollRef = useRef<HTMLDivElement>(null);
  const scrollDays = (direction: 'left' | 'right') => {
    if (dateScrollRef.current) {
      dateScrollRef.current.scrollBy({ left: direction === 'left' ? -220 : 220, behavior: "smooth" });
    }
  };

  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [session, setSession] = useState<any>(null);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Fetch Session
    fetch("/api/auth/session")
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) setSession(data.user);
      });
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch("/api/companies");
        const data = await res.json();
        if (Array.isArray(data)) {
          setCompanies(data);
        }
      } catch (err) {
        console.error("Error fetching companies:", err);
      } finally {
        setIsLoadingCompanies(false);
      }
    };
    fetchCompanies();
    
    // Polling: Atualização Automática a cada 30 segundos
    const interval = setInterval(fetchCompanies, 30000);
    return () => clearInterval(interval);
  }, []);
  // Handle Rebooking Parameter
  useEffect(() => {
    if (companies.length > 0) {
        const params = new URLSearchParams(window.location.search);
        if (params.get('rebook') === 'true') {
            const companyId = params.get('companyId');
            const locationId = params.get('locationId');
            const employeeId = params.get('employeeId');
            const serviceName = params.get('serviceName');
            const appointmentId = params.get('appointmentId'); // <--- Ler do param
 
            if (appointmentId) setRebookId(appointmentId); // <--- Setar no state
 
            // Find matching company/location card
            const company = companies.find(c => c.companyId === companyId && c.locationId === locationId);
            if (company) {
                handleOpenCompany(company);
                // Pre-select professional
                if (employeeId) setSelectedProfessional(employeeId);
                // Pre-select service by name (since IDs might differ or we want to be safe)
                if (serviceName) {
                    const service = company.services.find((s: any) => s.name === serviceName);
                    if (service) {
                        setSelectedServiceId(service.id);
                        setSelectedServiceName(service.name);
                    }
                }
                // Limpar params para não reabrir no refresh
                window.history.replaceState({}, '', window.location.pathname);
            }
        }
    }
  }, [companies]);

  // Scheduling State within Modal
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedServiceName, setSelectedServiceName] = useState<string | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<
    string | null
  >(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientNote, setClientNote] = useState<string>("");
  const [isBooking, setIsBooking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [rebookId, setRebookId] = useState<string | null>(null); // <--- ID do agendamento que será cancelado

  // App State
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
  const [showcaseIndex, setShowcaseIndex] = useState(0);

  // AI Search State
  const [aiExtracted, setAiExtracted] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim().length < 3) {
        setAiExtracted(null);
        return;
    }

    setIsAiLoading(true);
    setAiExtracted(null); // Resetar para mostrar o loading
    try {
        const res = await fetch("/api/search-home-ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: searchQuery })
        });
        const data = await res.json();
        if (data.extracted) {
            console.log("IA Insights:", data.extracted);
            setAiExtracted(data.extracted);
            
            // Auto-selecionar categoria se a IA identificou um nicho claro
            const niches = CATEGORIES.map(c => c.name.toLowerCase());
            const extractedService = (data.extracted.service || "").toLowerCase();
            const matchedNiche = CATEGORIES.find(c => 
                extractedService.includes(c.name.toLowerCase()) || 
                c.name.toLowerCase().includes(extractedService)
            );
            if (matchedNiche && matchedNiche.name !== "Todos") {
                setActiveCategory(matchedNiche.name);
            }
        }
    } catch (err) {
        console.error("AI Search Error:", err);
    } finally {
        setIsAiLoading(false);
    }
  };

  // Trigger AI search on debounce (Optional, but user said "always with AI")
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setAiExtracted(null);
      return;
    }
    const timer = setTimeout(() => {
        handleAiSearch();
    }, 1000); // 1s debounce to save tokens
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // References for sticky scroll logic
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Filter Logic
  const filteredCompanies = companies.filter((company: any) => {
    // SE TEMOS DADOS DA IA, O FILTRO É SEMÂNTICO (Rigoroso e Inteligente)
    if (aiExtracted && searchQuery.trim().length >= 3) {
        const matchesName = !aiExtracted.name || company.name.toLowerCase().includes(aiExtracted.name.toLowerCase());
        
        // Match por Niche ou Serviços internos (Fuzzy)
        const serviceKeywords = (aiExtracted.service || "").toLowerCase().split(' ').filter((w: string) => w.length > 2);
        const matchesService = !aiExtracted.service || 
                              company.niche.toLowerCase().includes(aiExtracted.service.toLowerCase()) ||
                              serviceKeywords.some((word: string) => company.niche.toLowerCase().includes(word)) ||
                              company.services.some((s: any) => s.name.toLowerCase().includes(aiExtracted.service.toLowerCase()));
        
        // Match por Cidade, Bairro ou CEP (Fuzzy Matching por Palavras-Chave)
        const companyFullAddress = `${company.address} ${company.neighborhood || ""} ${company.city} ${company.state}`.toLowerCase();
        const locationKeywords = (aiExtracted.location || "").toLowerCase().split(' ').filter((w: string) => w.length > 2);
        
        // Se a IA extraiu localização, tentamos match parcial por palavras (ex: "rua teste" casa com "Rua de Teste")
        const matchesLocation = !aiExtracted.location || 
                               locationKeywords.some((word: string) => companyFullAddress.includes(word)) ||
                               companyFullAddress.includes(aiExtracted.location.toLowerCase());

        // Filtro de disponibilidade de horário (Próximo de +- 45 min para ser mais flexível)
        let matchesTime = true;
        if (aiExtracted.time && aiExtracted.date) {
            const targetTime = aiExtracted.time; // "11:00"
            const [h, m] = targetTime.split(":").map(Number);
            const targetMinutes = h * 60 + m;

            matchesTime = company.staff.some((p: any) => {
                const slots = generateTimeSlots(p.hours, aiExtracted.date, p.id, company.blocks, company.appointments);
                return slots.some(slot => {
                    const [sh, sm] = slot.split(":").map(Number);
                    const slotMinutes = sh * 60 + sm;
                    // Janela de 45 min para ser mais produtivo nas sugestões
                    return Math.abs(slotMinutes - targetMinutes) <= 45;
                });
            });
        }

        return matchesName && matchesService && matchesLocation && matchesTime;
    }

    // FALLBACK: Filtro Legado (por texto simples nas categorias)
    const matchesCategory =
      activeCategory === "Todos" || company.niche === activeCategory;
    const matchesSearch =
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.niche.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // SE NÃO HOUVER NADA COM A IA, TENTAMOS UMA BUSCA RELAXADA (Apenas o serviço)
  const isSearchRelaxed = aiExtracted && filteredCompanies.length === 0;
  const displayCompanies = isSearchRelaxed ? companies.filter((c: any) => {
      const serviceKeywords = (aiExtracted.service || "").toLowerCase().split(' ').filter((w: string) => w.length > 2);
      return !aiExtracted.service || 
             c.niche.toLowerCase().includes(aiExtracted.service.toLowerCase()) ||
             serviceKeywords.some((word: string) => c.niche.toLowerCase().includes(word));
  }) : filteredCompanies;

  // Handle Scroll to make search bar sticky
  useEffect(() => {
    const handleScroll = () => {
      if (searchContainerRef.current) {
        const bounding = searchContainerRef.current.getBoundingClientRect();
        if (bounding.top < 20) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDayAllowed = (hoursRange: string | null, dayOfWeek: number) => {
    if (!hoursRange || !hoursRange.includes(" | ")) return dayOfWeek !== 0; // Default: Fechado Domingo
    const savedDays = hoursRange.split(" | ")[0];

    if (savedDays === "Segunda a Sexta") return dayOfWeek >= 1 && dayOfWeek <= 5;
    if (savedDays === "Segunda a Sábado") return dayOfWeek >= 1 && dayOfWeek <= 6;
    if (savedDays === "Terça a Sábado") return dayOfWeek >= 2 && dayOfWeek <= 6;
    if (savedDays === "Sábado e Domingo") return dayOfWeek === 6 || dayOfWeek === 0;
    
    return dayOfWeek !== 0;
  };

  const generateTimeSlots = (hoursRange: string | null, date: string | null, staffId: string | null, companyBlocks: any[] = [], companyAppointments: any[] = []) => {
    if (!hoursRange) return ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
    
    try {
      // Extrair apenas o intervalo de HORÁRIO da String
      const actualHours = hoursRange.includes(" | ") ? hoursRange.split(" | ")[1] : hoursRange;
      if (!actualHours.includes("-")) return ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

      const [start, end] = actualHours.split("-").map(t => t.trim());
      const [startHour, startMin] = start.split(":").map(Number);
      const [endHour, endMin] = end.split(":").map(Number);
      
      const slots = [];
      let currentHour = startHour;
      let currentMin = startMin;
      
      while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
        const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
        
        // Verificar se este slot específico está bloqueado por um "Fechamento Parcial"
        const isTimeBlocked = companyBlocks?.some(b => 
          b.date.startsWith(date) && 
          (b.employeeId === null || b.employeeId === staffId) &&
          !b.isAllDay &&
          timeStr >= (b.openTime || "") && timeStr <= (b.closeTime || "")
        );

        // --- NOVO BLOQUEIO DE HORÁRIOS JÁ AGENDADOS ---
        const isAlreadyBooked = companyAppointments?.some(apt => {
          const aptDate = apt.date.split("T")[0]; // "YYYY-MM-DD"
          const aptTime = new Date(apt.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          
          return aptDate === date && apt.employeeId === staffId && aptTime === timeStr;
        });

        if (!isTimeBlocked && !isAlreadyBooked) {
          slots.push(timeStr);
        }
        
        currentMin += 30; // 30 min slots
        if (currentMin >= 60) {
          currentHour += 1;
          currentMin -= 60;
        }
      }
      return slots;
    } catch (e) {
      return ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
    }
  };

  const handleOpenCompany = (company: any) => {
    setSelectedCompany(company);
    setSelectedServiceId(null);
    setSelectedCompanyId(company.companyId);
    setSelectedServiceName(null);
    setSelectedProfessional(
      company.staff && company.staff.length > 0 ? company.staff[0].id : null,
    );
    setSelectedDate(null);
    setSelectedTime(null);
    setClientNote("");
  };

  const handleConfirmBooking = async () => {
    if (!selectedTime || !selectedDate || !selectedServiceId || !selectedProfessional) return;

    if (session?.role === "BUSINESS") {
      alert("⚠️ Atenção: Perfil Profissional\n\nContas de empresa não podem realizar agendamentos de serviços. Por favor, utilize uma conta de Pessoa Física para esta ação.");
      return;
    }

    try {
      setIsBooking(true);
      // Combinar data e hora: YYYY-MM-DD + HH:mm
      const dateTime = `${selectedDate}T${selectedTime}:00`;
      
      const res = await fetch("/api/user/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: selectedProfessional,
          serviceId: selectedServiceId,
          locationId: selectedCompany.locationId,
          companyId: selectedCompanyId,
          date: new Date(dateTime).toISOString(),
          note: clientNote,
          rebookId: rebookId // <--- Envia para cancelar o antigo
        })
      });

      if (res.status === 401) {
        // Redirecionar para login se não estiver logado
        window.location.href = `/login?redirect=booking&service=${selectedServiceId}`;
        return;
      }

      const data = await res.json();
      if (data.success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          closeModal();
          // Opcional: Redirecionar para o perfil após alguns segundos
        }, 3000);
      } else {
        alert(data.error || "Erro ao agendar");
      }
    } catch (err) {
      console.error("Erro no agendamento:", err);
      alert("Falha na conexão com o servidor.");
    } finally {
      setIsBooking(false);
    }
  };

  const closeModal = () => setSelectedCompany(null);

  const openCompanyData = companies.find((c: any) => c.id === selectedCompany?.id) || selectedCompany;
  const activeProfessionalData = openCompanyData?.staff?.find(
    (p: any) => p.id === selectedProfessional,
  );

  // Generate 14 next days for mock selection
  const upcomingDays = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dayOfWeek = d.getDay(); // 0 = Domingo, 1 = Segunda...
    return {
      dateObj: d,
      dayNumber: d.getDate(),
      dayName: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][dayOfWeek],
      dayOfWeek, // Adicionado para lógica de bloqueio
      monthName: [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"
      ][d.getMonth()],
      fullDateStr: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    };
  });

  // BLOQUEIOS REAIS DA LOJA/PROFISSIONAL
  const currentBlock = selectedCompany?.blocks?.find(
    (b: any) =>
      b.date.startsWith(selectedDate) &&
      (b.employeeId === null || b.employeeId === selectedProfessional) &&
      b.isAllDay
  );

  // Verificação de Folga do Profissional (Dias da semana cadastrados)
  const selectedDateObj = upcomingDays.find(d => d.fullDateStr === selectedDate);
  const isWeekendBlock = selectedDateObj ? !isDayAllowed(activeProfessionalData?.hours, selectedDateObj.dayOfWeek) : false;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      {/* Navbar Minimalist */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md dark:bg-black/80 transition-all border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-icon.png"
              alt="Logo Icon"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Agende<span className="text-cyan-700 dark:text-primary">Já</span>
            </span>
          </div>

          <nav className="flex items-center gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-2 sm:gap-4 border-l border-gray-200 dark:border-gray-800 pl-3 sm:pl-4 ml-1 sm:ml-2">
              {session ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                    Olá, <span className="font-bold">{(session?.name || "Usuário").split(' ')[0]}</span>
                  </span>
                  <Link
                    href={session?.role === "BUSINESS" ? "/dashboard" : "/cliente"}
                    className="text-xs sm:text-sm font-bold text-cyan-700 dark:text-primary hover:underline transition-all"
                  >
                    {session?.role === "BUSINESS" ? "Meu Painel" : "Meu Perfil"}
                  </Link>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-xs sm:text-sm font-medium text-gray-700 hover:text-black dark:text-gray-200 dark:hover:text-cyan-700 dark:hover:text-primary transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full bg-cyan-700 text-white dark:bg-primary dark:text-black hover:bg-cyan-800 dark:hover:bg-cyan-400 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold transition-transform hover:scale-105"
                  >
                    Cadastrar
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="flex flex-col">
        {/* Dynamic Hero Section */}
        <section className="relative flex flex-col items-center justify-center overflow-hidden bg-black py-20 text-center dark:bg-black w-full transition-all duration-300">
          <div className="absolute top-1/2 left-1/2 -z-10 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[100px]" />

          <div className="container px-4 z-10">
            <Image
              src="/logo completa.png"
              alt="Brand Logo"
              width={240}
              height={80}
              className="mx-auto mb-8 object-contain"
              priority
            />
            <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              O que você quer <span className="text-cyan-700 dark:text-primary">agendar</span>{" "}
              hoje?
            </h1>

            <div
              ref={searchContainerRef}
              className={`mt-10 mx-auto w-full max-w-7xl transition-all duration-500 ease-in-out ${isSticky ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"} `}
            >
              {/* Search Input Large */}
              <form 
                onSubmit={handleAiSearch}
                className="relative w-full max-w-4xl mx-auto mb-8"
              >
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <Sparkles className={`h-6 w-6 text-primary ${isAiLoading ? 'animate-spin' : 'animate-pulse'}`} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ex: Preciso de um barbeiro em são paulo para amanhã às 11h..."
                  className="w-full rounded-2xl bg-white/5 border border-white/10 px-14 py-5 text-white placeholder-gray-500 focus:border-cyan-800/80 dark:focus:border-primary/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-800/80 dark:focus:ring-primary/50 transition-all shadow-2xl"
                />
                <button 
                  type="submit"
                  disabled={isAiLoading}
                  className="absolute right-3 top-3 bottom-3 rounded-xl bg-primary px-8 text-black font-bold hover:bg-cyan-400 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                >
                  {isAiLoading ? "Analisando..." : "Buscar"}
                  {!isAiLoading && <span className="text-lg leading-none">→</span>}
                </button>
              </form>

              {/* Status da Busca por IA - Mais visível e informativo */}
              {(isAiLoading || aiExtracted) && (
                <div className="flex flex-col items-center gap-4 mb-8 -mt-4 animate-in fade-in zoom-in duration-500">
                   {isAiLoading && (
                     <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-xl">
                        <div className="flex gap-1.5">
                           <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                           <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                           <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        </div>
                        <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">A IA está analisando sua intenção...</span>
                     </div>
                   )}

                   {aiExtracted && !isAiLoading && (
                     <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
                        <div className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg">
                           <Sparkles className="w-3 h-3" />
                           Busca Inteligente Ativa
                        </div>
                        {aiExtracted.service && (
                          <div className="px-3 py-2 bg-white/5 text-gray-200 border border-white/10 rounded-xl text-xs font-medium flex items-center gap-2">
                             <span className="text-[10px] text-gray-500 font-bold">O QUE:</span> {aiExtracted.service}
                          </div>
                        )}
                        {aiExtracted.location && (
                          <div className="px-3 py-2 bg-white/5 text-gray-200 border border-white/10 rounded-xl text-xs font-medium flex items-center gap-2">
                             <span className="text-[10px] text-gray-500 font-bold">ONDE:</span> {aiExtracted.location}
                          </div>
                        )}
                        {aiExtracted.date && (
                          <div className="px-3 py-2 bg-white/5 text-gray-200 border border-white/10 rounded-xl text-xs font-medium flex items-center gap-2">
                             <span className="text-[10px] text-gray-500 font-bold">QUANDO:</span> {new Date(aiExtracted.date + "T10:00:00").toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                          </div>
                        )}
                        {aiExtracted.time && (
                          <div className="px-3 py-2 bg-white/5 text-gray-200 border border-white/10 rounded-xl text-xs font-medium flex items-center gap-2">
                             <span className="text-[10px] text-gray-500 font-bold">HORA:</span> {aiExtracted.time}
                          </div>
                        )}
                     </div>
                   )}
                </div>
              )}

              {/* Categories Big Pills */}
              <div className="flex flex-row overflow-x-auto justify-start xl:justify-center items-start gap-4 w-full pt-2 pb-6 scrollbar-hide px-4 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
                {CATEGORIES.map((cat) => {
                  const isPetshop = cat.name === "Petshop";
                  return (
                  <div key={cat.name} className="relative flex flex-col items-center">
                    <button
                      disabled={isPetshop}
                      onClick={() => !isPetshop && setActiveCategory(cat.name)}
                      className={`flex-shrink-0 flex items-center gap-2.5 px-6 py-3 rounded-full border transition-all ${
                          isPetshop
                            ? "opacity-30 cursor-not-allowed bg-transparent border-white/10 text-gray-400"
                            : activeCategory === cat.name
                              ? "bg-cyan-800/10 border-cyan-800 dark:bg-primary/20 dark:border-primary text-white dark:text-primary shadow-[0_0_10px_rgba(0,255,255,0.2)]"
                              : "bg-transparent border-white/10 text-gray-300 hover:border-white/30 hover:bg-white/5 hover:text-cyan-700 dark:hover:text-white"
                        }`}
                    >
                      <cat.icon
                        className={`w-5 h-5 ${isPetshop ? "opacity-50" : activeCategory === cat.name ? "opacity-100" : "opacity-70 text-cyan-700 dark:text-primary"}`}
                      />
                      <span className="text-sm font-semibold tracking-wide">
                        {cat.name}
                      </span>
                    </button>
                    {isPetshop && (
                      <span className="absolute -bottom-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">
                        Em breve
                      </span>
                    )}
                  </div>
                )})}
              </div>
            </div>
          </div>
        </section>

        {/* The Sticky Search Bar (Only appears when scrolling past hero) */}
        <div
          className={`fixed top-16 left-0 right-0 z-30 w-full bg-[#050505] border-b border-white/10 shadow-2xl pt-3 pb-2 transform transition-all duration-300 ease-in-out ${isSticky
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0 pointer-events-none"
            } `}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-4 justify-between">
              {/* Magic AI Search Bar-Compact */}
              <div className="relative w-full lg:w-1/3 min-w-[320px]">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="O que você quer agendar hoje?"
                  className="w-full rounded-xl bg-white/5 px-10 py-2.5 text-white text-sm placeholder-gray-400 border border-white/10 focus:border-cyan-800/80 dark:focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-cyan-800/80 dark:focus:ring-primary/50 focus:bg-white/10 transition-all"
                />
              </div>

              {/* Pill Categories-Compact Scrollable */}
              <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-2/3 pt-1 pb-3 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
                {CATEGORIES.map((cat) => {
                  const isPetshop = cat.name === "Petshop";
                  return (
                  <div key={cat.name} className="relative flex flex-col items-center">
                    <button
                      disabled={isPetshop}
                      onClick={() => !isPetshop && setActiveCategory(cat.name)}
                      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                          isPetshop
                            ? "opacity-30 cursor-not-allowed bg-transparent border-white/10 text-gray-400"
                            : activeCategory === cat.name
                              ? "bg-cyan-800/10 border-cyan-800 dark:bg-primary/20 dark:border-primary text-white dark:text-primary"
                              : "bg-transparent border-white/10 text-gray-300 hover:bg-white/5 hover:text-cyan-700 dark:hover:text-white"
                        }`}
                    >
                      <cat.icon
                        className={`w-3.5 h-3.5 ${isPetshop ? "opacity-50" : activeCategory === cat.name ? "opacity-100" : "opacity-70 text-cyan-700 dark:text-primary"}`}
                      />
                      <span className="text-xs font-semibold tracking-wide">
                        {cat.name}
                      </span>
                    </button>
                    {isPetshop && (
                      <span className="absolute -bottom-2 text-[8px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">
                        Em breve
                      </span>
                    )}
                  </div>
                )})}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Companies Section */}
        <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {activeCategory === "Todos"
                ? "Empresas em Destaque"
                : `${activeCategory} em Destaque`}
            </h2>

            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
              {/* Layout Toggle Buttons */}
              <div className="flex items-center gap-1 bg-gray-200 dark:bg-gray-800 p-1 rounded-lg">
                <button
                  onClick={() => setLayoutMode("grid")}
                  className={`p-2 rounded-md transition-colors ${layoutMode === "grid" ? "bg-white dark:bg-black shadow-sm text-blue-700 dark:text-primary" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"} `}
                  title="Visualização em Grade"
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setLayoutMode("list")}
                  className={`p-2 rounded-md transition-colors ${layoutMode === "list" ? "bg-white dark:bg-black shadow-sm text-blue-700 dark:text-primary" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"} `}
                  title="Visualização em Lista"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              <span className="text-sm font-semibold text-gray-500 border border-gray-200 dark:border-gray-800 rounded-full px-3 py-1 bg-white dark:bg-gray-900">
                {isLoadingCompanies ? "Carregando..." : `${filteredCompanies.length} resultados`}
              </span>
            </div>
          </div>

          {/* Showcase Grid / List */}
            <div className="mt-8">
              {isSearchRelaxed && (
                <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
                   <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-800/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <Sparkles className="w-5 h-5" />
                   </div>
                   <div className="flex-1">
                      <p className="text-sm font-bold text-amber-900 dark:text-amber-100">Não encontramos exatamente o que você pediu...</p>
                      <p className="text-xs text-amber-700 dark:text-amber-400">Mas aqui estão algumas opções de {aiExtracted.service} que você pode gostar:</p>
                   </div>
                </div>
              )}

              {displayCompanies.length > 0 ? (
                <div
                  className={`grid gap-6 ${
                    layoutMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1"
                  }`}
                >
                  {displayCompanies.map((company, idx) => (
                    <div
                      key={company.id}
                      onClick={() => handleOpenCompany(company)}
                      className={`group flex rounded-2xl bg-white border border-gray-100 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 dark:bg-gray-900 dark:border-gray-800 overflow-hidden cursor-pointer ${
                        layoutMode === "grid" ? "flex-col" : "flex-row h-auto sm:h-[200px]"
                      } `}
                    >
                      {/* Image Header */}
                      <div
                        className={`${
                          layoutMode === "grid" ? "h-32 w-full" : "h-full w-[150px] sm:w-[250px] shrink-0"
                        } relative bg-gray-200 dark:bg-gray-800`}
                      >
                        <img
                          src={company.image}
                          alt="Banner"
                          className="w-full h-full object-cover"
                        />

                        {layoutMode === "grid" ? (
                          <div className="absolute -bottom-6 left-6 h-16 w-16 rounded-full border-4 border-white dark:border-gray-900 bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden transition-transform z-10 group-hover:scale-105">
                            <img
                              src={company.logo}
                              alt="Logo"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="absolute top-4 left-4 h-14 w-14 rounded-full border-2 border-white dark:border-gray-900 bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden transition-transform z-10">
                            <img
                              src={company.logo}
                              alt="Logo"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <div className="absolute top-4 right-4 rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white flex items-center gap-1 shadow-sm">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          {company.rating} ({company.reviews})
                        </div>
                      </div>

                      {/* Card Content */}
                      <div
                        className={`flex flex-col flex-1 p-6 ${
                          layoutMode === "grid" ? "pt-10" : "justify-center"
                        } `}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-primary transition-colors line-clamp-1">
                            {company.name}
                          </h3>
                        </div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                          {company.niche}
                        </p>

                        {layoutMode === "list" && (
                          <div className="mb-4 hidden sm:block">
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                              {company.description}
                            </p>
                          </div>
                        )}

                        <div className="flex mt-auto pt-2">
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <MapPin className="w-4 h-4 shrink-0" />
                            <span className="line-clamp-1">{company.address}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-16 text-center dark:border-gray-800 dark:bg-gray-900/50">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Nenhum resultado encontrado
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Tente ajustar sua busca ou selecionar outra categoria.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("Todos");
                  setSearchQuery("");
                }}
                className="mt-6 inline-flex items-center rounded-full bg-cyan-700 text-white dark:bg-primary dark:text-black hover:bg-cyan-800 dark:hover:bg-cyan-400 px-6 py-3 text-sm font-bold transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      </section>

        {/* ============================================= */}
        {/* COMO FUNCIONA — 3 passos */}
        {/* ============================================= */}
        <section className="relative w-full bg-gray-100 dark:bg-[#0a0a0a] py-16 sm:py-20 overflow-hidden border-t border-gray-200 dark:border-gray-800">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Como Funciona
              </h2>
              <p className="mt-3 text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
                Agendar seus serviços favoritos é simples e rápido
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Passo 1 */}
              <div className="group relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0d1117] p-8 text-center transition-all hover:border-cyan-800/80 dark:hover:border-primary/50 hover:shadow-[0_0_30px_rgba(0,255,255,0.06)]">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Search className="h-7 w-7 text-cyan-700 dark:text-primary" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-primary mb-2 block">Passo 01</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Encontre</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Busque profissionais e empresas na sua região por categoria ou nome.
                </p>
              </div>

              {/* Passo 2 */}
              <div className="group relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0d1117] p-8 text-center transition-all hover:border-cyan-800/80 dark:hover:border-primary/50 hover:shadow-[0_0_30px_rgba(0,255,255,0.06)]">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <CalendarDays className="h-7 w-7 text-cyan-700 dark:text-primary" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-primary mb-2 block">Passo 02</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Escolha</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Compare avaliações, preços e horários disponíveis em tempo real.
                </p>
              </div>

              {/* Passo 3 */}
              <div className="group relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0d1117] p-8 text-center transition-all hover:border-cyan-800/80 dark:hover:border-primary/50 hover:shadow-[0_0_30px_rgba(0,255,255,0.06)]">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <CheckCircle2 className="h-7 w-7 text-cyan-700 dark:text-primary" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-primary mb-2 block">Passo 03</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Agende</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Confirme seu horário com um clique. Receba lembretes automáticos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* CTA PARA EMPRESÁRIOS — Showcase do Dashboard */}
        {/* ============================================= */}
        <section className="relative w-full bg-gray-50 dark:bg-[#0a0a0a] py-20 sm:py-28 overflow-hidden">
          <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[150px]" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Texto */}
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-cyan-700 dark:text-primary text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                  <Building2 className="w-4 h-4" />
                  Para Empresários
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight mb-6">
                  Você é empresário?{" "}
                  <span className="text-cyan-700 dark:text-primary">Chegou no local certo.</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed mb-8">
                  Precisa de um sistema com <strong className="text-gray-900 dark:text-white">Dashboard completo</strong>, controle de funcionários, de estoque, de finanças? Faça seu cadastro gratuito e faça parte da nossa comunidade de prestadores de serviço.
                </p>

                <div className="space-y-4 mb-10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <BarChart3 className="h-4 w-4 text-cyan-700 dark:text-primary" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Dashboard com métricas em tempo real e relatórios completos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <Users className="h-4 w-4 text-cyan-700 dark:text-primary" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Gestão de profissionais, clientes e agenda integrada</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <Package className="h-4 w-4 text-cyan-700 dark:text-primary" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Controle de estoque com alertas de reposição automáticos</span>
                  </div>
                </div>

                <Link href="/register">
                  <button className="bg-cyan-700 text-white dark:bg-primary dark:text-black font-bold py-4 px-8 rounded-xl shadow-[0_4px_20px_rgba(6,182,212,0.15)] dark:shadow-[0_4px_20px_rgba(0,255,255,0.25)] hover:bg-cyan-800 dark:hover:bg-cyan-400 transition-all text-base flex items-center gap-2 group">
                    Cadastrar minha Empresa
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <p className="mt-3 text-xs text-gray-400">100% gratuito • Sem cartão de crédito • Cadastro em 2 minutos</p>
              </div>

              {/* Dashboard Showcase — Carousel de imagens */}
              <div className="relative">
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0a0a0a] p-1.5 sm:p-3 shadow-2xl overflow-hidden group/showcase">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-white dark:bg-[#050505] flex items-center justify-center">
                    <Image
                      src={
                        (!mounted || (resolvedTheme === 'dark'))
                          ? ['/showcase-dashboard-dark-v28.png', '/showcase-agenda-dark-v28.png', '/showcase-estoque-dark-v28.png'][showcaseIndex]
                          : ['/showcase-dashboard-light-v28.png', '/showcase-agenda-light-v28.png', '/showcase-estoque-light-v28.png'][showcaseIndex]
                      }
                      alt={['Dashboard Principal', 'Calendário de Agendamentos', 'Controle de Estoque'][showcaseIndex]}
                      fill
                      className="object-contain object-center transition-all duration-700"
                      sizes="(max-width: 1280px) 100vw, 80vw"
                      priority={showcaseIndex === 0}
                    />
                  </div>
                </div>
                {/* Image navigation dots + arrows */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <button onClick={() => setShowcaseIndex((showcaseIndex + 2) % 3)} className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                    <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <div className="flex items-center gap-2">
                    {['Dashboard', 'Agenda', 'Estoque'].map((label, i) => (
                      <button
                        key={i}
                        onClick={() => setShowcaseIndex(i)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                          showcaseIndex === i ? 'bg-cyan-500/10 text-cyan-700 dark:bg-primary/20 dark:text-primary' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setShowcaseIndex((showcaseIndex + 1) % 3)} className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                    <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
                {/* Floating badge */}
                <div className="absolute -top-3 -right-3 bg-cyan-500/10 text-cyan-700 dark:bg-primary/20 dark:text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-cyan-600/30 dark:border-primary/30 shadow-md">
                  Grátis
                </div>
              </div>
            </div>

            {/* Para quem busca serviço */}
            <div className="mt-20 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Se você é <strong className="text-gray-900 dark:text-white">empresário</strong> ou alguém que esteja{" "}
                <strong className="text-gray-900 dark:text-white">procurando um serviço</strong>,{" "}
                <span className="text-cyan-700 dark:text-primary font-bold">chegou no local certo.</span>
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Company Details Modal (Interactive Scheduling Flow) */}
      {selectedCompany && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-[#0a0a0b] rounded-3xl overflow-hidden shadow-2xl scale-100 transition-transform flex flex-col max-h-[90vh] border border-gray-200 dark:border-[#222]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Scrollable entire modal */}
            <div className="relative flex-1 overflow-y-auto pb-6 w-full custom-scrollbar">
              {/* Fake Interactive Loading Bar at Top */}
              <div
                className="absolute top-0 left-0 h-1 bg-primary z-50 transition-all duration-500"
                style={{
                  width: selectedTime
                    ? "100%"
                    : selectedDate
                      ? "80%"
                      : selectedProfessional
                        ? "50%"
                        : selectedServiceId
                          ? "20%"
                          : "0%",
                }}
              ></div>

              {/* Modal Header/Banner */}
              <div className="h-40 sm:h-48 w-full relative bg-gray-800">
                <img
                  src={selectedCompany.image}
                  alt="Banner"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a0a0b] to-transparent"></div>
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors z-20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 relative -mt-16">
                <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 mb-6">
                  {/* Profile Icon overlapping banner */}
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border-4 border-white dark:border-[#0a0a0b] bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative z-20 shadow-md overflow-hidden">
                      <img
                        src={selectedCompany.logo}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-4">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {selectedCompany.name}
                      </h2>
                      <div className="flex items-center gap-3">
                        <p className="text-cyan-800 dark:text-primary font-medium text-sm">
                          {selectedCompany.niche}
                        </p>
                        <div className="flex items-center gap-1 text-sm bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="font-bold">
                            {selectedCompany.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
                  {selectedCompany.description}
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#1a1a1c] border border-gray-100 dark:border-[#2a2a2c] px-3 py-1.5 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-cyan-800 dark:text-primary" />
                    {selectedCompany.address}
                  </div>
                </div>

                {/* --- SCHEDULING FLOW --- */}

                {/* 1. Services */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  1. Escolha um Serviço
                </h3>
                <div className="space-y-3 mb-8">
                  {selectedCompany.services.map((service: any, idx: number) => {
                    const isSelected = selectedServiceId === service.id;
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedServiceId(service.id);
                          setSelectedCompanyId(service.companyId);
                          setSelectedServiceName(service.name);
                        }}
                        className={`group flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${isSelected ? "border-cyan-800 dark:border-primary bg-cyan-800/10 dark:bg-primary/5" : "border-gray-100 dark:border-[#2a2a2c] bg-gray-50 dark:bg-[#151516] hover:border-gray-300 dark:hover:border-[#3a3a3c]"} `}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? "border-cyan-800 dark:border-primary" : "border-gray-300 dark:border-gray-600"} `}
                          >
                            {isSelected && (
                              <div className="w-2.5 h-2.5 bg-cyan-800 dark:bg-primary rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <h4
                              className={`font-semibold text-sm transition-colors ${isSelected ? "text-cyan-800 dark:text-primary" : "text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white"} `}
                            >
                              {service.name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {service.duration}
                            </p>
                          </div>
                        </div>
                        <p
                          className={`font-bold text-sm ${isSelected ? "text-cyan-800 dark:text-primary" : "text-gray-700 dark:text-gray-300"} `}
                        >
                          {service.price}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* 2. Professional Selection-Only show if Service is selected */}
                <div
                  className={`transition-all duration-500 ease -in -out ${selectedServiceId ? "opacity-100 max-h-[500px]" : "opacity-50 max-h-40 overflow-hidden pointer-events-none"} `}
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    2. Profissional
                  </h3>
                  <div className="flex items-center gap-4 overflow-x-auto pb-4 mb-6 scrollbar-hide py-3 px-2">
                    {selectedCompany.staff?.map((person: any) => {
                      const isSelected = selectedProfessional === person.id;
                      return (
                        <div
                          key={person.id}
                          onClick={() => {
                            setSelectedProfessional(person.id);
                            setSelectedTime(null);
                          }}
                          className={`flex flex-col items-center gap-2 cursor-pointer group shrink-0 transition-opacity ${!isSelected && selectedProfessional ? "opacity-60 hover:opacity-100" : "opacity-100"} `}
                        >
                          <div
                            className={`h-16 w-16 rounded-full overflow-hidden transition-all ${isSelected ? "ring-2 ring-offset-4 ring-cyan-800 dark:ring-primary ring-offset-white dark:ring-offset-[#0a0a0b] shadow-[0_0_15px_rgba(0,255,255,0.2)]" : "border-2 border-transparent group-hover:border-gray-500"} `}
                          >
                            <img
                              src={person.image}
                              alt={person.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span
                            className={`text-xs font-medium transition-colors ${isSelected ? "text-cyan-800 dark:text-primary font-bold" : "text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200"} `}
                          >
                            {person.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Date Selection-Only show if Professional is selected */}
                <div
                  className={`transition-all duration-500 ease-in-out ${selectedProfessional ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0 overflow-hidden pointer-events-none"} `}
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
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
                    {upcomingDays.map((ds, idx) => {
                      const isSelected = selectedDate === ds.fullDateStr;
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setSelectedDate(ds.fullDateStr);
                            setSelectedTime(null);
                          }}
                          className={`flex flex-col items-center justify-center shrink-0 w-[72px] h-[84px] rounded-2xl border transition-all cursor-pointer ${isSelected
                              ? "border-cyan-800 bg-cyan-800 text-white dark:border-primary dark:bg-primary dark:text-black shadow-[0_0_15px_rgba(0,255,255,0.4)]"
                              : "border-gray-100 dark:border-[#2a2a2c] bg-gray-50 dark:bg-[#151516] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1e1f22]"
                            } `}
                        >
                          <span className="text-[11px] font-bold uppercase tracking-wider mb-1">
                            {ds.dayName}
                          </span>
                          <span
                            className={`text-2xl font-extrabold leading-none mb-1 ${isSelected ? "text-white dark:text-black" : "text-gray-900 dark:text-white"} `}
                          >
                            {ds.dayNumber}
                          </span>
                          <span className="text-[10px] font-medium uppercase">
                            {ds.monthName}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                    {/* Botão Direita */}
                    <button 
                      onClick={() => scrollDays('right')}
                      className="hidden md:flex absolute -right-2 top-[30px] z-10 bg-white/95 dark:bg-[#151516]/95 backdrop-blur-sm border border-gray-200 dark:border-gray-800 p-1.5 rounded-full shadow-md text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1a1c] hover:scale-105 transition-all opacity-0 group-hover/scroll:opacity-100"
                      aria-label="Rolar para direita"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 4. Time Slots-Only show if Date is selected */}
                <div
                  className={`transition-all duration-500 ease-in-out ${selectedDate ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0 overflow-hidden pointer-events-none"} `}
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    4. Horários Livres
                  </h3>

                  {activeProfessionalData && (
                    <div className="flex flex-wrap gap-3 mb-8">
                      {currentBlock ? (
                        <p className="text-sm text-red-500 font-bold bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-200 dark:border-red-500/20 flex flex-col sm:flex-row sm:items-center items-start gap-2 w-full shadow-sm">
                          <CalendarOff className="w-5 h-5 shrink-0" />
                          {currentBlock.prof === "all"
                            ? `O estabelecimento está fechado neste dia pelo motivo: ${currentBlock.situation}. Nenhum horário disponível.`
                            : `Este profissional não tem horários disponíveis neste dia. Por favor, selecione outro dia ou outro profissional.`}
                        </p>
                      ) : isWeekendBlock ? (
                        <p className="text-sm text-amber-500 font-bold bg-amber-50 dark:bg-amber-500/10 p-3 rounded-lg border border-amber-200 dark:border-amber-500/20 flex items-center gap-2 w-full shadow-sm">
                          <CalendarOff className="w-5 h-5 shrink-0" />
                          Este profissional não tem horários disponíveis neste dia. Por favor, selecione outro dia ou outro profissional.
                        </p>
                      ) : (
                        (() => {
                          const slots = generateTimeSlots(
                            activeProfessionalData?.hours,
                            selectedDate,
                            selectedProfessional,
                            selectedCompany?.blocks || [],
                            selectedCompany?.appointments || [] // <--- PASSAR OS AGENDAMENTOS
                          );
                          if (slots.length > 0) {
                            return (
                              <div className="flex flex-wrap gap-2">
                                {slots.map((time) => (
                                  <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                                      selectedTime === time
                                        ? "border-cyan-800 bg-cyan-800 text-white dark:border-primary dark:bg-primary dark:text-black"
                                        : "bg-gray-50 dark:bg-black border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-cyan-800 hover:text-cyan-800 hover:bg-cyan-50/50 dark:hover:bg-primary/10 dark:hover:border-primary dark:hover:text-primary"
                                    }`}
                                  >
                                    {time}
                                  </button>
                                ))}
                              </div>
                            );
                          }
                          return (
                            <p className="text-sm text-gray-500 italic">
                              Nenhum horário selecionável para este dia.
                            </p>
                          );
                        })()
                      )}
                    </div>
                  )}
                </div>

                {/* 5. Client Note / Dúvidas */}
                <div
                  className={`transition-all duration-500 ease-in-out ${selectedTime ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0 overflow-hidden pointer-events-none"} `}
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    5. Alguma dúvida ou observação?
                  </h3>
                  <div className="mb-8">
                    <textarea
                      value={clientNote}
                      onChange={(e) => setClientNote(e.target.value)}
                      placeholder="Ex: Preciso que tirem apenas as pontas, tenho alergia a tal produto..."
                      className="w-full bg-gray-50 dark:bg-[#151516] border border-gray-100 dark:border-[#2a2a2c] rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-cyan-800/80 dark:focus:border-primary/50 focus:ring-1 focus:ring-cyan-800/80 dark:focus:ring-primary/50 transition-all resize-none h-24"
                    />
                  </div>
                </div>

                 {/* Checkout Button */}
                <div
                  className={`sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white dark:from-[#0a0a0b] dark:via-[#0a0a0b] to-transparent transition-all duration-500 ${selectedTime ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"} `}
                >
                  <button 
                    onClick={handleConfirmBooking}
                    disabled={isBooking}
                    className="w-full bg-cyan-700 text-white dark:bg-primary dark:text-black font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.2)] dark:shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:bg-cyan-800 dark:hover:bg-cyan-400 transition-colors text-lg flex items-center justify-center gap-2"
                  >
                    {isBooking ? (
                      "Processando..."
                    ) : (
                      <>
                        Confirmar Agendamento{" "}
                        <span className="opacity-70 text-sm font-normal">
                          ({selectedTime})
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Success Overlay */}
              {showSuccess && (
                <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-white/90 dark:bg-black/90 backdrop-blur-md animate-in fade-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-cyan-500/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-6 border border-cyan-600/30 dark:border-primary/50">
                    <CheckCircle2 className="w-10 h-10 text-cyan-600 dark:text-primary animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Agendado com Sucesso!</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center px-8">Seu horário para {selectedServiceName} foi reservado. Você pode acompanhá-lo no seu perfil.</p>
                  <button 
                    onClick={() => {
                      setShowSuccess(false);
                      closeModal();
                      window.location.href = "/cliente";
                    }}
                    className="mt-8 text-cyan-600 dark:text-primary font-bold hover:underline"
                  >
                    Ver meu perfil
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer System */}
      <Footer />
    </div>
  );
}
