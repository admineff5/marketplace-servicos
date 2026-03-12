---
name: design_premium
description: Padrões de Design Premium, UI moderna e estética visual de alto nível para interfaces web profissionais.
---

# Design Premium & UI/UX Moderna

Este skill define os padrões visuais obrigatórios para que o AgendeJá tenha aparência profissional e premium.

---

## 1. Filosofia de Design

> [!IMPORTANT]
> O usuário deve ficar **impressionado** ao primeiro olhar. Interfaces genéricas ou "básicas" são INACEITÁVEIS.

- **Premium First:** Cada tela deve parecer um produto pago de alta qualidade.
- **Mobile-First:** Sempre projetar para mobile antes de desktop.
- **Consistência:** Usar Design Tokens (cores, espaçamentos, tipografia) em todo o projeto.

---

## 2. Paleta de Cores

### Modo Escuro (Padrão do Dashboard)
| Elemento | Cor | Nota |
|----------|-----|------|
| Background Base | `#0a0a0a` | Nunca usar preto puro `#000` |
| Card/Surface | `#111` ou `#111111` | Superfícies elevadas |
| Border | `border-gray-800` | Bordas sutis |
| Text Primary | `text-white` | Títulos e destaques |
| Text Secondary | `text-gray-400` | Descrições e labels |
| Accent/Primary | `text-primary` / `bg-primary` | Cyan/Turquesa do tema |

### Modo Claro
| Elemento | Cor |
|----------|-----|
| Background | `bg-gray-50` |
| Card | `bg-white` |
| Border | `border-gray-100` ou `border-gray-200` |
| Text Primary | `text-gray-900` |

### Regra de Contraste
> [!CAUTION]
> Botão com `bg-primary` DEVE usar `text-black font-bold`. Texto branco sobre cyan destrói acessibilidade.

---

## 3. Tipografia

- **Font:** Geist Sans (já configurada no projeto).
- **Títulos:** `text-3xl font-extrabold tracking-tight` ou `text-4xl`.
- **Subtítulos:** `text-lg font-bold`.
- **Labels:** `text-[10px] font-bold uppercase tracking-widest text-gray-400`.
- **Body:** `text-sm` ou `text-base`.

---

## 4. Componentes Premium

### Cards
```
rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm
bg-white dark:bg-[#111]
p-6 sm:p-8
```

### Botões Primários
```
bg-primary text-black font-bold py-3 px-6 rounded-xl
hover:bg-cyan-400 transition-all
shadow-[0_4px_15px_rgba(0,255,255,0.2)]
```

### Inputs
```
bg-gray-50 dark:bg-black
border border-gray-100 dark:border-gray-800
rounded-xl px-4 py-3 text-sm
focus:border-primary focus:ring-1 focus:ring-primary outline-none
```

### Badges / Tags
```
text-[10px] bg-primary/20 text-primary px-2 py-0.5
rounded-full font-bold uppercase tracking-tighter
```

---

## 5. Animações e Micro-interações

- **Fade-in de página:** `animate-fade-in` na div principal.
- **Hover em cards:** `hover:border-primary/50 transition-all`.
- **Botões:** `hover:bg-cyan-400 transition-all` com shadow glow.
- **Grupos:** Usar `group` + `group-hover:opacity-100` para ações contextuais.
- **Loading States:** `animate-pulse` em esqueletos de carregamento.

---

## 6. Glassmorphism (Uso Moderado)

Aplicar APENAS em overlays, modais e headers fixos:
```css
backdrop-blur-md
bg-white/80 dark:bg-black/80
border border-white/20
```

---

## 7. Responsividade

| Breakpoint | Uso |
|------------|-----|
| Mobile (`< sm`) | Layout em coluna, padding `px-4` |
| Tablet (`sm`) | Grid 2 colunas, padding `px-6` |
| Desktop (`lg`) | Grid 3+ colunas, padding `px-8` |

- Sidebars iniciam **retraídas** (`collapsed`).
- Listas horizontais usam `overflow-x-auto scrollbar-hide`.
- Touch targets mínimo `py-2.5` ou `py-3`.

---

## 8. Modais

```
fixed inset-0 z-[100]
flex items-center justify-center p-4
bg-black/60 backdrop-blur-sm
animate-in fade-in duration-200
```
Conteúdo do modal:
```
bg-white dark:bg-[#111]
border border-gray-200 dark:border-gray-800
rounded-[32px] w-full max-w-lg p-8 shadow-2xl
```

---

## 9. Ícones

- **Biblioteca:** `lucide-react` (OBRIGATÓRIO).
- Sempre desestruturar junto com os ícones já importados.
- Tamanhos: `w-4 h-4` (inline), `w-5 h-5` (botões), `w-8 h-8` (destaque).

---

## 10. Anti-Padrões (PROIBIDO)

- ❌ Cores genéricas (vermelho puro, azul puro, verde puro)
- ❌ Fontes padrão do navegador (sempre usar Geist)
- ❌ Bordas quadradas (`rounded-none` ou `rounded-sm`)
- ❌ Sombras pesadas (`shadow-lg` sem propósito)
- ❌ Placeholders genéricos (usar `generate_image` se necessário)
- ❌ Layouts estáticos sem hover/transição
