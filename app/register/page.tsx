"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "../components/ThemeToggle";

import { Footer } from "../components/Footer";

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        cpf: "",
    });

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // Lógica: Se o usuário preencher um campo adicional futuramente para CNPJ, mudaremos o role.
            // Por enquanto, registro padrão via formulário principal é CLIENT.
            const role = "CLIENT";
            const cleanCPF = formData.cpf.replace(/\D/g, "");

            if (cleanCPF.length !== 11) {
                throw new Error("O CPF deve conter 11 dígitos.");
            }

            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    cpf: cleanCPF,
                    role
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Erro ao realizar cadastro");
            }

            // 📩 Verificar se email foi enviado
            if (data.emailSent) {
                setIsSuccess(true);
                return;
            }

            // Sucesso! Redireciona conforme o perfil
            if (role === "CLIENT") {
                router.push("/cliente");
            } else {
                router.push("/dashboard");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        if (name === "cpf") {
            // Máscara simples para CPF: 000.000.000-00
            const x = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/);
            if (x) {
                const masked = !x[2] ? x[1] : `${x[1]}.${x[2]}${x[3] ? `.${x[3]}` : ''}${x[4] ? `-${x[4]}` : ''}`;
                setFormData({ ...formData, [name]: masked });
            }
            return;
        }

        setFormData({ ...formData, [name]: value });
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 dark:bg-[#0a0a0a]">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-cyan-100 dark:bg-cyan-900/30">
                            <svg className="h-8 w-8 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Verifique seu E-mail</h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Enviamos um link de ativação para o seu e-mail. Por favor, acesse sua caixa de entrada para liberar seu acesso.
                        </p>
                        <div className="mt-6">
                            <Link href="/login" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-cyan-700 hover:bg-cyan-800 transition-colors">
                                Ir para o Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col dark:bg-[#0a0a0a]">
            <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="absolute top-6 right-6">
                    <ThemeToggle />
                </div>
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <Link href="/">
                        <Image
                            src="/logo-icon.png"
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
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
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
                                        className="appearance-none block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-cyan-600 focus:border-cyan-600 dark:focus:ring-primary dark:focus:border-primary sm:text-sm transition-colors"
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
                                        className="appearance-none block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-cyan-600 focus:border-cyan-600 dark:focus:ring-primary dark:focus:border-primary sm:text-sm transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    CPF
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="cpf"
                                        name="cpf"
                                        type="text"
                                        required
                                        value={formData.cpf}
                                        onChange={handleChange}
                                        placeholder="000.000.000-00"
                                        maxLength={14}
                                        className="appearance-none block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-cyan-600 focus:border-cyan-600 dark:focus:ring-primary dark:focus:border-primary sm:text-sm transition-colors"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Seu CPF é obrigatório para validação de segurança.
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
                                        className="appearance-none block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-cyan-600 focus:border-cyan-600 dark:focus:ring-primary dark:focus:border-primary sm:text-sm transition-colors"
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
                                        className="appearance-none block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-cyan-600 focus:border-cyan-600 dark:focus:ring-primary dark:focus:border-primary sm:text-sm transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white dark:text-black bg-cyan-700 dark:bg-primary hover:bg-cyan-800 dark:hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Processando..." : "Cadastrar"}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Já possui conta?{' '}
                                <Link href="/login" className="font-medium text-cyan-700 dark:text-primary hover:text-cyan-800 dark:hover:text-cyan-400 dark:hover:text-cyan-400">
                                    Faça login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
