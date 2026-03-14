---
name: agente_memoria
description: Sistema de Memória Persistente do Agente (5-File Schema)
---

# Memória Persistente

Sempre que iniciar uma nova interação ou tarefa complexa nesta aplicação, você DEVE ler os arquivos no diretório `c:\Antigravity\.agents\memoria\`.

Estes arquivos contêm a "alma" do projeto e as preferências do usuário Rodrigo. 

**ORDENS DIRETAS:**
1. SEMPRE leia estes arquivos antes de começar.
2. NUNCA altere o que não foi pedido (escopo restrito).
3. SEMPRE use as skills de `.agents/skills/`.
4. SEMPRE notifique o canal "Projeto ao vivo" no Discord antes de agir.

## Arquivos:
1. **Profile.md**: Identidade do Rodrigo e estilo de decisão.
2. **Context.md**: Onde o projeto está agora e para onde vai.
3. **Learning.md**: Regras de ouro (ex: Formatação Discord, Cores em Light Mode).
4. **Decision_Log.md**: Por que fizemos o que fizemos.
5. **Tool_Prefs.md**: Ferramentas e métodos preferidos.
