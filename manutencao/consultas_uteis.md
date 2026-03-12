# Consultas Úteis para Validação do Sistema

Guia prático para consultar dados diretamente no PostgreSQL via terminal ou interface (DBeaver/pgAdmin).

---

## 👥 1. Usuários e Clientes

**Verificar últimos usuários cadastrados:**
```sql
SELECT id, name, email, role, "createdAt" 
FROM "User" 
ORDER BY "createdAt" DESC 
LIMIT 10;
```

**Buscar um cliente específico pelo nome ou email:**
```sql
SELECT * FROM "User" WHERE name ILIKE '%NOME%' OR email = 'email@exemplo.com';
```

---

## 🏢 2. Empresas e Configurações

**Listar todas as empresas e seus donos:**
```sql
SELECT c.name as empresa, u.name as dono, c.niche 
FROM "Company" c
JOIN "User" u ON c."ownerId" = u.id;
```

**Verificar serviços e preços de uma empresa:**
```sql
SELECT s.name, s.price, s.duration 
FROM "Service" s
JOIN "Company" c ON s."companyId" = c.id
WHERE c.name ILIKE '%NOME_DA_EMPRESA%';
```

---

## 📅 3. Agendamentos (Fluxo Principal)

**Verificar agendamentos para HOJE:**
```sql
SELECT a.date, u.name as cliente, e.name as profissional, s.name as servico, a.status
FROM "Appointment" a
JOIN "User" u ON a."userId" = u.id
JOIN "Employee" e ON a."employeeId" = e.id
JOIN "Service" s ON a."serviceId" = s.id
WHERE a.date >= CURRENT_DATE AND a.date < CURRENT_DATE + interval '1 day';
```

**Agendamentos pendentes de confirmação:**
```sql
SELECT * FROM "Appointment" WHERE status = 'PENDING';
```

---

## 📈 4. Leads e Auditoria

**Verificar novos leads de interesse:**
```sql
SELECT name, phone, interest, created_at 
FROM "Lead" 
WHERE converted = false 
ORDER BY created_at DESC;
```

**Logs de atividades recentes:**
```sql
SELECT * FROM "AuditLog" ORDER BY timestamp DESC LIMIT 20;
```

---

## 🛠️ 5. Consultas Técnicas (DBA)

**Verificar conexões ativas agora:**
```sql
SELECT count(*), state FROM pg_stat_activity GROUP BY state;
```

**Tamanho das tabelas no disco:**
```sql
SELECT relname AS "Tabela", pg_size_pretty(pg_total_relation_size(relid)) AS "Tamanho"
FROM pg_catalog.pg_statio_user_tables 
ORDER BY pg_total_relation_size(relid) DESC;
```
