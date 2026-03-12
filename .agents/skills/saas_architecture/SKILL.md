---
name: saas_architecture
description: Padrões de arquitetura SaaS para marketplace de serviços — multi-tenant, onboarding, billing e escalabilidade.
---

# Arquitetura SaaS — Marketplace de Serviços

Este skill define os padrões arquiteturais para o AgendeJá evoluir como plataforma SaaS escalável.

---

## 1. Modelo Multi-Tenant

O AgendeJá é um marketplace **multi-tenant** onde cada empresa (tenant) opera isoladamente dentro da mesma aplicação.

### Isolamento de Dados
```
Usuário (CLIENT) ──→ Vê apenas seus agendamentos
Empresa (BUSINESS) ──→ Vê apenas seus clientes/serviços/produtos
Admin (futuro) ──→ Acesso cross-tenant para suporte
```

**Regras obrigatórias:**
- Toda query de empresa DEVE filtrar por `companyId` ou `ownerId`.
- Toda query de cliente DEVE filtrar por `userId`.
- **Nunca** retornar dados de outro tenant, mesmo por acidente.

---

## 2. Hierarquia de Papéis (RBAC)

| Role | Acesso | Rota Base |
|------|--------|-----------|
| `CLIENT` | Agendamentos, perfil, pagamentos | `/cliente` |
| `BUSINESS` | Dashboard, serviços, profissionais, agenda | `/dashboard` |
| `ADMIN` (futuro) | Gestão global, métricas cross-tenant | `/admin` |

### Middleware de Autorização
```ts
// Verificar role na sessão antes de servir conteúdo
const { role } = JSON.parse(session.value);
if (pathname.startsWith('/dashboard') && role !== 'BUSINESS') {
    return NextResponse.redirect(new URL('/cliente', request.url));
}
```

---

## 3. Onboarding de Empresas

### Fluxo Ideal (Futuro)
1. **Cadastro** → Coletar dados mínimos (Nome, E-mail, Senha, CNPJ).
2. **Configuração Guiada** → Wizard de 3 passos:
   - Dados da Empresa (Logo, Endereço, Horário)
   - Primeiro Serviço (Nome, Preço, Duração)
   - Primeiro Profissional (Nome, Especialidade)
3. **Ativação** → Empresa aparece na Home automaticamente.

### Princípios
- Reduzir formulários ao mínimo (campos opcionais depois).
- Pré-carregar dados de exemplo para demonstrar funcionalidades.
- Tooltips e micro-animações para guiar o usuário.
- Medir taxa de conclusão do onboarding.

---

## 4. Modelo de Precificação (Billing)

### Planos Sugeridos
| Plano | Preço | Limites |
|-------|-------|---------|
| **Free** | R$ 0 | 1 profissional, 50 agendamentos/mês |
| **Pro** | R$ 49/mês | 5 profissionais, ilimitado, relatórios |
| **Business** | R$ 149/mês | Ilimitado, API, white-label, suporte |

### Arquitetura de Billing
```
┌──────────────┐      ┌─────────────┐      ┌──────────────┐
│  Plano/Tier  │──→   │  Entitlement│──→   │  Feature     │
│  (Subscription)│    │  (Permissões)│     │  (Acesso)    │
└──────────────┘      └─────────────┘      └──────────────┘
```

**Princípios:**
- Separar lógica de billing da lógica de negócio.
- Usar entitlements (permissões) para controlar acesso a features.
- Integrar com gateway de pagamento (Stripe, PagSeguro, Asaas).
- Implementar dunning automático para cobranças falhadas.

---

## 5. API Design para SaaS

### Padrões REST
- `GET /api/services` → Listar (com paginação)
- `POST /api/services` → Criar
- `PUT /api/services/:id` → Atualizar
- `DELETE /api/services/:id` → Excluir

### Paginação
```ts
const page = Number(searchParams.get("page")) || 1;
const limit = Number(searchParams.get("limit")) || 20;
const data = await prisma.service.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: { companyId }
});
```

### Versionamento de API (Futuro)
- `/api/v1/services` para clientes externos.
- Breaking changes = nova versão, manter a antiga por 6 meses.

---

## 6. Escalabilidade

### Curto Prazo (v0.x → v1.0)
- Otimizar queries com `select` e indexes.
- Implementar cache de listagens com `revalidate`.
- Comprimir imagens antes de armazenar.

### Médio Prazo (v1.x)
- CDN para assets estáticos (Cloudflare, OCI Object Storage).
- Rate limiting nas APIs públicas.
- Filas para processamentos pesados (e-mails, relatórios).

### Longo Prazo (v2.x+)
- Microserviços para billing, notificações e relatórios.
- Database read-replicas para queries pesadas.
- Monitoramento com APM (Application Performance Monitoring).

---

## 7. Métricas SaaS Essenciais

| Métrica | O que mede |
|---------|-----------|
| **MRR** | Receita mensal recorrente |
| **Churn** | % clientes que cancelam por mês |
| **LTV** | Valor do cliente ao longo da vida |
| **CAC** | Custo de aquisição por cliente |
| **NPS** | Satisfação do cliente (0-10) |
| **Activation Rate** | % que completam o onboarding |

---

## 8. Checklist SaaS Pré-Lançamento

- [ ] Dados isolados por tenant (empresa)
- [ ] RBAC implementado (CLIENT vs BUSINESS)
- [ ] Onboarding guiado para novas empresas
- [ ] Planos e limites definidos
- [ ] Gateway de pagamento integrado
- [ ] Métricas básicas sendo coletadas
- [ ] Termos de uso e política de privacidade
- [ ] Suporte ao cliente (chat, e-mail ou FAQ)
