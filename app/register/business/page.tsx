import Link from "next/link";
import Image from "next/image";

export default function BusinessRegister() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 dark:bg-[#0a0a0a]">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/">
                    <Image
                        src="/logo icon.png"
                        alt="Logo"
                        width={48}
                        height={48}
                        className="mx-auto object-contain"
                    />
                </Link>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    Torne-se um Parceiro
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Leve o seu negócio para o próximo nível com o nosso Marketplace
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                    <form className="space-y-6" action="#" method="POST">

                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                Nome da Empresa
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    id="companyName"
                                    name="companyName"
                                    type="text"
                                    required
                                    placeholder="Ex: Barbearia do João"
                                    className="appearance-none block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="niche" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                Nicho de Atuação
                            </label>
                            <div className="mt-1">
                                <select
                                    id="niche"
                                    name="niche"
                                    className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors cursor-pointer"
                                >
                                    <option>Barbearia</option>
                                    <option>Pet shop</option>
                                    <option>Clínica</option>
                                    <option>Estética</option>
                                    <option>Outros</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    WhatsApp
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="whatsapp"
                                        name="whatsapp"
                                        type="tel"
                                        placeholder="(00) 00000-0000"
                                        className="appearance-none block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Instagram
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                                        @
                                    </span>
                                    <input
                                        type="text"
                                        name="instagram"
                                        id="instagram"
                                        placeholder="usuario"
                                        className="flex-1 min-w-0 block w-full px-3 py-3 rounded-none rounded-r-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                E-mail para Acesso
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="seu@email.com"
                                    className="appearance-none block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                Senha Forte
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="appearance-none block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-black bg-primary hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors transform hover:scale-[1.02]"
                            >
                                Criar Minha Empresa
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Já possui conta?{' '}
                            <Link href="/login" className="font-medium text-primary hover:text-cyan-400">
                                Faça login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
