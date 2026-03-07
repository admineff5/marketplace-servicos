-- DDL Schema: Atualizações para Formulários de Serviços e Profissionais (v0.2.0)
-- Referência: Implementação dos Modais de Cadastro Rápido do Dashboard

-- 1. Tabela tb_servicos (Criada no 001, agora adequando aos novos campos do form)
ALTER TABLE tb_servicos
ADD COLUMN IF NOT EXISTS descricao TEXT,
ADD COLUMN IF NOT EXISTS preco_promocional DECIMAL(10,2);

-- 2. Tabela tb_profissionais (Criada no 001, agora adequando aos novos campos do form)
ALTER TABLE tb_profissionais
ADD COLUMN IF NOT EXISTS especialidade VARCHAR(150),
ADD COLUMN IF NOT EXISTS dias_atendimento VARCHAR(100), -- Ex: Segunda a Sexta
ADD COLUMN IF NOT EXISTS horario_atendimento VARCHAR(100); -- Ex: 09:00 - 18:00
