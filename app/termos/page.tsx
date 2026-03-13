import React from 'react';

export default function TermosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-indigo-100">
      <h1 className="text-4xl font-bold mb-8 text-white">Termos de Uso</h1>
      <p className="mb-4">Ao utilizar o AgendeJá, você concorda com os seguintes termos:</p>
      
      <section className="space-y-6 mt-10">
        <h2 className="text-2xl font-semibold text-white">1. Responsabilidade</h2>
        <p>O AgendeJá é uma plataforma de conexão entre prestadores e clientes. A responsabilidade pelo serviço prestado é do profissional.</p>
        
        <h2 className="text-2xl font-semibold text-white">2. Cancelamentos</h2>
        <p>As políticas de cancelamento são definidas individualmente por cada prestador de serviço.</p>
      </section>
    </div>
  );
}
