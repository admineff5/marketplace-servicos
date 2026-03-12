# Memória Operacional: Regras de Notificação Discord

Este documento serve como âncora de memória para o Antigravity. **NUNCA IGNORE ESTA REGRAS.**

## Comportamento Esperado em Cada Interação

1. **Notificar o Live:** Toda vez que terminar uma tarefa ou fizer algo relevante, rode:
   `python scripts/discord_notifier.py live "Mensagem"`

2. **Changelog:** Se mudar o código, atualize o `CHANGELOG.md` e rode:
   `python scripts/discord_notifier.py changelog "Trecho do changelog"`

3. **Checklist:** Se mudar a lista de tarefas, rode:
   `python scripts/discord_notifier.py checklist "Nova checklist"`

---

*Configurado em 12/03/2026 para garantir persistência entre sessões.*
