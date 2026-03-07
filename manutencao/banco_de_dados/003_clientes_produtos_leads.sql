-- DDL Schema: Novo Módulo de Captura e Retenção (Clientes, Inventário e Leads) (v0.3.0)
-- Documentando a Rule 3 das Skills baseados nos formulários criados

-- 1. Modificando usuários (tabela base) para suportar nivelamento VIP e rastreio de visitas
ALTER TABLE tb_usuarios
ADD COLUMN IF NOT EXISTS status_cliente VARCHAR(50) DEFAULT 'Novo', -- Ex: VIP, Frequente, Novo
ADD COLUMN IF NOT EXISTS total_visitas INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS ultima_visita DATE;

-- 2. Nova Tabela: Inventário Físico (Produtos)
CREATE TABLE IF NOT EXISTS tb_produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    preco_venda DECIMAL(10,2) NOT NULL,
    qtd_estoque INT NOT NULL DEFAULT 0,
    imagem_url TEXT,
    categoria VARCHAR(100),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Nova Tabela: Pipeline de CRM (Leads)
CREATE TABLE IF NOT EXISTS tb_leads (
    id SERIAL PRIMARY KEY,
    nome_prospecto VARCHAR(150) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    origem_captura VARCHAR(50), -- Ex: Instagram, Google Ads, WhatsApp
    servico_interesse VARCHAR(100), -- Ex: Corte Degradê, Micro Pgmentação
    estagio_kanban VARCHAR(50) DEFAULT 'Novos Contatos', -- Ex: Novos Contatos, Em Negociação, Confirmado, Perdido
    data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
