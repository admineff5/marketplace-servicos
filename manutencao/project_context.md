# MASTER PROMPT - AGENDEJÁ v0.9.0 (Beta - Integração Total)

## Contexto do Projeto
Você é o assistente principal de desenvolvimento do **AgendeJá**, um Marketplace de Estética e Pequenos Serviços. O sistema é uma plataforma mobile-first robusta para gestão de agendamentos e vendas.

---

## 🎨 Identidade Visual (Cores)
O sistema utiliza Tailwind CSS 4 com as seguintes variáveis de cor:

- **Primária (Neon)**: `--primary: #00ffff` (Cyan)
- **Cores de Texto (Light Mode)**: `text-cyan-700` (Acessibilidade para headers e botões)
- **Status (Badges)**:
  - **Confirmado**: `text-green-500` (bg opacity 10%)
  - **Pendente/Aguardando**: `text-yellow-500` (bg opacity 10%)
  - **Erro/Crítico**: `text-red-500`
- **Temas**:
  - **Light**: Background `#ffffff`, Foreground `#0a0a0a`
  - **Dark**: Background `#0a0a0a`, Foreground `#ffffff`
- **Componentes**:
  - **Sidebar Active**: `bg-gray-100` (Light) ou `bg-primary/10` (Dark)
  - **Inputs/Cards (Dark)**: `bg-[#111]` ou `bg-white/5` com bordas `white/10`

---

## 🔑 Credenciais para Teste
Utilize os acessos mockados abaixo na tela de `/login`:

- **Administrador (Parceiro)**:
  - **Login**: `admin@eff5.com.br`
  - **Senha**: `123456`
  - **Destino**: `/dashboard`
- **Cliente**:
  - **Login**: `cliente@eff5.com.br`
  - **Senha**: `123456`
  - **Destino**: `/cliente`

---

## 🏗️ Estrutura Detalhada das Páginas

### 1. Página Principal (Home - `/`)
- **Header**: Sticky, com logo, ThemeToggle, links de Login e botão "Cadastrar" (Primary).
- **Hero Section**:
  - Busca Estilo AI: Input largo com ícone `Sparkles` e botão "Buscar".
  - Filtros de Categoria: Pílulas horizontais (`Grid`, `Scissors`, `Dog`, `Stethoscope`, `Sparkles`).
- **Listagem de Empresas**:
  - Toggle de Layout: Grade (Grid) ou Lista (List).
  - Cards: Imagem de banner, Logo circular, Nome, Nicho, Rating (Star) e Endereço.
- **Fluxo de Agendamento (Modal)**:
  - Multi-passo: 1. Serviço -> 2. Profissional -> 3. Data (Picker Horizontal) -> 4. Horário -> 5. Observações.

### 2. Dashboard do Parceiro (`/dashboard`)
- **Sidebar**: Retraída por padrão. Links: Visão Geral, Agenda, Consulta, Bloqueios, Leads (Kanban), Clientes, Profissionais, Serviços, Produtos, Relatórios.
- **Header**: Nome da empresa (Barbearia do João), Sino de Notificações com dropdown, Avatar do usuário.
- **Visão Geral**: Grid de 6 cards de performance com indicadores de tendência (Mês vs Mês anterior).
- **Leads**: Quadro estilo Kanban com origens (Instagram, Google, etc).
- **Produtos**: Lista com alertas visuais de estoque baixo (<5 unidades).

### 3. Página do Cliente (`/cliente`)
- **Resumo**: Cards de total de agendados, realizados e gasto financeiro acumulado.
- **Tabs**: "Próximos Agendamentos" e "Histórico e Recibos".
- **Cards de Agendamento**: Foto do local, Status colorido, data/hora e botões de "Reagendar" ou "Ver Rota".

---

## 🛠️ Regras Técnicas e Skills
- **Skill `padroes_frontend`**: Priorizar `lucide-react`, mobile-first, não quebrar componentes core e manter o sincronismo entre `CHANGELOG.md` e a versão do Footer (`v0.5.0`).
- **Banco de Dados**: Scripts SQL DDL em `manutencao/banco_de_dados/` para cada nova entidade.
- **Modo Privacidade**: Toggle de "olho" no Dashboard para mascarar valores financeiros.

**VERSÃO ATUAL:** 0.9.0
**REPLICAÇÃO:** Siga rigorosamente os códigos hexadecimais e a estrutura de pastas (`app/`, `prisma/`, `manutencao/`) para manter a integridade, agora com integração total ao PostgreSQL (OCI).
