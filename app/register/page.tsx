"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Footer } from "../components/Footer";

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        document: "",
        phone: "",
        password: "",
    });

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();

        // Lógica temporária: Se o documento ter <= 11 números, é CPF (Cliente). Senão é CNPJ (Parceiro).
        const numbersOnly = formData.document.replace(/\D/g, "");

        if (numbersOnly.length <= 11) {
            // Cliente
            router.push("/cliente");
        } else {
            // Parceiro
            router.push("/dashboard");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col dark:bg-[#0a0a0a]">
            <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
                        Crie sua Conta
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Junte-se a nós para encontrar ou oferecer os melhores serviços
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                        <form className="space-y-6" onSubmit={handleRegister}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Nome Completo ou Empresa
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="João Silva ou Barbearia do João"
                                        className="appearance-none block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    E-mail
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="seu@email.com"
                                        className="appearance-none block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="document" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    CPF ou CNPJ
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="document"
                                        name="document"
                                        type="text"
                                        required
                                        value={formData.document}
                                        onChange={handleChange}
                                        placeholder="000.000.000-00 ou 00.000.000/0000-00"
                                        className="appearance-none block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Seu tipo de conta (Cliente ou Parceiro) será definido pelo documento informado.
                                </p>
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Celular / WhatsApp
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="(00) 00000-0000"
                                        className="appearance-none block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Senha
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-black bg-primary hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors transform hover:scale-[1.02]"
                                >
                                    Cadastrar
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Já possui conta?{' '}
                                <Link href="/login" className="font-medium text-cyan-700 dark:text-primary hover:text-cyan-700 dark:hover:text-cyan-400">
                                    Faça login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
