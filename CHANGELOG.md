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
