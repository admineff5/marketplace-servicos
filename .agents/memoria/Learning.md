# Hard Rules & Insights

## Design & UI (Premium AgendaJá)
- **Contrast Rule:** 
  - Dark Mode: Use Cyan/Neon primary colors.
  - Light Mode: **NEVER** use neon cyan on white backgrounds. Use `text-cyan-700` (Petrol) for icons, links, and buttons to ensure premium look and accessibility.
- **Imagery:** 
  - Showcase must use real screenshots, never placeholders.
  - Use `object-cover` for business/service photos to ensure full framing.
  - Backgrounds: Use glassmorphism (`backdrop-blur`) and deep grays (`#0a0a0a`) for dark mode cards.
- **Layout Previews:** 
  - NUNCA altere a estrutura principal do site (Layout) diretamente para encaixar novidades sem antes apresentar a proposta no arquivo de plano (`implementation_plan.md`) e aguardar a aprovação do Rodrigo.

## Fluxo de Trabalho & Escopo
- **Foco Estrito:** Siga **apenas** o que foi solicitado pelo Rodrigo. Não faça alterações "por conta própria" ou melhorias não requisitadas que fujam do escopo da tarefa atual.
- **Skills Primeiro:** Antes de qualquer implementação técnica, consulte e siga as instruções contidas na pasta de skills (`.agents/skills/`).

## Protocolo Discord
- **Projeto ao Vivo (WH_LIVE):** Antes de iniciar qualquer execução técnica significativa, envie um resumo do que será feito para o canal "Projeto ao vivo".
- **Sincronização de Changelog (WH_CHANGELOG):** Mantenha o fluxo de sincronização contínua. O último enviado foi o v0.9.32.
- **Formatação:** Sempre utilize o padrão completo detalhado (Fase, Tipo, Resumo, Added/Changed/Fixed com `•`).

## Technical Patterns
- **Middleware:** Auth bypasses (like for `/register`) should be placed at the very top of the function to avoid redundant session checks.
- **Next.js 15:** Use async params in routes.
