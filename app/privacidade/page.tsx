import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col dark:bg-[#0a0a0a]">
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md dark:bg-black/80 border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white hover:text-cyan-700 dark:hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Voltar ao Início
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 sm:p-12 shadow-xl transition-colors">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            Políticas de Privacidade
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-10 border-b border-gray-100 dark:border-gray-800 pb-6">
            Última atualização: 26 de Março de 2026
          </p>

          <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                1. Coleta e Tratamento de Dados
              </h2>
              <p>
                Levamos a sua privacidade à sério. O AgendeJá armazena dados
                mínimos como Nome, E-mail e Telefone para estritamente
                funcionalizar os agendamentos nos estabelecimentos escolhidos.
                Não vendemos informações para terceiros sob nenhuma hipótese.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                2. Compartilhamento
              </h2>
              <p>
                Seus dados de agendamento serão compartilhados exclusivamente com
                o estabelecimento no qual você requisitou prestação de serviço,
                para que este consiga validar o seu ticket, acioná-lo via
                WhatsApp para lembretes ou resolver possíveis entraves de balcão.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                3. Segurança em Criptografia
              </h2>
              <p>
                Nossos bancos de dados e senhas são selados por chaves e tráfego HTTPS blindado pelo Vercel Edge. Protegemos a sua integridade técnica obedecendo rígidas métricas de anonimização estipuladas por Lei (LGPD).
              </p>
            </section>
            
            {/* Espaço em branco reservado para o cliente preencher no futuro */}
            <section className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-center text-sm font-medium text-gray-500 italic">
                    [ Insira seu documento integral de LGPD e Privacidade aqui ]
                </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
