---
name: backend_nextjs_prisma
description: Melhores práticas de Backend com Next.js 15, Prisma ORM e PostgreSQL para APIs robustas e seguras.
---

# Backend: Next.js 15 + Prisma ORM

Este skill define as regras obrigatórias para todo código de backend no projeto AgendeJá.

---

## 1. Prisma Client — Singleton Obrigatório

> [!CAUTION]
> NUNCA instancie `new PrismaClient()` diretamente em arquivos de rota. Use SEMPRE o singleton de `@/lib/prisma`.

```ts
// ✅ Correto
import prisma from "@/lib/prisma";

// ❌ Proibido
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
```

---

## 2. Estrutura de API Routes (App Router)

Cada rota API deve seguir esta anatomia:

```ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

// 1) Helper de autenticação
async function getUserId(): Promise<string | null> { ... }

// 2) Handler principal com try/catch
export async function GET() {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    try {
        const data = await prisma.model.findMany({
            where: { userId },
            select: { id: true, name: true },  // ← Sempre usar select
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(data);
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
```

---

## 3. Parâmetros Dinâmicos (Next.js 15)

> [!IMPORTANT]
> No Next.js 15, `params` é uma **Promise**. Sempre use `await params`.

```ts
// ✅ Correto
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    ...
}

// ❌ Quebra o build
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params; // ← Erro de tipo
}
```

---

## 4. Validação de Dados

- **Sempre** valide campos obrigatórios antes de inserir no banco.
- Retorne `400 Bad Request` para dados inválidos, nunca `500`.
- Futuramente, integrar `zod` para validação tipada.

```ts
const { name, email } = body;
if (!name || !email) {
    return NextResponse.json({ error: "Nome e email são obrigatórios" }, { status: 400 });
}
```

---

## 5. Segurança

1. **Autenticação:** Toda rota protegida DEVE verificar o cookie `auth_session` antes de processar.
2. **Autorização:** Queries devem SEMPRE filtrar por `userId` para impedir acesso cruzado.
3. **Senhas:** Usar `bcrypt` para hash (migração futura — atualmente comparação direta).
4. **Dados Sensíveis:** CPF nunca retornado completo ao front-end. Usar máscara.

---

## 6. Performance

- Use `select` em vez de retornar todos os campos.
- Use `take` + `skip` para paginação em listas grandes.
- Adicione `@index` no Prisma para campos frequentemente filtrados.
- Desative logs verbosos em produção.

---

## 7. Migrations e Schema

> [!WARNING]
> NUNCA altere o banco diretamente. Sempre use `prisma db push` ou `prisma migrate dev`.

1. Após alterar `schema.prisma`, rodar `npx prisma generate` localmente.
2. No servidor: `git pull` → `npx prisma generate` → `npx prisma db push` → `npm run build`.
3. Documentar mudanças no `manutencao/dicionario_banco.md`.
