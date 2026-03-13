import React from 'react';

export default function PrivacidadePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-indigo-100">
      <h1 className="text-4xl font-bold mb-8 text-white">Política de Privacidade</h1>
      <p className="mb-4">Sua privacidade é importante para nós. Esta política explica como coletamos e usamos seus dados.</p>
      {/* Adicionar conteúdo real conforme necessário */}
      <section className="space-y-6 mt-10">
        <h2 className="text-2xl font-semibold text-white">1. Coleta de Informações</h2>
        <p>Coletamos informações básicas de cadastro para possibilitar a prestação de serviços de agendamento.</p>
        
        <h2 className="text-2xl font-semibold text-white">2. Uso dos Dados</h2>
        <p>Seus dados são utilizados exclusivamente para gerenciar seus agendamentos e melhorar sua experiência na plataforma.</p>
      </section>
    </div>
  );
}
