# Guia Rápido: Como Atualizar o Site na Internet (Produção/Vercel)

Se o seu site já está conectado na Vercel com o GitHub, atualizar aquilo que você vê na internet é a coisa mais simples do mundo! 

A regra de ouro é: **A Vercel atualiza tudo sozinha assim que você envia o código para o GitHub.** Portanto, você só precisa informar ao Git as suas mudanças locais e empurrá-las para lá.

Sempre que fizermos novas melhorias aqui e você quiser que seu sócio e os clientes finais vejam, basta seguir estes 3 passos simples no seu terminal (linha de comando dentro da pasta do projeto):

### Passo 1: Adicionar todas as mudanças
Comando para avisar ao Git que você quer incluir **todas** as modificações novas, arquivos deletados e novidades:
```bash
git add .
```

### Passo 2: Dar um "Nome" para esta atualização (Commit)
Comando para empacotar e rotular a mudança. Você pode colocar entre aspas o que mudou (Ex: Versão 0.3.0, ou Nova aba de clientes):
```bash
git commit -m "feat: Atualizacao para a versao 0.3.0 - Modulos de Clientes, Produtos e Leads"
```

### Passo 3: Enviar para a Nuvem (Push)
Comando que joga todo o pacote no GitHub. Assim que acabar de carregar, a Vercel vai ver a atualização automaticamente e já vai começar a montar o site em produção. Em 2 minutinhos vai estar no ar!
```bash
git push
```

---

### Resumão (Copia e Cola)
Se você tem pressa, pode rodar os três juntos de uma vez colando isso no terminal:
```bash
git add . && git commit -m "Nova atualizacao do AgendeJa" && git push
```

> **Dica:** Sempre acompanhe se a build (compilação) da Vercel deu certo diretamente no painel da Vercel ou na aba "Actions" do GitHub se configurado. Se nós validarmos tudo no `npm run build` local antes de subir, as chances de errar na web são quase nulas!
