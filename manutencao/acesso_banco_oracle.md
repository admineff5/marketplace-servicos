# Liberando Acesso Ex externo ao Banco de Dados (Oracle Cloud)

Como este projeto utiliza um banco de dados hospedado na **Oracle Cloud Infrastructure (OCI)** e estamos em fase de desenvolvimento local, é muito comum nos depararmos com erros de conexão (como `Connection Refused` ou `Timeout`), pois, por padrão, as máquinas virtuais da nuvem bloqueiam o acesso a portas de banco de dados para segurança.

Existem **três opções** principais para você conseguir se conectar ao PostgreSQL localmente:

---

## Opção 1: Liberação Externa na Oracle vira IP (Recomendado para Dev)

Isso envolve liberar a porta 5432 na Oracle para a sua máquina conseguir se conectar com o banco.

**Passo 1: Security List (Painel Web)**
1. Acesse o painel da Oracle Cloud.
2. Vá em **Networking** > **Virtual Cloud Networks**.
3. Clique na sua VCN e depois na sub-rede onde sua máquina está (provavelmente Public Subnet).
4. Clique na **Security List** e adicione uma **Ingress Rule**:
   - Source Type: `CIDR`
   - Source CIDR: `0.0.0.0/0` (ou o seu IP público para maior segurança, ex: `203.0.113.1/32`)
   - IP Protocol: `TCP`
   - Destination Port Range: `5432`

**Passo 2: Iptables / UFW (Dentro do Servidor)**
Mesmo que a Oracle Cloud permita pela web, o Linux (seja Ubuntu ou Oracle Linux) continua bloqueando. 
Acesse seu servidor por SSH e rode um desses comandos baseado no que você usa:

Se for **Iptables (Oracle Linux / Ubuntu)**:
```bash
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 5432 -j ACCEPT
sudo netfilter-persistent save
# ou sudo iptables-save > /etc/iptables/rules.v4
```

Se for **UFW (Ubuntu Firewal)**:
```bash
sudo ufw allow 5432/tcp
```

Após isso, o Next e o Prisma conseguirão acessar naturalmente pela sua `.env`.

---

## Opção 2: Túnel SSH (Mais seguro mas requer rodar comando sempre)

Se você não quer expor a porta 5432 ao mundo (mesmo que com senha), você pode usar o protocolo SSH (que já deve estar na porta 22) para criar um túnel direto entre seu PC (Localhost) e o banco.

Abra o PowerShell ou Prompt de Comando e rode:
```bash
ssh -L 5432:localhost:5432 USUARIO_DA_MAQUINA@IP_DA_ORACLE -i caminho_para_sua_chave.key
```
Enquanto essa janela preta estiver aberta, quando o Prisma no seu projeto local tentar se conectar ao endereço `localhost:5432`, o SSH vai interceptar a conexão e jogar para dentro da Oracle Cloud de forma criptografada.
*Nesse caso, sua `DATABASE_URL` no `.env` passaria a ser `postgresql://USUARIO:SENHA@localhost:5432/NOMEBD`.*

---

## Opção 3: Supabase ou Neon (Dev / Alternativa)

Caso essas liberações pareçam muito complexas ou envolvam riscos, durante o desenvolvimento usamos bancos de dados PostgreSQL gratuitos e gerenciados que já "nascem" 100% abertos na internet via URL de segurança. Dois serviços amplamente recomendados com o Prisma/Next.js são:
- [Neon.tech](https://neon.tech)
- [Supabase](https://supabase.com)

---

## Opção 4: Rede Virtual Privada (VPN) com Tailscale Ou ZeroTier (Mais Segura)

Como seu servidor não tem a porta 22 (SSH) aberta para a internet, e você não quer expor a porta 5432 (PostgreSQL) publicamente, a melhor alternativa moderna e gratuita é usar uma rede virtual privada P2P, como o **Tailscale** ou **ZeroTier**.

Esses serviços criam uma "LAN Virtual". Você instala o agente no seu servidor Oracle e no seu PC local. Eles se comunicam por túneis criptografados sem precisar abrir *nenhuma* porta pública (nem a 22, nem a 5432). O servidor e o seu PC receberão IPs internos privados (ex: `100.x.y.z`).

**Como fazer com Tailscale:**
1. Crie uma conta no [Tailscale](https://tailscale.com/).
2. Instale o Tailscale no seu PC Windows (baixe o executável e faça login).
3. Instale o Tailscale no seu servidor Oracle (você precisará acessar o terminal da Oracle pelo Cloud Shell na web):
   ```bash
   curl -fsSL https://tailscale.com/install.sh | sh
   sudo tailscale up
   ```
4. Copie o IP que o Tailscale gerou para o seu servidor (algo como `100.10.x.x`).
5. Atualize o seu `pg_hba.conf` no Postgres do servidor para aceitar conexões da rede do Tailscale (`100.x.x.x/8`) e reinicie o Postgres.
6. Na sua máquina local, altere o `.env`:
   `DATABASE_URL="postgresql://USUARIO:SENHA@100.10.X.X:5432/NOMEBD"`

---

## Opção 5: Usar o OCI Bastion Service (Solução Oficial Oracle)

A Oracle oferece um serviço gratuito chamado Bastion para exatamente esse cenário de "Zero Trust" (VMs privadas sem IPs públicos ou com portas fechadas).

Ele cria um salto (jump host) seguro gerenciado pela própria nuvem. Através dele, você consegue criar um Túnel SSH temporário validado diretamente para a porta 5432 ou 22 SEM precisar abrir elas para a internet.
1. Vá no painel da Oracle > **Identity & Security** > **Bastion**.
2. Clique em **Create Bastion**. Atrele ele à mesma VCN e Subnet da sua máquina virtual.
3. Clique no nome do Bastion recém-criado.
4. No menu esquerdo, vá em **Sessions** e clique em **Create Session**.
5. Em "Session Type", escolha **SSH Port Forwarding Session**.
6. Preencha com o **IP Privado** da sua máquina (`ex: 10.0...`) e coloque a porta `5432`.
7. Ele pedirá que você forneça/gere uma chave SSH pública (`.pub`). O mais fácil é pedir para "Generate SSH Key Pair" e fazer o download das chaves para o seu computador.
8. Após criar a sessão, clique no menu de 3 pontinhos nela > **Copy SSH Command**.
9. Substitua o `<privateKey>` pelo caminho do arquivo `.key` que você baixou.
10. Rode o comando no PowerShell local.
11. No arquivo `.env` do projeto, coloque: `DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/NOMEBD"`

### 💡 E Quando o Site For Pro Ar (Produção)?

Se você decidir hospedar o site Next.js (front/back) em uma hospedagem futuramente (seja Vercel ou outra VM na própria Oracle):

1. **Se você hospedar na própria Oracle Cloud (Recomendado na mesma rede)**: 
   O servidor do Next.js ficará na *mesma Virtual Cloud Network (VCN)* do seu servidor PostgreSQL. O site lerá as requisições e acessará o Postgres pelo IP Privado interno dele (ex: `10.0.0.X:5432`) sem passar pela internet pública. A latência será mínima e a segurança, máxima, pois nada sairá da nuvem! **Você não precisará do Bastion lá.**

2. **Se você hospedar fora (Ex: Vercel para o Next.js)**:
   Você usará uma funcionalidade chamada **Connection Pooling**. Se as requisições do seu front-end saírem por IPs conhecidos da Vercel, você pode adicionar esses IPs estáticos lá na *Security List* da Oracle Cloud (Passo 1 da opção 1). Isso significa que SOMENTE o servidor da Vercel conseguirá bater na porta 5432. Ninguém da rua conseguirá. **Novamente, não precisará usar o Bastion no dia a dia do site no ar**.

O Bastion é essencialmente uma ponte de mão única e restritiva **apenas para desenvolvedores e administradores** (Eu e você, na sua máquina Windows local).
