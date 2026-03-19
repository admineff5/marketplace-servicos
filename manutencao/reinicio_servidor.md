# Guia de Reativação do Servidor (Pós-Reinício)

Se o servidor da Oracle Cloud reiniciou, o site e o banco de dados podem ter ficado fora do ar. Siga estes passos para colocar tudo de volta no ar.

---

## 1. Banco de Dados (PostgreSQL)
Certifique-se de que o banco de dados está rodando. No terminal do servidor, rode:

```bash
sudo systemctl status postgresql-17
```

Se o status NÃO for `active (running)`, ligue-o com:
```bash
sudo systemctl start postgresql-17
```

---

## 2. Aplicação (Next.js & PM2)
O PM2 é quem mantém o site "vivo". Mesmo que o servidor reinicie, ele deveria voltar sozinho, mas se der erro "502 Bad Gateway", rode os comandos abaixo dentro da pasta do projeto (`/data/www/agendaja`):

```bash
# 1. Entrar na pasta do projeto
cd /data/www/agendaja

# 2. Deletar o processo antigo que pode estar com o caminho errado
pm2 delete agendaja

# 3. Iniciar o serviço do zero dentro da pasta correta
pm2 start npm --name "agendaja" -- run start
```

### 💡 Dica: Salvar para o Próximo Reinício
Para que o PM2 saiba que ele deve ligar o site automaticamente assim que o Linux ligar, rode:
```bash
pm2 save
```

---

## 3. Servidor de Redirecionamento (Nginx)
O Nginx é a "porta de entrada" que recebe o acesso do domínio `agendaja.eff5.com.br` e joga para o Next.js.

Verifique o status:
```bash
sudo systemctl status nginx
```

Se estiver parado, inicie:
```bash
sudo systemctl restart nginx
```

---

## 4. O que fazer se o site não subir (Bad Gateway / Erro 502)

Se você rodou tudo e o site continua dando erro, o Next.js pode estar "crashando". 

**Passo 1: Verifique os Logs**
Rode este comando para ver o erro real que está acontecendo agora:
```bash
pm2 logs agendaja --lines 50
```

**Passo 2: Verifique o Uptime**
Rode `pm2 status`. Se o **uptime** estiver em `0s` e o número de **restarts** estiver subindo, o site está tentando ligar e morrendo em seguida.

**Passo 3: Tente um Build Limpo**
Às vezes os arquivos antigos causam erro. Tente reconstruir o site:
```bash
cd /data/www/agendaja
npm run build
pm2 restart agendaja
```

---

## 🆘 Resumo de Emergência (Copie e Cole)
Se você quer apenas que tudo volte a funcionar rápido, cole isso no terminal do servidor:

Validar
```bash
 sudo systemctl status postgresql-17 && sudo systemctl status nginx
```

Subir
```bash
sudo systemctl start postgresql-17 && sudo systemctl restart nginx && cd /data/www/agendaja && pm2 delete agendaja && pm2 start npm --name "agendaja" -- run start && pm2 save
```

---

# Subir o site com as alteracoes no GIT
# Só dar git pull + npm run build + pm2 restart all no servidor!



```bash
cd /data/www/agendaja
git pull             
# Se der erro de conflito no git pull, use o comando abaixo para forçar a versão do GitHub:   
git fetch origin main
git reset --hard origin/main
npm install          # ← importante para instalar o bcrypt
npx prisma generate
npm run build
pm2 restart all
```

*Documento gerado para auxiliar na manutenção do AgendeJá Marketplace.*
