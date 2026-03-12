---
name: devops_oci
description: Procedimentos de Deploy, Manutenção e Monitoramento no servidor Oracle Cloud com PM2 e Nginx.
---

# DevOps: Deploy OCI + PM2 + Nginx

Este skill documenta o fluxo completo de deploy e manutenção do AgendeJá no servidor Oracle Cloud.

---

## 1. Arquitetura do Servidor

```
                        ┌─────────────┐
  Internet ───────────► │   Nginx     │ (porta 80/443)
                        │  (proxy)    │
                        └──────┬──────┘
                               │
                        ┌──────▼──────┐
                        │    PM2      │ (processo)
                        │  Next.js    │ (porta 3000)
                        └──────┬──────┘
                               │
                        ┌──────▼──────┐
                        │ PostgreSQL  │ (porta 5432)
                        │   dbsite    │
                        └─────────────┘
```

- **Servidor:** `dsrvdb01` (Oracle Linux)
- **Caminho do App:** `/data/www/agendaja`
- **Usuário:** `opc`

---

## 2. Deploy Rápido (Checklist)

> [!IMPORTANT]
> Execute SEMPRE nesta ordem. Pular etapas causa erros de build ou versão desatualizada.

```bash
# 1. Acessar o servidor
ssh opc@<IP_SERVIDOR>

# 2. Navegar e puxar código
cd /data/www/agendaja
git pull origin main

# 3. Se houve mudança no schema do banco:
npx prisma generate
npx prisma db push

# 4. Build de produção
npm run build

# 5. Reiniciar o processo
pm2 restart agendaja
```

---

## 3. Deploy com Conflito de Git

Se houver arquivos locais modificados no servidor (ex: `package-lock.json`):

```bash
git fetch origin main
git reset --hard origin/main
npx prisma generate
npm run build
pm2 restart agendaja
```

> [!CAUTION]
> `git reset --hard` apaga TODAS as mudanças locais. Use apenas quando não há edições manuais importantes no servidor.

---

## 4. Monitoramento PM2

| Comando | Uso |
|---------|-----|
| `pm2 status` | Ver processos rodando |
| `pm2 logs agendaja` | Ver logs em tempo real |
| `pm2 logs agendaja --lines 50` | Últimas 50 linhas |
| `pm2 restart agendaja` | Reiniciar o app |
| `pm2 stop agendaja` | Parar o app |
| `pm2 delete agendaja` | Remover o processo |

### Recriar processo do zero:
```bash
cd /data/www/agendaja
pm2 start npm --name "agendaja" -- start
pm2 save
```

---

## 5. Nginx (Proxy Reverso)

Arquivo de configuração: `/etc/nginx/conf.d/agendaja.conf`

```nginx
server {
    listen 80;
    server_name agendaja.eff5.com.br;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

| Comando | Uso |
|---------|-----|
| `sudo systemctl restart nginx` | Reiniciar Nginx |
| `sudo nginx -t` | Testar configuração |
| `sudo systemctl status nginx` | Ver status |

---

## 6. Banco de Dados (PostgreSQL)

| Comando | Uso |
|---------|-----|
| `sudo systemctl status postgresql-17` | Ver status |
| `sudo systemctl restart postgresql-17` | Reiniciar |
| `psql -U usrdbsite -d dbsite` | Acessar o banco |

### Túnel SSH via OCI Bastion:
```powershell
# No terminal Windows (para acesso remoto ao banco):
ssh -i <chave.key> -N -L 5433:10.0.0.87:5432 -p 22 <session_id>@host.bastion.sa-saopaulo-1.oci.oraclecloud.com
```

---

## 7. Troubleshooting

### 502 Bad Gateway
1. Verificar se o PM2 está rodando: `pm2 status`
2. Se uptime = 0s: `pm2 logs agendaja --lines 20`
3. Rebuild: `npm run build && pm2 restart agendaja`

### Build Falha (TypeScript)
1. Verificar erros de tipo no terminal
2. Corrigir no código local → push → pull no servidor
3. Se for Prisma: `npx prisma generate` antes do build

### Sessão SSH Expirada (OCI Bastion)
- Sessions do Bastion expiram a cada 3h
- Criar nova session no Console OCI → Bastion → Sessions
- Usar a nova chave/session ID no comando SSH

---

## 8. Checklist Pré-Deploy

- [ ] `npm run build` local sem erros
- [ ] Versão atualizada no `Footer.tsx`
- [ ] CHANGELOG.md atualizado
- [ ] Commit e push para `main`
- [ ] Discord notificado (canais #live e #changelog)
