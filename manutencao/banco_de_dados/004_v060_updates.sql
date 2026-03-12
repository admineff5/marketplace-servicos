-- Migration v0.6.0: Adição de Campos de Perfil e Empresa

-- 1. Alterações na tabela User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "cpf" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "address" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "User_cpf_key" ON "User"("cpf");

-- 2. Alterações na tabela Company
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "cnpj" TEXT;
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "legalName" TEXT;
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "Company_cnpj_key" ON "Company"("cnpj");

COMMENT ON COLUMN "User"."cpf" IS 'Cadastro de Pessoa Física do usuário (Único)';
COMMENT ON COLUMN "Company"."cnpj" IS 'Cadastro Nacional da Pessoa Jurídica da empresa (Único)';
COMMENT ON COLUMN "Company"."legalName" IS 'Razão Social da empresa';
