"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../components/ThemeToggle";
import { Loader2 } from "lucide-react";

function VerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailFromUrl = searchParams.get("email");

    const [email, setEmail] = useState("");
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (emailFromUrl) {
            setEmail(emailFromUrl);
        } else {
            // Tenta pegar o e-mail se foi guardado antes
            router.push("/login?error=Seu+e-mail+nao+foi+encontrado.+Tente+login.");
        }
    }, [emailFromUrl, router]);

    const handleChange = (index: number, value: string) => {
        // Aceita apenas números
        if (!/^[0-9]*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
        
        // Remove error state on typing
        if (error) setError("");
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        
        if (pastedData) {
            const newCode = [...code];
            for (let i = 0; i < pastedData.length; i++) {
                newCode[i] = pastedData[i];
            }
            setCode(newCode);
            
            // Foco no último preenchido ou no 6º se preencheu todos
            const targetIndex = Math.min(pastedData.length, 5);
            inputsRef.current[targetIndex]?.focus();
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        const fullCode = code.join("");
        if (fullCode.length < 6) {
            setError("Por favor, digite os 6 dígitos.");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: fullCode }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Código inválido");
            }

            // Sucesso! Joga pra dashboard
            router.push(data.redirectUrl || "/dashboard");

        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
            // Shake effect on error could be added by clearing code
            // setCode(["", "", "", "", "", ""]);
            // inputsRef.current[0]?.focus();
        }
    };

    // Auto submit if 6 digits are typed
    useEffect(() => {
        if (code.every(digit => digit !== "") && code.join("").length === 6 && !isLoading) {
            handleSubmit();
        }
    }, [code]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 dark:bg-[#0a0a0a]">
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
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                    Confirme seu E-mail
                </h2>
                <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-8 px-4">
                    Digite o código de 6 dígitos que enviamos para <br/>
                    <strong className="text-gray-900 dark:text-gray-200">{email}</strong>
                </p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-10 px-4 shadow-xl sm:rounded-2xl sm:px-10 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-between items-center gap-2 sm:gap-4">
                            {code.map((digit, idx) => (
                                <input
                                    key={idx}
                                    type="text"
                                    inputMode="numeric"
                                    className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold bg-gray-50 dark:bg-gray-800 border ${error ? 'border-red-400 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-cyan-600 dark:focus:ring-primary focus:border-cyan-600 dark:focus:border-primary'} rounded-xl focus:outline-none transition-all dark:text-white shadow-sm`}
                                    maxLength={1}
                                    value={digit}
                                    autoFocus={idx === 0}
                                    onChange={(e) => handleChange(idx, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(idx, e)}
                                    onPaste={handlePaste}
                                    ref={(el) => {
                                        inputsRef.current[idx] = el;
                                    }}
                                />
                            ))}
                        </div>

                        {error && (
                            <p className="text-center text-sm font-medium text-red-500 animate-pulse">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || code.join("").length < 6}
                            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-cyan-700 hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6 dark:bg-primary dark:text-black dark:hover:bg-primary/90"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Verificar e Entrar"
                            )}
                        </button>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Não recebeu o código? </span>
                            <button 
                                type="button" 
                                className="font-bold text-cyan-600 hover:text-cyan-500 dark:text-primary dark:hover:text-primary/80 transition-colors"
                onClick={() => alert('Em uma versão futura, enviaremos o código novamente por e-mail e WhatsApp.')}
                            >
                                Reenviar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function VerifyOTP() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-100 dark:bg-[#0a0a0a] flex items-center justify-center"><Loader2 className="animate-spin text-cyan-600 w-8 h-8"/></div>}>
            <VerifyContent />
        </Suspense>
    );
}
