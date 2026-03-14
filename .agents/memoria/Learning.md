# Hard Rules & Insights

## Design & UI (Premium AgendaJá)
- **Contrast Rule:** 
  - Dark Mode: Use Cyan/Neon primary colors.
  - Light Mode: **NEVER** use neon cyan on white backgrounds. Use `text-cyan-700` (Petrol) for icons, links, and buttons to ensure premium look and accessibility.
- **Imagery:** 
  - Showcase must use real screenshots, never placeholders.
  - Use `object-cover` for business/service photos to ensure full framing.
  - Backgrounds: Use glassmorphism (`backdrop-blur`) and deep grays (`#0a0a0a`) for dark mode cards.
- **Current Version:** v0.9.34
- **Main Goal:** Marketplace platform for beauty and services (Barbearia archetype).
- **Layout Previews:** 
  - NUNCA altere a estrutura principal do site (Layout) diretamente para encaixar novidades sem antes apresentar a proposta no arquivo de plano (`implementation_plan.md`) e aguardar a aprovação do Rodrigo.

## Fluxo de Trabalho & Escopo
- **Foco Estrito:** Siga **apenas** o que foi solicitado pelo Rodrigo. Não faça alterações "por conta própria" ou melhorias não requisitadas que fujam do escopo da tarefa atual.
- **Git:** Commit frequentemente com mensagens semânticas (feat, fix, style).
- **Skills Primeiro:** Antes de qualquer implementação técnica, consulte e siga as instruções contidas na pasta de skills (`.agents/skills/`).

## Technical Patterns
- **Middleware:** Auth bypasses (like for `/register`) should be placed at the very top of the function to avoid redundant session checks.
- **Next.js 15:** Use async params in routes.
