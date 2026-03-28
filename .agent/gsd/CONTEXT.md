# Context: Project Guidelines 📜🎨

Este documento define as regras de ouro e o "Style Guide" do projeto para garantir consistência total.

---

## 🎨 UI/UX Standards (Estética Premium)
- **Tema**: Dark Mode Minimalista com detalhes Esmeralda (`#10b981`) ou Dourado.
- **Purple Ban**: **PROIBIDO** usar roxo ou tons de violeta sem autorização expressa.
- **WOW Factor**: Transições suaves, micro-animações (CSS/Framer) e tipografia moderna (Outfit ou Inter).
- **Cards**: Glassmorphismo suave (blur + transparência) em áreas de destaque.

---

## 💻 Coding Patterns
- **Next.js 15**: Use sempre Server Components por padrão.
- **Clean Code**: SRP (Single Responsibility) e DRY (Don't Repeat Yourself).
- **Prisma**: Operações atômicas e tratamento de erro robusto.
- **Direct Logic**: Evite abstrações desnecessárias. Resolva o problema no local mais próximo.

---

## 🤖 AI Protocols
- **Gemini 2.5-Flash**: Modelo padrão para processamento de IA.
- **Baileys**: Única biblioteca autorizada para WhatsApp Socket.
- **GSD Mode**: Sempre priorizar execução e banir placeholders.

---

## 📁 File Structure Conventions
- `/app`: Roteamento e UI.
- `/lib`: Utilidades e Lógica de Negócio.
- `/scripts`: Workers e Tasks de segundo plano.
- `/prisma`: Esquema de dados.
