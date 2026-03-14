import Image from "next/image";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full bg-gray-100 dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-gray-800 py-8 px-4 sm:px-6 lg:px-8 transition-colors mt-auto shrink-0 z-10 relative">
            <div className="container mx-auto">
                {/* Grid principal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mb-6">
                    {/* Coluna 1 — Branding */}
                    <div>
                        <div className="flex items-center gap-2.5 mb-4">
                            <Image
                                src="/logo icon.png"
                                alt="EFF5 Logo"
                                width={36}
                                height={36}
                                className="rounded-full"
                            />
                            <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                                Agende<span className="text-cyan-700 dark:text-primary">Já</span>
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-[240px]">
                            A plataforma de agendamento que conecta você aos melhores serviços.
                        </p>
                    </div>

                    {/* Coluna 2 — Plataforma */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Plataforma</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="text-sm text-gray-400 hover:text-cyan-700 dark:hover:text-primary transition-colors">
                                    Buscar Serviços
                                </Link>
                            </li>
                            <li>
                                <Link href="/register" className="text-sm text-gray-400 hover:text-cyan-700 dark:hover:text-primary transition-colors">
                                    Cadastrar Empresa
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="text-sm text-gray-400 hover:text-cyan-700 dark:hover:text-primary transition-colors">
                                    Login
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Coluna 3 — Empresa */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Empresa</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/fale-conosco" className="text-sm text-gray-400 hover:text-cyan-700 dark:hover:text-primary transition-colors">
                                    Quem somos
                                </Link>
                            </li>
                            <li>
                                <Link href="/fale-conosco" className="text-sm text-gray-400 hover:text-cyan-700 dark:hover:text-primary transition-colors">
                                    Contato
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Coluna 4 — Legal */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Legal</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/termos" className="text-sm text-gray-400 hover:text-cyan-700 dark:hover:text-primary transition-colors">
                                    Termos de Uso
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacidade" className="text-sm text-gray-400 hover:text-cyan-700 dark:hover:text-primary transition-colors">
                                    Privacidade
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-xs">
                       AgendaJá © 2026 • v0.9.26.2 Pro by EFF5. Todos os direitos reservados. <span className="text-cyan-700/50 dark:text-primary/30 ml-2">v0.9.26.2</span>
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="text-gray-500 hover:text-[#0A66C2] transition-colors" aria-label="LinkedIn">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                            </svg>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-[#E4405F] transition-colors" aria-label="Instagram">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" clipRule="evenodd" />
                            </svg>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-[#FF0000] transition-colors" aria-label="YouTube">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
