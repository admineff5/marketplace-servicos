-- DDL Schema: Sprint Inicial e Formulários Reversos
-- Criado com base nos Mock Data (page.tsx, bloqueios/page.tsx)

CREATE TABLE IF NOT EXISTS tb_usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tb_empresas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    nicho VARCHAR(50),
    endereco TEXT,
    descricao TEXT,
    logo_url VARCHAR(255),
    banner_url VARCHAR(255),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tb_profissionais (
    id SERIAL PRIMARY KEY,
    empresa_id INT REFERENCES tb_empresas(id),
    nome VARCHAR(100) NOT NULL,
    foto_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS tb_servicos (
    id SERIAL PRIMARY KEY,
    empresa_id INT REFERENCES tb_empresas(id),
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2),
    duracao_minutos INT
);

CREATE TABLE IF NOT EXISTS tb_agendamentos (
    id SERIAL PRIMARY KEY,
    empresa_id INT REFERENCES tb_empresas(id),
    profissional_id INT REFERENCES tb_profissionais(id),
    usuario_id INT REFERENCES tb_usuarios(id),
    servico_id INT REFERENCES tb_servicos(id),
    data_agendamento DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    observacao_cliente TEXT,
    status VARCHAR(50) DEFAULT 'AGENDADO',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tb_bloqueios_agenda (
    id SERIAL PRIMARY KEY,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    hora_abertura TIME,
    hora_fechamento TIME,
    profissional_id INT REFERENCES tb_profissionais(id), -- NULL se for a loja inteira
    empresa_id INT REFERENCES tb_empresas(id),
    situacao VARCHAR(150) NOT NULL,
    motivo_opcional TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
