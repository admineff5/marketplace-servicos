#!/bin/bash

# Script de Deploy Automatizado - AgendaJá
# Local: /data/www/agendaja

APP_DIR="/data/www/agendaja"
PM2_NAME="agendaja"

echo "🚀 Iniciando deploy em $APP_DIR..."

cd $APP_DIR

# 1. Puxar as últimas alterações
echo "📥 Sincronizando código via Git..."
git pull origin main

# 2. Instalar dependências
echo "📦 Instalando dependências..."
npm install --production

# 3. Gerar Prisma Client
echo "💎 Gerando Prisma Client..."
npx prisma generate

# 4. Rodar Migrações (Opcional, mas recomendado em prod se houver controle)
# echo "🗄️ Rodando migrations..."
# npx prisma db push --accept-data-loss # Cuidado com este em prod real!

# 5. Build da aplicação
echo "🏗️ Rodando Build do Next.js..."
npm run build

# 6. Reiniciar o PM2
echo "♻️ Reiniciando serviço no PM2..."
pm2 restart $PM2_NAME || pm2 start npm --name "$PM2_NAME" -- run start

echo "✅ Deploy concluído com sucesso!"
