# Changelog

## [0.9.31] - 2026-03-14
### Corrigido
- Implementado bypass explícito no Middleware para a rota `/register`, eliminando qualquer redirecionamento residual para usuários logados (PF e PJ).
- Atualizada versão global para v0.9.31.

## [0.9.30] - 2026-03-14
### Corrigido
- Ajustada lógica de redirecionamento no Middleware para permitir acesso à página de Cadastro (`/register`) mesmo para usuários autenticados.
- Corrigido comportamento do botão "Cadastrar minha Empresa" na Home para usuários logados.
- Atualizada versão global para v0.9.30.

## [0.9.29] - 2026-03-14
### Alterado
- Refinado layout do Showcase para garantir visibilidade total e centragem perfeita das capturas de sistema.
- Alterada proporção do container para 16:9 (aspect-video) para melhor ergonomia visual.
- Ajustado modo de escala para `contain` para evitar cortes nas interfaces do sistema.
- Atualizada versão global para v0.9.29.

## [0.9.28] - 2026-03-14
### Adicionado
- Implementado Showcase Dinâmico que alterna automaticamente entre os modos Claro (Light) e Escuro (Dark) baseado no tema do sistema.
- Adicionados 6 prints reais oficiais (3 Light, 3 Dark) para o showcase.
- Atualizada versão global para v0.9.28.

## [0.9.27.1] - 2026-03-14
### Corrigido
- Corregido problema onde as imagens de showcase não foram incluídas no commit anterior.
- Atualizada versão global para v0.9.27.1.

## [0.9.27] - 2026-03-14
### Alterado
- Finalizada substituição de imagens de showcase (Dashboard, Agenda e Estoque) com prints reais oficiais.
- Implementada técnica de cache-busting nas imagens de demonstração.
- Atualizada versão global para v0.9.27.

## [0.9.25.1] - 2026-03-14
### Corrigido
- Corrigidos links das imagens de demonstração (Showcase) que estavam apontando para caminhos inválidos.
- Movidas imagens reais para a pasta `/public` para garantir o carregamento correto.
- Atualizada versão global para v0.9.25.1.

## [0.9.24] - 2026-03-14
### Alterado
- Substituídas imagens de demonstração (Showcase) por capturas reais do sistema.
- Atualizada versão global para v0.9.24.

## [0.9.23] - 2026-03-13
### Adicionado
- Suporte a link customizado do Google Maps para cada unidade/loja.

### Alterado
- Botão "Ver Rota" na área do cliente agora prioriza o link configurado pelo empresário.
- Atualizada versão global para v0.9.23 (Footer e package.json).

## [0.9.22] - 2026-03-13
### Adicionado
- Sistema de avaliação com estrelas na área do cliente (PF).
- Cálculo automático da média de avaliações na página principal.

### Alterado
- Botão "Agendar de Novo" agora redireciona para a Home com empresa e profissional pré-selecionados.
- Atualizado rodapé para v0.9.22 e removidos links desnecessários (Sobre, Notas de Versão, Blog, LGPD).
- Adicionado link "Quem somos" na seção Empresa do rodapé.
- Corrigida versão global no `package.json` para 0.9.22.

## [0.9.21] - 2026-03-13
### Alterado
- Renomeado "Configurações" para "Perfil da loja" no Painel do Parceiro.
- Sidebar do cliente agora inicia recolhida por padrão.
- Reduzida altura do rodapé (Footer) para um design mais compacto.
- Melhorada legibilidade de endereços na lista de agendamentos.

### Adicionado
- Máscara de CEP (00000-000) e limite de caracteres no cadastro de unidades.

## [0.9.20] - 2026-03-13
### Fixed
- Corrigida a exibição do nome do usuário ("Olá, [Nome]") na área do cliente (PF).
- Resolvida inconsistência na Agenda do Dashboard (agora reflete os agendamentos reais).
- Corrigido endereços e nomes de empresas na lista de agendamentos do cliente.
- Corrigida a versão exibida no Footer para v0.9.19 (conforme solicitado).

### Changed
- Dashboard: Renomeado "Configurações" para "Perfil da loja".
- Dashboard: Cabeçalho agora mostra o nome da empresa e o texto "Perfil" ao lado do avatar.
- Área do Cliente: Imagens dos agendamentos agora usam `object-contain` para evitar cortes.

### Added
- Botão "Ver Rota" funcional (Google Maps) na lista de agendamentos.
- Botão "Reagendar" funcional (redireciona para a página da empresa).

## [0.9.19] - 2026-03-13
### Adicionado
- Opção "Final de semana" em bloqueios de agenda.
- Cards individuais por Unidade/Localização na Home.

### Corrigido
- Exibição do nome real do usuário no cabeçalho ("Olá, Rodrigo").
- Sincronização de bloqueios reais (Feriado/Atestado) com os slots de agendamento.
- Exibição de fotos reais e únicas dos funcionários.
- Filtro da Agenda no Dashboard que aparecia vazia.
- UI do Login: degradê suave e labels simplificados.
- Trava automática para agendamentos aos Domingos.

## [0.9.17] - 2026-03-13
**Fase:** Beta  
**Tipo de release:** Refinement & Fix  
**Resumo:** Correções críticas na Agenda, disponibilidade real de profissionais e restrições de perfil.

### Fixed
- **Dashboard Agenda**: Resolvido erro client-side (crash) ao carregar profissionais e agendamentos.
- **Availability Logic**: Substituída a lógica de teste por geração dinâmica de horários baseada no campo `hours` do profissional. Bloqueio automático de agendamentos aos domingos.
- **Booking Security**: Implementada restrição que impede contas de Empresa (BUSINESS) de realizar agendamentos no marketplace.

### Added
- **Dynamic Header**: O topo do site agora identifica o usuário logado, exibindo nome e links para Perfil (PF) ou Painel (PJ).
- **Dashboard Navigation**: Adicionado link "Voltar ao Site" na barra lateral do parceiro para facilitar a transição.
- **Session API**: Nova rota `/api/auth/session` para fornecer dados de identidade ao frontend público.

---

## [0.9.16] - 2026-03-14
**Fase:** Beta  
**Tipo de release:** Feature  
**Resumo:** Gestão completa de Unidades (Lojas/Franquias) no Dashboard.

### Added
- **Dashboard Business**: Novo modal funcional para adicionar novas unidades físicas.
- **API Security**: Blindagem da API de locais (`/api/locations`) com proteção cross-tenant e validação de sessão.
- **CRUD Unidades**: Implementação total de Criação, Listagem, Atualização Inline e Exclusão de unidades.

---

## [0.9.15] - 2026-03-14
**Fase:** Beta  
**Tipo de release:** Fix  
**Resumo:** Limpeza de dados viciados (mocks) e melhoria no diagnóstico de erros.

### Fixed
- **Home UI**: Removido o mock "Profissional 1" que mascarava a ausência de funcionários reais no banco de dados.
- **Appointments API**: Mensagens de erro mais específicas (ex: "Escolha um profissional") em vez de um genérico "Dados incompletos".
- **Companies API**: Fallback para `locationId` e melhoria na integridade da resposta para evitar campos `undefined`.

---

## [0.9.14] - 2026-03-14
**Fase:** Beta  
**Tipo de release:** Fix  
**Resumo:** Correção final do fluxo de agendamento (companyId) e normalização de IDs na Home.

### Fixed
- **Booking Flow**: Agora o persistência do agendamento inclui o `companyId`, resolvendo o erro 400 de "Dados incompletos".
- **Companies API**: Adicionado `companyId` em todos os serviços mapeados para facilitar o agendamento.
- **Global Appointments API**: Corrigido erro de build TypeScript harmonizando o `POST` genérico com o novo schema.
- **Home UI**: Sincronização de estados de agendamento para usar IDs reais do banco de dados em vez de mocks.

---

## [0.9.13] - 2026-03-14
**Fase:** Beta  
**Tipo de release:** Patch  
**Resumo:** Correção crítica no fluxo de agendamento e atualização de versão no rodapé.

### Fixed
- **Appointment API**: Corrigido erro de "Dados incompletos" garantindo que IDs reais de funcionários e localizações sejam enviados.
- **Footer UI**: Versão atualizada para v0.9.13 para refletir o estado real do site em produção.

---

## [0.9.12] - 2026-03-14
**Fase:** Beta  
**Tipo de release:** Patch  
**Resumo:** Fluxo de Agendamento Real — Implementação da lógica de persistência de agendamentos no banco de dados e feedback visual de sucesso.

### Added
- **Functional Booking Flow:** O botão "Confirmar Agendamento" agora envia os dados para a API e salva o registro no banco de dados.
- **Success Feedback:** Adicionado um overlay de sucesso com animação e confirmação após o agendamento.
- **REST API:** Novo endpoint `POST /api/user/appointments` para criação de agendamentos.

### Changed
- **Home Page:** Atualizada lógica do modal de agendamento para lidar com IDs reais de serviços e profissionais.
- **RBAC & Auth:** Implementado redirecionamento inteligente para login caso o usuário tente agendar sem estar autenticado.

---

## [0.9.11] - 2026-03-14
**Fase:** Beta  
**Tipo de release:** Patch  
**Resumo:** Card Validation & Masking — Implementação de máscaras de entrada e validação rigorosa para o cadastro de cartões de crédito.

### Added
- **Input Masks:** Adicionada formatação automática (máscara) para número do cartão (espaços a cada 4 dígitos) e vencimento (MM/AA).
- **Input Constraints:** Bloqueio de entrada para caracteres não numéricos e limite estrito de caracteres (16 dígitos para cartão, 4 para vencimento).
- **Logical Validation:** O sistema agora impede o salvamento de cartões com números incompletos ou datas de vencimento inválidas.

---

## [0.9.10] - 2026-03-14
**Fase:** Beta  
**Tipo de release:** Patch  
**Resumo:** Credit Card UI & Autofill — Melhoria na experiência de cadastro de cartões com suporte a preenchimento automático do navegador e refinamento de texto.

### Added
- **Browser Autofill Support:** Implementados atributos `autocomplete` (`cc-name`, `cc-number`, `cc-exp`) nos campos de cartão de crédito para permitir que o navegador sugira cartões salvos.
- **UX Refinement:** Atualizado placeholder do nome do cartão para "Nome conforme aparece no cartão".

### Changed
- **Versioning:** Ajustado versionamento para seguir ciclo beta antes do lançamento oficial.

---

## [0.9.9] - 2026-03-14
**Fase:** Beta  
**Tipo de release:** Patch  
**Resumo:** PF Profile Refinement & Security — Ajustes de contraste (Cyan-700) na tela de perfil do cliente e validação de segurança de dados de pagamento.

### Changed
- **UI Refinement (PF):** Aplicado o tom **Petróleo (Cyan-700)** nos ícones, botões e badges da tela de perfil em modo Light, resolvendo problemas de legibilidade.
- **Security:** Validada e documentada a proteção de dados de pagamento (masking de cartão).
- **Branding:** Sincronização da paleta cromática entre dashboard e área do cliente.

---

## [0.9.8] - 2026-03-14
**Fase:** Beta  
**Tipo de release:** Patch  
**Resumo:** Auth Debug & UX — Normalização de e-mails (trim/lowercase), correção de mensagens de erro e melhoria na robustez do login de pessoa física.

### Changed
- **Auth API:** Implementada normalização automática de e-mails no Login e Register (evita problemas com espaços e caixa alta).
- **Security UX:** Atualizada mensagem de erro de login para "E-mail e/ou senha inválidos" (melhorando privacidade e feedback).
- **Bug Fix:** Resolvida inconsistência no login de PF causada por domínios ou espaços não tratados.

---

## [0.9.7] - 2026-03-14
**Fase:** Beta  
**Tipo de release:** Patch  
**Resumo:** Login & Footer UX Refinement — Ajuste de layout da tela de login (split 60/40), correção da logo no login e adição de versionamento/changelog no rodapé.

### Added
- **Footer:** Adicionado link para "Notas de Versão" (Changelog) e exibição da versão atual.

### Changed
- **Login UI:** Layout alterado para split 60/40 (Info/Form) para melhor aproveitamento visual.
- **Branding:** Removido filtro de inversão da logo na tela de login, garantindo a exibição das cores originais.

---

## [0.9.6] - 2026-03-14
**Fase:** Beta  
**Tipo de release:** Patch  
**Resumo:** Light Mode Contrast Refinement — Uniformização de hovers e ícones interativos no modo Light usando o tom "Petróleo" (Cyan-700).

### Added
- **Skill de Design:** Adicionada regra de interatividade para Modo Light (Hovers e Ativos nunca usam ciano neon em fundos claros).

### Changed
- **UI Contrast:** Atualização dos hovers das categorias e links do footer para Cyan-700 em Light Mode.
- **Branding Sync:** Seção "Para Empresários" agora utiliza Cyan-700 nos ícones e métricas para harmonia com o Dashboard.

---

## [0.9.5] - 2026-03-14
**Fase:** Beta  
**Tipo de release:** Patch  
**Resumo:** Petrol Branding & Skill Integration — Refinamento da cor de destaque para Modo Light (Cyan-700) e integração da regra na Skill de Padrões.

### Added
- **Skill de Design:** Atualização do manual `padroes_frontend` com a regra de cores: Ciano (Dark) vs Petróleo (Light).

### Changed
- **Branding Refined:** Substituição do azul vibrante pelo tom "Petróleo" (Cyan-700 / #0e7490) em toda a Landing Page para harmonia com o Dashboard.

---

## [0.9.4] - 2026-03-14
**Fase:** Beta  
**Tipo de release:** Patch  
**Resumo:** Branding & Contrast Polish — Implementação da identidade visual EFF5, correção de contraste cromático nos modos Light/Dark e sincronização de screenshots reais.

### Added
- **Identidade EFF5:** Substituição de placeholders pela logo oficial EFF5 no rodapé e padronização do azul vibrante (#0066FF) no branding "AgendeJá".
- **Visual Evidence:** Galeria da Landing Page agora utiliza 100% de capturas reais do sistema.

### Changed
- **Acessibilidade Cromática:** Ícones do "Como Funciona" escurecidos para azul marinho em Modo Light; texto das pílulas de categoria mantido em alto contraste no Dark Mode.

---

## [0.9.3] - 2026-03-14
**Fase:** Beta  
**Tipo de release:** Minor  
**Resumo:** UI/UX Reborn — Refatoração do catálogo de serviços, redesign completo da tela de login, landing page com fotos reais e melhoria de acessibilidade cromática no Modo Light.

### Added
- **Catálogo Hierárquico:** A escolha de serviços agora é feita em dois passos (Categoria -> Serviço), reduzindo a poluição visual.
- **Showcase Real:** Substituição de placeholders por screenshots reais do sistema (Dashboard, Agenda e Estoque).
- **Novo Login Premium:** Layout moderno de duas colunas com área informativa à esquerda e formulário à direita.

### Changed
- **Acessibilidade Light Mode:** Os tons de azul e ciano foram escurecidos nas interfaces claras para garantir melhor leitura e nitidez.
- **Navegação Auth:** Rodapé removido das telas de Login e Registro para foco total na conversão.

---

## [0.9.2] - 2026-03-14
**Fase:** Beta  
**Tipo de release:** Patch  
**Resumo:** Resiliência de Backend e Correção de Dashboard — Implementada auto-inicialização (self-healing) de empresas para evitar erros 404 e restauração visual de KPIs.

### Added
- **Self-Healing de Empresa:** Novo helper `getCompanyByUserId` garante que usuários BUSINESS sempre tenham uma Empresa vinculada ao acessar o sistema.
- **Auto-criação no Registro:** Cadastro de parceiros agora cria automaticamente o perfil básico da empresa.

### Fixed
- **API 404:** Resolvido bug onde usuários sem dados iniciais recebiam 404 em rotas de Serviços, Produtos e Estatísticas.
- **Build Error:** Corrigido erro de "Invalid URL" no build de produção da Gestão de Clientes.
- **Dashboard KPIs:** Valores dos cards restaurados para a cor branca (conforme solicitado pelo usuário).
- **Save Buttons:** Botoes de "Salvar" em Serviços e Produtos restaurados via correção de lookup de empresa.

---

## [0.9.0] - 2026-03-14
**Fase:** Beta  
**Tipo de release:** Minor  
**Resumo:** Integração total do Dashboard — Persistência real em todas as tabelas, máscaras de inputs (CNPJ, Telefone, Moeda) e KPIs em tempo real.

### Added
- **API de Estatísticas:** Novo endpoint `/api/dashboard/stats` para cálculo de receita, agendamentos e atendimentos do mês atual.
- **Gestão de Bloqueios:** Módulo de Feriados e Ausências agora 100% funcional com CRUD real e filtro por profissional.
- **API de Clientes:** Agregação automática de clientes a partir de agendamentos reais, informando frequência e última visita.

### Changed
- **Configurações:** CNPJ com máscara `00.000.000/0000-00` e limite de 14 caracteres. Campo redundante de Logo URL removido.
- **Profissionais:** Removido ID fixo; agora utiliza o ID da empresa via sessão. Mapeamento correto de cargo, horários e imagem.
- **Produtos e Serviços:** Máscaras de moeda BRL em tempo real. Persistência de `promoPrice` e `description` nos serviços.
- **Consulta de Agendamentos:** Totalmente integrada ao banco de dados, com filtros reais e totalizadores de valores.
- **Dashboard Overview:** KPIs (Receita, Agendamentos, etc.) agora refletem dados reais do banco.

### Fixed
- **Segurança:** Todos os endpoints agora validam a `companyId` via sessão do usuário, impedindo acesso a dados de terceiros.
- **Padronização de Status:** Unificação dos status de agendamento (CONFIRMED, CANCELLED, etc.) entre banco, API e Frontend.
- **Máscaras de Input:** Correção de bugs de parsing em campos de preço e telefone.

---

## [0.8.1] - 2026-03-13
**Fase:** Beta  
**Tipo de release:** Patch  
**Resumo:** Upgrade visual da Homepage — novas seções "Como Funciona", CTA para empresários com showcase do dashboard, e Footer profissional multi-coluna.

### Added
- **Seção "Como Funciona":** 3 passos (Encontre, Escolha, Agende) com ícones animados e cards dark premium.
- **CTA para Empresários:** Seção completa com texto persuasivo, lista de funcionalidades e carousel de 3 imagens do dashboard (Dashboard Principal, Calendário, Estoque).
- **Dashboard Showcase Images:** 3 imagens geradas mostrando o sistema preenchido com dados de demonstração.
- **Frase de Impacto:** "Se você é empresário ou alguém procurando um serviço, chegou no local certo."

### Changed
- **Footer:** Refatorado para layout multi-coluna profissional (Branding, Plataforma, Empresa, Legal) com fundo dark (#060810).
---

**Fase:** Beta  
**Tipo de release:** Minor  
**Resumo:** Hardening de Segurança — Auditoria completa baseada no OWASP Top 10, correção de 10 vulnerabilidades críticas e altas.

### Added
- **Bcrypt:** Implementação de hash de senhas com bcrypt (cost 12) no registro e login.
- **Migração Automática:** Senhas legadas em texto puro são automaticamente convertidas para bcrypt no primeiro login.
- **Security Headers:** 6 headers HTTP de segurança adicionados (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, HSTS, Referrer-Policy, Permissions-Policy).
- **RBAC no Middleware:** Enforcement de papéis — CLIENT bloqueado do `/dashboard`, BUSINESS bloqueado do `/cliente`.
- **Validação de Senha:** Mínimo de 6 caracteres exigido no cadastro.

### Changed
- **Cookies:** Adicionado `sameSite: "lax"` em todos os pontos de criação de cookie (login, register, middleware).
- **Sessão Consistente:** Register agora usa 7 dias (antes eram 15 minutos inconsistentes).
- **CPF Mascarado:** API `/user/profile` agora retorna CPF no formato `***.***. ***-XX` (compliance LGPD).
- **Appointments Auth:** Rota `/api/appointments` agora exige autenticação e aplica RBAC (BUSINESS vê da empresa, CLIENT vê os próprios).
- **Produtos POST:** Campos `stock`, `image`, `delivery` agora são salvos corretamente.
- **Companies API:** Substituído `include` por `select` para expor apenas dados públicos necessários.

### Fixed
- **Cookie Corrompido:** Middleware agora limpa cookies corrompidos ao invés de falhar silenciosamente.
- **Appointments POST:** userId agora vem da sessão, não do body (impede spoofing).
- **Profile PUT:** Hardened para aceitar apenas campos permitidos e nunca vazar hash de senha.
---

**Fase:** Beta  
**Tipo de release:** Minor  
**Resumo:** Refatoração de Segurança e Gestão do Cliente: Logout funcional, proteção de rotas e gestão complexa de endereços/pagamentos.

### Added
- **Gestão de Endereços:** Novo sistema de múltiplos endereços com formulário estruturado e opção de "Padrão".
- **Gestão de Pagamentos:** Gerenciamento de múltiplos cartões com histórico, bandeiras e opção de "Favorito".
- **Segurança:** Implementação de Middleware para proteção de rotas base (`/cliente`, `/dashboard`).
- **Autenticação:** Rota dedicada de Logout para limpeza total de sessão e cookies.

### Changed
- **Sessão:** Aumento da duração da sessão para 7 dias (correção de perda de login).
- **UX Perfil:** Refatoração total da página de perfil para suportar as novas entidades de gestão.

### Fixed
- **Botão Sair:** Corrigido o bug onde o botão de sair não deslogava efetivamente o usuário.
- **Vazamento de Rota:** Corrigida falha que permitia acesso ao painel do cliente via URL direta sem login.
---
**Fase:** Beta  
**Tipo de release:** Minor  
**Resumo:** Implementação de persistência real para produtos, serviços e histórico de cliente, com estabilização de build para Next.js 15.

### Added
- **Gestão de Produtos:** Full CRUD conectado ao banco OCI com suporte a estoque e imagens.
- **Upload Inteligente:** Suporte a `Ctrl+C + Ctrl+V` para colar imagens diretamente no cadastro de produtos.
- **Gestão de Serviços:** Persistência total de dados de serviços (Criar/Editar/Apagar).
- **Dashboard Cliente:** Contadores de gastos e agendamentos buscando dados reais do banco.
- **Documentação:** Criação de guias de manutenção, dicionário de dados e script de permissões SSH.

### Changed
- **Estabilização de Build:** Refatoração geral de rotas dinâmicas para parâmetros assíncronos (Next.js 15).
- **Segurança:** Implementação de máscaras de CPF e expiração de sessão.
- **Schema:** Expansão dos modelos Prisma para suportar metadados de estoque e empresa.

### Fixed
- **Estabilização da Agenda/Profissionais:** Tratamento de erros de API para evitar "Application error" em telas vazias.
- **Versionamento:** Sincronização global da tag de versão (Footer/Changelog).
---
## [0.5.2] - 2026-03-12
### Fixed
- Limpeza total de dados mockados (Dashboard, Cliente, Produtos).
- Correção de bug crítico na navegação da Agenda (Date comparisons).
- Implementação de APIs DELETE/PUT para profissionais.
- Ativação de botões de edição/exclusão na gestão de produtos.
---
## [0.5.1] - 2026-03-11
### Adicionado
- **Autenticação Real:** Substituído mock data por login funcional sincronizado com o banco de dados.
- **Dark Mode no Login:** Adicionado seletor de tema na tela de acesso.

### Ajustado
- **Estabilização Prisma (v6.2.1):** Downgrade técnico para garantir compatibilidade de build no servidor Oracle.
- **Next.js 15 Compatibility:** Refatoração de rotas API para suportar `params` assíncronos.
- **Sincronização de Schema:** Realinhamento das APIs de `Appointments` e `Employees` com o banco de dados.
- **Identidade Visual:** Restauração de Logos e atualização do rodapé institucional.

---

## [0.5.0] - 2026-03-07
### Adicionado
- **CRUD de Profissionais:** Implementada funcionalidade completa de Edição e Exclusão na gestão de equipe.
- **Vínculo com Unidades:** Profissionais agora são obrigatoriamente vinculados a uma Unidade (Franquia/Loja), com suporte a filtros por localidade.
- **Popup de Alertas:** Novo sistema de notificações no cabeçalho do Dashboard, listando alertas de agendamentos e estoque.

### Ajustado
- **Centralização de Configurações:** Removida a aba redundante de Profissionais dentro das Configurações, unificando a gestão na barra lateral.
- **Bump de Versão:** Sistema atualizado para v0.5.0.

---

## [0.4.5] - 2026-03-07
### Adicionado
- **Modo Privacidade:** Implementada máscara de valores (`**`) no dashboard para proteger dados sensíveis. Toggle de "olho" adicionado no cabeçalho.
- **Navegação de Relatórios:** Link direto para Central de Relatórios adicionado na Sidebar.
- **Nova Rota:** Rota independente `/dashboard/relatorios` criada para centralizar a gestão de dados.

---

## [0.4.4] - Higienização de Mock Data (Nicho de Barbearia) - 2026-03-07
### Ajustado
- Remodelação Lexical e Imagética: Substituídos os mocks residuais que não condiziam com o arquétipo principal da Barbearia. Elementos como 'Consulta Pet', 'Rações' e abrangência de 'Restaurante Inteiro' foram expurgados convertidos para Progessivas e Navalhas autênticas.
- Facilitador de Produtos: No Modal de "Adicionar Produto", o placeholder de upload recebeu uma dupla camada que aceita uma URL de imagem colada diretamente, acompanhada do Botão `Pesquisar WEB` – que preenche os metadados do form para invocar a Busca do Google Imagens instantaneamente.

---

## [0.4.3] - Patch de Acessibilidade da Cor Primária (100% Light Mode) - 2026-03-07
### Ajustado
- Contraste Universal de Interfaces Light: A cor primária padrão (`text-primary`), que ditava o tom "Ciano Claro", possuía péssima legibilidade no modo diurno (fundo branco). Um remapeamento estético com varredura em 33 Lógicas do sistema alterou todos os Letreiros e Ícones do app para um Ciano Escurecido (`text-cyan-700`) nas interfaces claras, conservando a beleza original neon apenas sob o fundo noturno.
- Correção de Overflow (Leads): Transição da classe `custom-scrollbar` para `scrollbar-hide` aplicada de forma cirúrgica na Gestão de Leads, extirpando a barra de rolagem horizontal nativa que quebrava o frame, mantendo apenas a interatividade do Mouse/Touch.
- Padronização Hierárquica de Ícones: Varredura de integridade injetou os correspondentes iconográficos (Mapeados da Sidebar) junto as tags `<h1>` de todas as rotas (Com ênfase nas falhas encontradas em Consultas, Feriados e Agenda).

---

## [0.4.2] - Patch de UI e Tematização - 2026-03-07
### Ajustado
- Tabela Feriados e Bloqueios (`app/dashboard/bloqueios`): Os resquícios visuais em tema laranja (Headers, Borders e botões de pesquisa convertidos da UI antiga) foram modernizados usando os tons cinzas do padrão do software.
- Central de Relatório CTA (`app/dashboard/page.tsx`): O Background do Card da direita que englobava o botão "Gerar Relatórios" agora obedece o Tema Light (bg-white e fontes pretas), ativando as cores sólidas e fontes brancas estritamente quando o modo Noturno estiver ligado.

---

## [0.4.1] - Patch de Layout do Dashboard - 2026-03-07
### Ajustado
- Na visão `app/dashboard/page.tsx`, a lista de "Próximos Horários" foi limitada de cinco para três listagens mockadas, pareadas simetricamente à altura do Bloco CTA ("Gerar Relatórios") adjacente, eliminando o espaço vazio e a necessidade de scroll nos Pcs.

---

## [0.4.0] - Novo Dashboard e Central de Relatórios - 2026-03-07
### Adicionado
- **Faixa de Indicadores (Painel Rápido):** O antigo formato estendido do Gráfico e blocos colossais foi dizimado da Visão Geral (`app/dashboard`). Agora abrimos um Layout Clean de 6 Cards Diretos (*Resultado, Receita, Despesa, Agendamentos, Presença Online e Atendimentos*) com setas verdes/vermelhas orientando métricas de Mês em Vigência vs Mês Passado.
- **Central de Relatórios:** Criado ecossistema modal Overlap que domina 100% da tela do Lojista ao clicar no CTA de *Gerar Relatório*, listando num Switch lateral para Desktop e Horizontal no Celular todas as 5 Categorias da Arquitetura (*Agenda, Cadastro de Clientes, Bens e Estoque, Matriz Financeira e Comissão de Profissionais*).
- **Lista de Documentos:** Incorparados mais de 10 Relatórios oficiais em botões clickáveis `active` e mais 4 sugestões descritivas `disabled` identificadas por uma Tag "Ideia Futura/Em breve". 

---

## [0.3.1] - Patch de Navbar Mobile - 2026-03-07
### Fixed
- Correção de responsividade do Navbar público (`app/page.tsx`): Removida a classe acidental `hidden` (no breakpoint sm) que desaparecia com os botões "Cadastrar-se" e "Login" do topo da tela em celulares, tornando o onboarding de clientes inacessível em certas dimensões. Refatorado os botões com layout fluído `text-xs py-1.5` nas telas estreitas.

---

## [0.3.0] - Módulo de Captura e Retenção - 2026-03-07
### Adicionado
- **Gestão de Clientes (`app/dashboard/clientes`):** Listagem robusta contendo histórico, contato direto por WhatsApp, status VIP/Frequente e contagem atrelada de visitas confirmadas e faltas.
- **Inventário de Produtos (`app/dashboard/produtos`):** View em Grid destacando as capas dos Produtos a serem vendidos com monitoramento ao vivo de Baixo Estoque (`AlertTriangle` caso < 5 unid) e esgotamentos (`0 unid`). Contadores monetários inclusos no Topo.
- **Captura de Leads (`app/dashboard/leads`):** Funil de Vendas (Kanban) simples com origens Mockadas (`Instagram`, `WhatsApp`, `Google Ads`), focado no pequeno empreendedor arrastar o interessado até o agendamento final sem complicação do CRM Clássico.
- **SQL Data Pipeline (`tb_produtos`, `tb_leads`):** Criado comitê de persistência em banco via Documento DDL `manutencao/banco_de_dados/003_clientes_produtos_leads.sql` acatando a Regra estrita das Skills do Projeto.

---

## [0.2.1] - Patch de Layout Dark Mode - 2026-03-07

## [0.2.0] - Módulo de Profissionais e Serviços - 2026-03-07
### Adicionado
- **Gestão de Serviços:** Nova tela `/dashboard/servicos` contendo tabela detalhada (Preço e Promoção) com 10+ Mocks catalogados da Estética para agilizar criação, acoplada em formulário dinâmico.
- **Gestão de Equipe (Profissionais):** Novo tela `/dashboard/profissionais` para controle de funcionários, constando Foto de Perfil (Avatar Mock), Especialidade, Trabalhos e Horários da semana.
- **Estruturação de Banco Remota:** Script SQL de Migração (DDL) mapeado preventivamente para `manutencao/banco_de_dados/002_cadastros_profissionais_servicos.sql` integrando a `Regra 3` do Padrão Front-End.

---

## [0.1.0] - 2026-03-07
### Adicionado
- Date Picker Horizontal nativo e responsivo no "Passo 3" do Formulário Publico.
- Integração Visual da regra de **Dias Bloqueados (Atestados / Feriados)** inutilizando horários na Home.
- Painel "Consulta Agendamentos" (`/dashboard/consulta`) com filtros avançados e Exportação local.
- Painel Moderação "Feriados / Ausências" (`/dashboard/bloqueios`) com Modal CRUD contendo Filtro de Profissionais individuais para atestados.
- Links `SearchCheck` e `CalendarOff` integrados à Sidebar de Navegação do Parceiro.

---

## [0.1.1] Patch de Estabilidade
### Fixed
- Correção Crítica: Tailwind Classes fragmentadas em React Template Literals ocasionando layout quebrado e ocultação sumária da Grid de "Empresas em Destaque" no app público (`app/page.tsx`).
- Correção de cor de constraste (`bg-primary`) que feria os padrões de legibilidade de inputs no tema claro (Aplicado em Select de `Bloqueio`).

Todas as mudanças relevantes deste marketplace de estética serão registradas aqui.

O versionamento segue o padrão MAJOR.MINOR.PATCH,
com política interna de fases Alpha, Beta e Produção.

---

## [0.0.3] - 2026-03-06
**Fase:** Alpha  
**Tipo de release:** Patch  
**Resumo:** Ajuste do selo de Copyright em todos os rodapés.

### Changed
- Modificado o texto global do componente `<Footer />` para exibir o selo corporativo *EFF5 reFresh • eFFiciency • Freedom*.

---

## [0.0.2] - 2026-03-06
**Fase:** Alpha  
**Tipo de release:** Patch  
**Resumo:** Componentização Global do Footer e formulação da página central "Fale Conosco".

### Added
- Criação e estruturação da rota de formulários `/fale-conosco` estanciada explicitamente num modelo minimalisa.
- Separação e inserção de link permanente do `<Footer/>` num escopo global independente.

### Changed
- Arquiteturas (`app/dashboard`, `app/cliente`, `app/login`, `app/register`, `app/page.tsx`) readequadas (uso de `flex-col` dinâmico e `mt-auto`) para que o Footer Component repouse isoladamente sem quebrar a proporção da Sidebar de gestão.

---

## [0.0.1] - 2026-03-06
**Fase:** Alpha  
**Tipo de release:** Patch  
**Resumo:** Fundação funcional do projeto com Dashboards, Perfis e Busca inicial.

### Added
- Cadastro simplificado com diferenciação cliente/parceiro (CPF/CNPJ).
- Catálogo de Serviços iterativo na Home.
- Modal de Checkout / Agendamento.
- Dúvidas / Observação assíncrona para o Dashboard de Parceiro.
- Botões de Redirecionamento de WhatsApp para Suporte a Leads e Clientes.
- Dashboard Cliente (`/cliente`) contendo Status de próximos passeios e recibos.
- Footer Institucional básico (Redes e Versão).

### Changed
- Refatorado sistema de Layout (`app/dashboard/layout.tsx`) para Sidebar Retraída por Padrão (Foco no Mobile App e UX Minimalista).
- Tema "Light Mode" forçado como global no default startup (`providers.tsx`).
- Ajustada legibilidade do sistema: Textos primários de botões azuis transformados em Black e Bold (`text-black font-bold`).

### Removed
- Pastas e rotas duplicadas de registro de parceiros (`/business`, `/client`).
- Removed Mock Data não aderentes ao nicho Beauty&Care (Ex: "Oficina do Toninho").
