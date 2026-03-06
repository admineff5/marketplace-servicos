# Manutenção e Comandos Úteis do Projeto

Este arquivo visa centralizar informações de como operar o projeto, executar testes base, atualizar bibliotecas e resolver problemas comuns. **Será atualizado constantemente conforme a arquitetura da aplicação evoluir.**

## 1. Comandos Iniciais de Configuração (Node.js & Next.js)
Sempre que clonar o projeto ou mudar de branch, caso haja dependências novas:
```bash
npm install
```
Para rodar o projeto localmente:
```bash
npm run dev
```
(A aplicação subirá em `http://localhost:3000`)

## 2. Lidando com o Banco de Dados (PostgreSQL / Prisma)
Este projeto usa PostgreSQL. Para que a conexão aconteça, é **obrigatório** possuir o arquivo `.env` na raiz do projeto com o parâmetro:
```env
DATABASE_URL="postgresql://USUARIO:SENHA@HOST:5432/NOMEBD"
```
*(Se estivermos usando Prisma, adicionaremos aqui os comandos `npx prisma db push` ou `npx prisma migrate dev` futuramente).*

## 3. Comandos de GitHub / Versão de Código
Para atualizar o GitHub com suas alterações, utilize sequencialmente no terminal:
```bash
git add .
git commit -m "Descreva suas alterações aqui"
git push origin main
```
Para puxar mudanças caso tenha editado pela web:
```bash
git pull origin main
```

## 4. Dicas de Layout e UI
- **Adição de Imagem/Logo**: Coloque a imagem na pasta `public/` e chame-a no código apenas usando `/nome-da-imagem.png`.
- **Cores Customizadas**: Para alterar a identidade do site, atualize as tags no `tailwind.config.ts`.

## 5. Resolução de Problemas Comuns (Troubleshooting)

- **Erro `Port 3000 is already in use`**:
  Ocorre se outro programa ou servidor estiver rodando. Mate o processo no terminal rodando o comando ou feche os outros terminais.
- **Banco de Dados não conecta (Connection Refused ou Timeout)**:
  1. Confira se o endereço de IP da Oracle Cloud está correto.
  2. Veja se a porta 5432 está aberta no painel Security Lists da sua nuvem.
  3. Verifique as credenciais no arquivo `.env`.
  *Para um guia detalhado sobre como resolver o bloqueio de Firewall da Oracle, consulte o arquivo [acesso_banco_oracle.md](acesso_banco_oracle.md) nesta mesma pasta.*

> **Nota:** Conforme implementarmos módulos específicos de Autenticação, Banco de Dados e Dashboard, este arquivo ganhará novos capítulos.
