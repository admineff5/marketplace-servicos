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
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ThemeToggle } from "./components/ThemeToggle";
import { Footer } from "./components/Footer";

const CATEGORIES = [
  { name: "Todos", icon: Grid },
  { name: "Barbearia", icon: Scissors },
  { name: "Petshop", icon: Dog },
  { name: "Clínica", icon: Stethoscope },
  { name: "Estética", icon: Sparkles },
];

const MOCK_COMPANIES = [
  {
    id: 1,
    name: "Barbearia do João",
    niche: "Barbearia",
    rating: "5.0",
    reviews: 24,
    address: "Centro, São Paulo",
    icon: Scissors,
    image:
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800",
    logo: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=150",
    description:
      "Cortes modernos, barba na toalha quente e o ambiente mais descontraído do centro. Agende agora o seu horário com nossos mestres.",
    services: [
      { name: "Corte Degradê", price: "R$ 45,00", duration: "40 min" },
      { name: "Barba Terapia", price: "R$ 35,00", duration: "30 min" },
      { name: "Corte + Barba", price: "R$ 70,00", duration: "1h 10m" },
    ],
    staff: [
      {
        id: "s1",
        name: "João Silva",
        image:
          "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=60",
      },
      {
        id: "s2",
        name: "Marcio",
        image:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60",
      },
    ],
  },
  {
    id: 2,
    name: "Petshop Cão Feliz",
    niche: "Petshop",
    rating: "4.8",
    reviews: 89,
    address: "Jardins, São Paulo",
    icon: Dog,
    image:
      "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800",
    logo: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=150",
    description:
      "O maior cuidado e carinho para o seu melhor amigo. Banho, tosa, hidratação e consultório veterinário.",
    services: [
      { name: "Banho Premium", price: "R$ 60,00", duration: "1h" },
      { name: "Tosa na Tesoura", price: "R$ 80,00", duration: "1h 30m" },
      { name: "Consulta Vet", price: "R$ 150,00", duration: "45 min" },
    ],
    staff: [
      {
        id: "s3",
        name: "Dra. Ana",
        image:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60",
      },
      {
        id: "s4",
        name: "Carlos",
        image:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60",
      },
    ],
  },
  {
    id: 3,
    name: "Estética Bela Pele",
    niche: "Estética",
    rating: "4.9",
    reviews: 156,
    address: "Pinheiros, São Paulo",
    icon: Sparkles,
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800",
    logo: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=150",
    description:
      "Tratamentos faciais e corporais com tecnologia de ponta e profissionais altamente qualificados.",
    services: [
      { name: "Limpeza de Pele", price: "R$ 120,00", duration: "1h 30m" },
      { name: "Massagem Relaxante", price: "R$ 90,00", duration: "1h" },
    ],
  },
  {
    id: 4,
    name: "Clínica Vida Saudável",
    niche: "Clínica",
    rating: "5.0",
    reviews: 42,
    address: "Vila Mariana, São Paulo",
    icon: Stethoscope,
    image:
      "https://images.unsplash.com/photo-1538108149393-ce90eddc5db7?auto=format&fit=crop&q=80&w=800",
    logo: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=150",
    description:
      "Atendimento médico humanizado com especialistas em diversas áreas. Sua saúde em primeiro lugar.",
    services: [
      { name: "Consulta Clínica", price: "R$ 250,00", duration: "45 min" },
      { name: "Exame de Rotina", price: "R$ 180,00", duration: "30 min" },
    ],
  },
  {
    id: 6,
    name: "Petshop Patinhas",
    niche: "Petshop",
    rating: "4.6",
    reviews: 55,
    address: "Lapa, São Paulo",
    icon: Dog,
    image:
      "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&q=80&w=800",
    logo: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=150",
    description:
      "Tudo que o seu gatinho ou cachorro precisa. Temos serviço de táxi dog gratuito na região.",
    services: [
      { name: "Banho Simples", price: "R$ 45,00", duration: "1h" },
      { name: "Tosa Higiênica", price: "R$ 35,00", duration: "30 min" },
    ],
  },
  {
    id: 7,
    name: "Barbearia Vintage",
    niche: "Barbearia",
    rating: "4.9",
    reviews: 312,
    address: "Vila Madalena, São Paulo",
    icon: Scissors,
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800",
    logo: "https://images.unsplash.com/photo-1520286161962-d6fc7b8f9e2b?auto=format&fit=crop&q=80&w=150",
    description:
      "A clássica barbearia dos anos 50 no coração da Vila Madalena. Cerveja gelada e sinuca enquanto você espera.",
    services: [
      { name: "Corte Clássico", price: "R$ 60,00", duration: "45 min" },
      { name: "Barba Tradicional", price: "R$ 50,00", duration: "40 min" },
    ],
  },
  {
    id: 8,
    name: "Spa Zen",
    niche: "Estética",
    rating: "5.0",
    reviews: 18,
    address: "Itaim Bibi, São Paulo",
    icon: Sparkles,
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
    logo: "https://images.unsplash.com/photo-1507652313519-d4e9174096ed?auto=format&fit=crop&q=80&w=150",
    description:
      "Um oásis de tranquilidade no meio da cidade. Massagens shiatsu, pedras quentes e aromaterapia.",
    services: [
      { name: "Massagem Pedras", price: "R$ 180,00", duration: "1h 20m" },
      { name: "Day Spa Completo", price: "R$ 350,00", duration: "3h" },
    ],
    staff: [
      {
        id: "s5",
        name: "Mariana",
        image:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60",
      },
    ],
  },
];

// Fallback staff / availability dynamic generation based on professional
const enhancedMockCompanies = MOCK_COMPANIES.map((company) => ({
  ...company,
  staff: company.staff
    ? company.staff.map((s, i) => ({
      ...s,
      availability:
        i % 2 === 0
          ? ["08:00", "09:30", "13:00", "14:30", "16:00"]
          : ["10:00", "11:00", "15:00", "17:30", "18:15"],
    }))
    : [
      {
        id: "f1",
        name: "Profissional 1",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60",
        availability: ["08:00", "10:00", "14:00"],
      },
      {
        id: "f2",
        name: "Profissional 2",
        image:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=60",
        availability: ["09:00", "11:00", "15:00", "16:30"],
      },
    ],
}));

export default function Home() {
  const [selectedCompany, setSelectedCompany] = useState<
    (typeof enhancedMockCompanies)[0] | null
  >(null);

  // Scheduling State within Modal
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<
    string | null
  >(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientNote, setClientNote] = useState<string>("");

  // App State
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");

  // References for sticky scroll logic
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Filter Logic
  const filteredCompanies = enhancedMockCompanies.filter((company) => {
    const matchesCategory =
      activeCategory === "Todos" || company.niche === activeCategory;
    const matchesSearch =
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.niche.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  const handleOpenCompany = (company: (typeof enhancedMockCompanies)[0]) => {
    setSelectedCompany(company);
    setSelectedService(null);
    setSelectedProfessional(
      company.staff && company.staff.length > 0 ? company.staff[0].id : null,
    );
    setSelectedDate(null);
    setSelectedTime(null);
    setClientNote("");
  };

  const closeModal = () => setSelectedCompany(null);

  const activeProfessionalData = selectedCompany?.staff?.find(
    (p) => p.id === selectedProfessional,
  );

  // Generate 14 next days for mock selection
  const upcomingDays = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      dateObj: d,
      dayNumber: d.getDate(),
      dayName: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][d.getDay()],
      monthName: [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ][d.getMonth()],
      fullDateStr: d.toISOString().split("T")[0],
    };
  });

  // MOCK DE BLOQUEIOS DA LOJA/PROFISSIONAL
  const MOCK_ACTIVE_BLOCKS = [
    {
      dateStr: upcomingDays[1]?.fullDateStr,
      prof: "Rodrigo",
      situation: "Atestado Médico / Licença",
    },
    {
      dateStr: upcomingDays[5]?.fullDateStr,
      prof: "all",
      situation: "Feriado Nacional",
    },
  ];

  const currentBlock = MOCK_ACTIVE_BLOCKS.find(
    (b) =>
      b.dateStr === selectedDate &&
      (b.prof === "all" || b.prof === activeProfessionalData?.name),
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      {/* Navbar Minimalist */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md dark:bg-black/80 transition-all border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Image
              src="/logo icon.png"
              alt="Logo Icon"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              AgendeJá
            </span>
          </div>

          <nav className="flex items-center gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-2 sm:gap-4 border-l border-gray-200 dark:border-gray-800 pl-3 sm:pl-4 ml-1 sm:ml-2">
              <Link
                href="/login"
                className="text-xs sm:text-sm font-medium text-gray-700 hover:text-black dark:text-gray-200 dark:hover:text-cyan-700 dark:hover:text-primary transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-primary px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-black transition-transform hover:scale-105"
              >
                Cadastrar
              </Link>
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
              className={`mt-10 mx-auto w-full max-w-7xl transition-all duration-500 ease -in -out ${isSticky ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"} `}
            >
              {/* Search Input Large */}
              <div className="relative w-full max-w-4xl mx-auto mb-8">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <Sparkles className="h-6 w-6 text-cyan-700 dark:text-primary animate-pulse" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ex: Preciso de um corte degradê perto de mim hoje à tarde..."
                  className="w-full rounded-2xl bg-white/5 border border-white/10 px-14 py-5 text-white placeholder-gray-500 focus:border-primary/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all shadow-2xl"
                />
                <button className="absolute right-3 top-3 bottom-3 rounded-xl bg-primary px-8 text-black font-bold hover:bg-cyan-400 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                  Buscar
                  <span className="text-lg leading-none">→</span>
                </button>
              </div>

              {/* Categories Big Pills */}
              <div className="flex flex-row overflow-x-auto justify-start xl:justify-center items-center gap-4 w-full py-2 scrollbar-hide px-4 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`flex-shrink-0 flex items-center gap-2.5 px-6 py-3 rounded-full border transition-all ${activeCategory === cat.name
                        ? "bg-primary/20 border-primary text-cyan-700 dark:text-primary shadow-[0_0_10px_rgba(0,255,255,0.2)]"
                        : "bg-transparent border-white/10 text-gray-300 hover:border-white/30 hover:bg-white/5 hover:text-white"
                      } `}
                  >
                    <cat.icon
                      className={`w-5 h-5 ${activeCategory === cat.name ? "opacity-100" : "opacity-70 text-cyan-700 dark:text-primary"} `}
                    />
                    <span className="text-sm font-semibold tracking-wide">
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* The Sticky Search Bar (Only appears when scrolling past hero) */}
        <div
          className={`fixed top-16 left-0 right-0 z-30 w-full bg-[#050505] border-b border-white / 10 shadow-2xl py-3 transform transition-all duration-300 ease -in -out ${isSticky
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0 pointer-events-none"
            } `}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-4 justify-between">
              {/* Magic AI Search Bar-Compact */}
              <div className="relative w-full lg:w-1/3 min-w-[320px]">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Sparkles className="h-4 w-4 text-cyan-700 dark:text-primary animate-pulse" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="O que você quer agendar hoje?"
                  className="w-full rounded-xl bg-white/5 px-10 py-2.5 text-white text-sm placeholder-gray-400 border border-white/10 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:bg-white/10 transition-all"
                />
              </div>

              {/* Pill Categories-Compact Scrollable */}
              <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-2/3 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${activeCategory === cat.name
                        ? "bg-primary/20 border-primary text-cyan-700 dark:text-primary"
                        : "bg-transparent border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
                      } `}
                  >
                    <cat.icon
                      className={`w-3.5 h-3.5 ${activeCategory === cat.name ? "opacity-100" : "opacity-70 text-cyan-700 dark:text-primary"} `}
                    />
                    <span className="text-xs font-semibold tracking-wide">
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Companies Section */}
        <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 min-h-screen">
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
                  className={`p-2 rounded-md transition-colors ${layoutMode === "grid" ? "bg-white dark:bg-black shadow-sm text-cyan-700 dark:text-primary" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"} `}
                  title="Visualização em Grade"
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setLayoutMode("list")}
                  className={`p-2 rounded-md transition-colors ${layoutMode === "list" ? "bg-white dark:bg-black shadow-sm text-cyan-700 dark:text-primary" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"} `}
                  title="Visualização em Lista"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              <span className="text-sm font-semibold text-gray-500 border border-gray-200 dark:border-gray-800 rounded-full px-3 py-1 bg-white dark:bg-gray-900">
                {filteredCompanies.length} resultados
              </span>
            </div>
          </div>

          {filteredCompanies.length > 0 ? (
            <div
              className={
                layoutMode === "grid"
                  ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "flex flex-col gap-6"
              }
            >
              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  onClick={() => handleOpenCompany(company)}
                  className={`group flex rounded-2xl bg-white border border-gray-100 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 dark:bg-gray-900 dark:border-gray-800 overflow-hidden cursor-pointer ${layoutMode === "grid" ? "flex-col" : "flex-row h-[200px]"
                    } `}
                >
                  {/* Image Header */}
                  <div
                    className={`${layoutMode === "grid" ? "h-32 w-full" : "h-full w-[250px] shrink-0"} relative bg-gray-200 dark:bg-gray-800`}
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
                    className={`flex flex-col flex-1 p-6 ${layoutMode === "grid" ? "pt-10" : ""} `}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-cyan-700 dark:hover:text-primary transition-colors line-clamp-1">
                        {company.name}
                      </h3>
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                      {company.niche}
                    </p>

                    {layoutMode === "list" && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {company.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {company.services.slice(0, 3).map((s, idx) => (
                            <span
                              key={idx}
                              className="text-xs font-semibold bg-gray-100 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-700/50"
                            >
                              {s.name}
                            </span>
                          ))}
                        </div>
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
                className="mt-6 inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-black hover:bg-cyan-400 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Company Details Modal (Interactive Scheduling Flow) */}
      {selectedCompany && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-2xl bg-[#0a0a0b] dark:bg-[#111] rounded-3xl overflow-hidden shadow-2xl scale-100 transition-transform flex flex-col max-h-[90vh] border border-[#222]"
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
                        : selectedService
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] dark:from-[#111] to-transparent"></div>
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
                    <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border-4 border-[#0a0a0b] dark:border-[#111] bg-gray-800 flex items-center justify-center relative z-20 shadow-md overflow-hidden">
                      <img
                        src={selectedCompany.logo}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-4">
                      <h2 className="text-2xl font-bold text-white mb-1">
                        {selectedCompany.name}
                      </h2>
                      <div className="flex items-center gap-3">
                        <p className="text-cyan-700 dark:text-primary font-medium text-sm">
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

                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {selectedCompany.description}
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-300 bg-[#1a1a1c] border border-[#2a2a2c] px-3 py-1.5 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-cyan-700 dark:text-primary" />
                    {selectedCompany.address}
                  </div>
                </div>

                {/* --- SCHEDULING FLOW --- */}

                {/* 1. Services */}
                <h3 className="text-lg font-bold text-white mb-3">
                  1. Escolha um Serviço
                </h3>
                <div className="space-y-3 mb-8">
                  {selectedCompany.services.map((service, idx) => {
                    const isSelected = selectedService === service.name;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedService(service.name)}
                        className={`group flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${isSelected ? "border-primary bg-primary/5" : "border-[#2a2a2c] bg-[#151516] hover:border-[#3a3a3c]"} `}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? "border-primary" : "border-gray-600"} `}
                          >
                            {isSelected && (
                              <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <h4
                              className={`font-semibold text-sm transition-colors ${isSelected ? "text-cyan-700 dark:text-primary" : "text-gray-200 group-hover:text-white"} `}
                            >
                              {service.name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {service.duration}
                            </p>
                          </div>
                        </div>
                        <p
                          className={`font-bold text-sm ${isSelected ? "text-cyan-700 dark:text-primary" : "text-gray-300"} `}
                        >
                          {service.price}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* 2. Professional Selection-Only show if Service is selected */}
                <div
                  className={`transition-all duration-500 ease -in -out ${selectedService ? "opacity-100 max-h-[500px]" : "opacity-50 max-h-40 overflow-hidden pointer-events-none"} `}
                >
                  <h3 className="text-lg font-bold text-white mb-3">
                    2. Profissional
                  </h3>
                  <div className="flex items-center gap-4 overflow-x-auto pb-4 mb-6 scrollbar-hide py-3 px-2">
                    {selectedCompany.staff?.map((person) => {
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
                            className={`h-16 w-16 rounded-full overflow-hidden transition-all ${isSelected ? "ring-2 ring-offset-4 ring-primary ring-offset-[#111] shadow-[0_0_15px_rgba(0,255,255,0.3)]" : "border-2 border-transparent group-hover:border-gray-500"} `}
                          >
                            <img
                              src={person.image}
                              alt={person.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span
                            className={`text-xs font-medium transition-colors ${isSelected ? "text-cyan-700 dark:text-primary font-bold" : "text-gray-400 group-hover:text-gray-200"} `}
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
                  className={`transition-all duration-500 ease -in -out ${selectedProfessional ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0 overflow-hidden pointer-events-none"} `}
                >
                  <h3 className="text-lg font-bold text-white mb-3">
                    3. Escolha o Dia
                  </h3>
                  <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide py-1 px-1">
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
                              ? "border-primary bg-primary text-black shadow-[0_0_15px_rgba(0,255,255,0.4)]"
                              : "border-[#2a2a2c] bg-[#151516] text-gray-400 hover:border-gray-500 hover:text-white hover:bg-[#1e1f22]"
                            } `}
                        >
                          <span className="text-[11px] font-bold uppercase tracking-wider mb-1">
                            {ds.dayName}
                          </span>
                          <span
                            className={`text-2xl font-extrabold leading-none mb-1 ${isSelected ? "text-black" : "text-white"} `}
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
                </div>

                {/* 4. Time Slots-Only show if Date is selected */}
                <div
                  className={`transition-all duration-500 ease -in -out ${selectedDate ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0 overflow-hidden pointer-events-none"} `}
                >
                  <h3 className="text-lg font-bold text-white mb-3">
                    4. Horários Livres
                  </h3>

                  {activeProfessionalData && (
                    <div className="flex flex-wrap gap-3 mb-8">
                      {currentBlock ? (
                        <p className="text-sm text-red-500 font-bold bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-200 dark:border-red-500/20 flex flex-col sm:flex-row sm:items-center items-start gap-2 w-full shadow-sm">
                          <CalendarOff className="w-5 h-5 shrink-0" />
                          {currentBlock.prof === "all"
                            ? `O estabelecimento está fechado neste dia pelo motivo: ${currentBlock.situation}. Nenhum horário disponível.`
                            : `O profissional ${activeProfessionalData.name} não realizará atendimentos neste dia(${currentBlock.situation}).`}
                        </p>
                      ) : activeProfessionalData.availability?.length > 0 ? (
                        activeProfessionalData.availability.map((time, idx) => {
                          const isSelected = selectedTime === time;
                          return (
                            <button
                              key={idx}
                              onClick={() => setSelectedTime(time)}
                              className={`px-5 py-2.5 text-sm font-bold rounded-lg border transition-all ${isSelected ? "border-primary bg-primary text-black shadow-[0_0_15px_rgba(0,255,255,0.4)]" : "border-[#2a2a2c] bg-[#151516] text-gray-300 hover:border-gray-500 hover:text-white"} `}
                            >
                              {time}
                            </button>
                          );
                        })
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          Nenhum horário selecionável para este dia.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* 5. Client Note / Dúvidas */}
                <div
                  className={`transition-all duration-500 ease -in -out ${selectedTime ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0 overflow-hidden pointer-events-none"} `}
                >
                  <h3 className="text-lg font-bold text-white mb-3">
                    5. Alguma dúvida ou observação?
                  </h3>
                  <div className="mb-8">
                    <textarea
                      value={clientNote}
                      onChange={(e) => setClientNote(e.target.value)}
                      placeholder="Ex: Preciso que tirem apenas as pontas, tenho alergia a tal produto..."
                      className="w-full bg-[#151516] border border-[#2a2a2c] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none h-24"
                    />
                  </div>
                </div>

                {/* Checkout Button */}
                <div
                  className={`sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b] to-transparent transition-all duration-500 ${selectedTime ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"} `}
                >
                  <Link href="/register" className="w-full block">
                    <button className="w-full bg-primary text-black font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:bg-cyan-400 transition-colors text-lg flex items-center justify-center gap-2">
                      Confirmar Agendamento{" "}
                      <span className="opacity-70 text-sm font-normal">
                        ({selectedTime})
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer System */}
      <Footer />
    </div>
  );
}
