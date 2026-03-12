---
name: seguranca_cibernetica
description: Segurança Cibernética completa para aplicações web, baseada no OWASP Top 10 2025, proteção de sessão, cookies, CSRF, XSS e hardening de servidor.
---

# Segurança Cibernética — Guia Completo

Este skill cobre segurança em TODAS as camadas: aplicação, servidor, rede e dados.

---

## 1. OWASP Top 10 — 2025

> [!CAUTION]
> Toda feature nova DEVE ser avaliada contra estas categorias antes de ir pra produção.

| # | Risco | Impacto no AgendeJá |
|---|-------|---------------------|
| A01 | **Broken Access Control** | Proteger rotas `/cliente`, `/dashboard` via Middleware |
| A02 | **Security Misconfiguration** | Headers HTTP, variáveis de ambiente, Nginx |
| A03 | **Software Supply Chain** | `npm audit`, lockfile, dependências atualizadas |
| A04 | **Cryptographic Failures** | Hashing de senhas (bcrypt), HTTPS obrigatório |
| A05 | **Injection** | Prisma ORM protege contra SQL Injection por padrão |
| A07 | **Authentication Failures** | Session cookie seguro, expiração, rate limiting |
| A10 | **Mishandling Exceptions** | Try/catch em toda API, nunca expor stack traces |

---

## 2. Autenticação & Sessão

### Cookies Obrigatórios
```ts
cookieStore.set("auth_session", value, {
    httpOnly: true,     // ← Impede acesso via JavaScript (anti-XSS)
    secure: true,       // ← Apenas HTTPS
    sameSite: "lax",    // ← Anti-CSRF
    maxAge: 7 * 24 * 60 * 60, // 7 dias
    path: "/",
});
```

### Regras de Sessão
- **Nunca** armazenar dados sensíveis em `localStorage` (vulnerável a XSS).
- **Sempre** usar `httpOnly` cookies para tokens de sessão.
- **Regenerar** session ID após login ou elevação de permissão.
- **Implementar** timeout de inatividade (15min para admin, 7 dias para cliente).

### Logout Seguro
```ts
// Limpar cookie no servidor
cookieStore.delete("auth_session");
// Redirecionar no cliente
window.location.href = "/";
```

---

## 3. Proteção de Rotas (Middleware)

```ts
// middleware.ts — Regras obrigatórias
export const config = {
    matcher: [
        '/dashboard/:path*', '/dashboard',
        '/cliente/:path*', '/cliente',
        '/login', '/register'
    ],
};
```

**Regras:**
- Rotas base E sub-rotas devem estar no matcher.
- Usuário sem sessão → redirecionar para `/login`.
- Usuário logado acessando `/login` → redirecionar para área logada.
- Nunca confiar apenas no front-end para proteção de rota.

---

## 4. Prevenção de XSS (Cross-Site Scripting)

| Vetor | Defesa |
|-------|--------|
| Input do usuário renderizado | React escapa por padrão — **nunca** usar `dangerouslySetInnerHTML` |
| URLs manipuladas | Validar e sanitizar antes de usar em `href` |
| Dados do banco na UI | Escapar HTML antes de renderizar |
| CDN externo | Usar `integrity` e `crossorigin` em scripts |

### Content Security Policy (CSP)
```ts
// next.config.ts — Headers de segurança
const securityHeaders = [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-XSS-Protection', value: '1; mode=block' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
];
```

---

## 5. Prevenção de CSRF (Cross-Site Request Forgery)

- **SameSite cookies** são a primeira linha de defesa (já configurado).
- **Server Actions** do Next.js 15 têm proteção CSRF nativa.
- **API Routes** devem validar `Origin` ou `Referer` header para operações mutantes.
- **Nunca** usar GET para operações que alteram dados (DELETE, UPDATE).

---

## 6. Senhas e Dados Sensíveis

### Hash de Senhas
```ts
// Implementação futura — bcrypt
import bcrypt from "bcrypt";
const hash = await bcrypt.hash(password, 12);
const isMatch = await bcrypt.compare(password, hash);
```

### Dados Pessoais (LGPD)
- CPF: Nunca retornar completo — usar máscara `***.***.***-XX`.
- Cartão: Armazenar APENAS últimos 4 dígitos + bandeira.
- Senhas: **Nunca** logar, retornar em API, ou enviar por e-mail.
- Endereço: Criptografar se necessário para compliance futuro.

---

## 7. Segurança do Servidor (OCI)

### Firewall e Rede
- Portas abertas: apenas 80 (HTTP), 443 (HTTPS), 22 (SSH).
- PostgreSQL: **nunca** expor porta 5432 à internet — acesso via SSH tunnel.
- Bastion Session: Sessões expiram em 3h — renovar via Console OCI.

### SSH
- Usar chaves ED25519 ou RSA 4096-bit.
- **Nunca** commitar chaves privadas no Git (`.gitignore` configurado).
- Permissões da chave: `chmod 600 key.pem` (Linux) ou `fix_key_perms.ps1` (Windows).

### Atualizações
- Manter Node.js na versão LTS.
- Rodar `npm audit` periodicamente.
- Atualizar Prisma e Next.js quando houver patches de segurança.

---

## 8. Segurança do Banco de Dados

- **Princípio do menor privilégio:** Usuário do banco (`usrdbsite`) só tem acesso ao `dbsite`.
- **Backups:** Configurar backup automático (cron + pg_dump) semanalmente.
- **Queries parametrizadas:** Prisma faz isso por padrão — nunca usar `$queryRawUnsafe` com input do usuário.
- **Logs:** Desativar query logging verboso em produção.

---

## 9. Checklist de Segurança Pré-Deploy

- [ ] Cookies com `httpOnly`, `secure`, `sameSite`
- [ ] Middleware protegendo TODAS as rotas privadas
- [ ] Nenhum segredo hardcoded no código (usar `.env`)
- [ ] `.gitignore` cobrindo chaves, configs sensíveis e `.env`
- [ ] `npm audit` sem vulnerabilidades críticas
- [ ] Headers de segurança configurados no Nginx
- [ ] Logout limpa cookies no servidor E cliente
- [ ] Dados sensíveis mascarados nas APIs (CPF, cartão)
