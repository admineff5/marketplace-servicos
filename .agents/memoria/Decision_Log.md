# Decision Log

## Decisões de Arquitetura

## [v0.9.36] - 2026-03-14: Sistema de Créditos e Cancelamento
- **Problema:** Clientes precisam cancelar agendamentos e reaver o valor pago.
- **Decisão:** Criar um campo `balance` no `User` para armazenar créditos. O cancelamento atualiza o status para `CANCELLED` (em vez de deletar para manter histórico auditável) e adiciona o valor do serviço ao saldo do cliente.
- **Risco:** Necessário garantir que o saldo seja consumível em agendamentos futuros.

## [v0.9.35] - 2026-03-14: Upload real de arquivos
- **Problema:** O sistema atual de upload de arquivos é um mock.
- **Decisão:** Implementar upload real de arquivos para o S3, com validação de tipo e tamanho.
- **Risco:** Complexidade na integração com S3 e tratamento de erros.

## Architecture: Auth Redirection (v0.9.31)
- **Decision:** Moved `/register` bypass to the absolute beginning of `middleware.ts`.
- **Reason:** Client users were being trapped in session-check redirections even when trying to access the registration page.
- **Outcome:** Total freedom of movement for all roles to the registration flow.

## UI:
- Dynamic Showcase on the Landing Page (Light/Dark support).
- Avatar and Profile Photo Upload feature (v0.9.34).
- Wallet/Balance concept introduced for credit management (v0.9.36).
- **Decision:** Implemented client-side theme detection (`next-themes`) for home showcase images.
- **Reason:** Ensuring the landing page visuals match the user's active mode (Light/Dark).
- **Outcome:** Premium first impression regardless of user preference.

## Branding: Petrol Tone (v0.9.5)
- **Decision:** Switch from Neon Blue to Cyan-700 in Light Mode.
- **Reason:** Accessibility was poor, and the blue felt "cheap" compare to the dashboard petrol tone.
## [v0.9.37] - 2026-03-14: Regra Mista de Botões (Light Mode)
- **Problema:** Botão `bg-primary` (Ciano Claro) ficava berrante ou com pouco contraste no Light Mode se fosse sólido.
- **Códigos e Classes das Regras:**
  1. **Option 2 - Botões CTA (Sólido):**
     * **Light:** `bg-cyan-700 text-white hover:bg-cyan-800` (Azul Petróleo).
     * **Dark:** `dark:bg-primary dark:text-black dark:hover:bg-cyan-400` (Neon Blue).
  2. **Option 1 - Badges, Filtros e Hover (Translúcidos):**
     * **Light:** `bg-cyan-500/10 text-cyan-700 border-cyan-600/30`
     * **Dark:** `dark:bg-primary/20 dark:text-primary dark:border-primary/30`
  3. **Insumos de Input e Textos:**
     * **H3 Hover:** `group-hover:text-cyan-700 dark:group-hover:text-primary`
     * **Focus Ring:** `focus:ring-cyan-600 focus:border-cyan-600 dark:focus:ring-primary dark:focus:border-primary`
- **Resultado:** Layout 100% legível, estética "Smooth" e coerência visual em todo o site.
