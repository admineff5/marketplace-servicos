---
name: padroes_frontend
description: Retém todo o conhecimento obrigatório de Design, UI/UX, Boas Práticas Estéticas e Versionamento rigoroso do Marketplace de Estética.
---

# Padrões Obrigatórios de Front-End e UI/UX

Você está atuando no código do Marketplace de Agendamentos- O App AgendeJá usa o pacote de Ícones **`lucide-react`** ativamente em todos os componentes (Navbar, Sidebar, Actions e Categorias do Início). Sempre que injetar novo ícone, lembre de desestruturar junto com os já importados de lá.
- Siga sempre o Design Pattern mobile-first com flexcols antes de quebrar para colunas md e lg.

---
## 0. MEMÓRIA OPERACIONAL E NOTIFICAÇÕES (OBRIGATÓRIO)

> [!IMPORTANT]
> **O Antigravity DEVE seguir estas etapas de comunicação em TODA interação.**

1. **Canal Live (#ao-vivo):** 
   - Sempre que realizar QUALQUER alteração ou conclusão de tarefa, envie uma mensagem resumida.
   - Comando: `python scripts/discord_notifier.py live "Resumo do que foi feito"`

2. **Canal Changelog (#changelog):**
   - Toda atualização de funcionalidade ou bugfix exige preencher o `CHANGELOG.md` e sincronizar.
   - Comando: `python scripts/discord_notifier.py changelog "Conteúdo da nova versão"`

3. **Canal Checklist (#checklist):**
   - Ao atualizar a checklist de tarefas (task.md), sincronize o estado atual.
   - Comando: `python scripts/discord_notifier.py checklist "Conteúdo da checklist atualizada"`

---
## 5. REGRAS ESTRITAS DE ESTABILIDADE E CHANGELOG

> [!CAUTION]
> **PROIBIDO QUEBRAR COMPONENTES PÚBLICOS OU IGNORAR O FLUXO DE VERSÕES.**

1. **Responsabilidade sobre Componentes Core:**
   - Durante atualizações de páginas primárias (como a `app/page.tsx` contendo o Carrinho/Checkout), é **ESTRITAMENTE PROIBIDO** quebrar a renderização, fragmentar literais de classes Tailwind (ex: colocar `flex - col` em vez de `flex-col`) ou apagar partes funcionais que já operavam bem sem autorização do usuário. 
   - Sempre certifique-se de que nenhum resultado visual no DOM vai desaparecer com a sua intervenção. Tudo deve renderizar como antes, com os incrementos adicionados logicamente.

2. **Gestão do CHANGELOG.md e Rodapé:**
   - Se os pedidos alterarem funcionalidades, o arquivo `CHANGELOG.md` **DEVE** ser atualizado relatando o que foi mudado/adicionado. NUNCA pule o versionamento ou a escrita do Changelog apos edicionar as regras vitais do sistema.
   - **OBRIGATÓRIO:** Toda vez que a versão subir no Changelog, você DEVE ir no componente de Rodapé Global (`app/components/Footer.tsx`) e atualizar a tag visual (ex: de `<span className="text-primary font-bold ml-1">v0.1.0</span>` para a nova versão). O usuário precisa ver essas duas coisas sincronizadas.

3. **Gestão de Dados e Schemas de Banco (Formulários):**
   - **SEMPRE** que um novo formulário for criado ou um campo novo for adicionado a um formulário existente, você deve documentar essa inserção de dados.
   - Modifique ou crie um arquivo de script DDL SQL (ex: `001_schema_inicial.sql` ou `002_add_coluna_X.sql`) contendo a query SQL necessária para aplicar essa alteração (CREATE TABLE, ALTER TABLE, etc).
   - O arquivo do banco de dados obrigatoriamente deve ser salvo e registrado no repositório dentro do diretório `manutencao/banco_de_dados/`.

_Se o usuário pedir algo que conflite diretamente com as cores dessa folha ou a estabilidade, cumpra a ação como Assistente IA, mas você DEVE ATUALIZAR ESSE MANUAL na mesma interação._ Você está atuando no código do Marketplace de Agendamentos (AgendeJá). SEMPRE que for alterar layouts, inserir componentes, mudar cores, você DEVE aplicar rigorosamente as regras abaixo. NUNCA viole as diretrizes sem permissão explícita do usuário.

## 1. Princípio da Não-Regressão ("Não quebrar o que já funciona")
- O projeto atual já possui estabilidade. Se uma nova *feature* ou botão pedir reestruturação de uma lógica fundamental *core*, **pare e faça perguntas de verificação** ao usuário antes de modificar grandes blocos silenciosamente.
- Valide o código (`npm run build`) para revisar possíveis quebras em cascata de design (ex: um margin que quebrou a responsividade de um header).

## 2. Paleta de Cores & Temas (Light e Dark Mode)
- As cores base são gerenciadas via Tailwind: Modos escuros prefixados por `dark:` (ex: `dark:bg-[#111]`). E modo claro sem prefixo.
- **Regra de Cores de Destaque:**
    - **Modo Dark:** Utilizar o ciano neon (`text-primary` / `bg-primary`).
    - **Modo Light:** Utilizar o azul "Petróleo" (`text-cyan-700` / `bg-cyan-700` / `#0e7490`) em substituição ao ciano neon para garantir legibilidade e sofisticação.
- Conserve **sempre** os dois esquemas suportados.

## 3. A Regra do Contraste (Botão Azul = Texto Preto Negrito)
Sempre que você usar a cor primária (`bg-primary`), é **estritamente PROIBIDO** o uso de fontes brancas, cinzas ou de baixos pesos, pois destrói a acessibilidade.
- **Formatação Correta:** `className="bg-primary text-black font-bold ..."`

## 4. Responsividade - Mobile App First
Lembre-se: Este site também é um App PWA (WebView).
- Menus Laterais (Sidebars) iniciam **retraídos** (`collapsed`)
- Elementos Interativos devem usar scroll horizontal (`overflow-x-auto scrollbar-hide`) ao invés de quebrar (wrap) verticalmente infinitamente se couber num carrossel.
- Clicáveis (*Touch Targets*) precisam ser grandes (`py-2`, `py-3`).

---

# Versionamento e Atualização de Histórico (Changelog)

Sempre que concluir um pacote de tarefas ou resolver bugs significativos, atualize obrigatoriamente arquivos baseados no **Versionamento Semântico Adaptado**:

## Políticas do `CHANGELOG.md`
- **Faixas:** `0.0.x` (Alpha Técnico), `0.1.x` (Alpha Funcional), `0.5.x` (Beta). O projeto nasce no `0.0.1`.
- **Incremental (Major.Minor.Patch):**
    - `Patch`: Ajustes de Layout, textos, validações de performance e bugfix sem mudar macro-cenário.
    - `Minor`: Novas Features, Dashboards, Fluxos grandes inteiros que não quebrem as velhas rotas.
    - `Major`: Virada de arquitetura total ou quebra de APIs obsoletas.

### Template Obrigatório a se Adicionar
Ao atualizar o CHANGELOG.md, a anatomia de registro deve estar assim, e o correspondente visual (`Versão X.Y.Z`) deve ser idêntico no Footer (`app/page.tsx`):
```md
## [X.Y.Z] - AAAA-MM-DD
**Fase:** Alpha | Beta | Produção  
**Tipo de release:** Patch | Minor | Major  
**Resumo:** Descreva em uma frase o objetivo principal.

### Added
- [Itens novos adicionados]
### Changed
- [Mudanças arquiteturais ou visuais]
### Fixed
- [Bugs mortos]
### Removed
- [Itens lixados]
```
