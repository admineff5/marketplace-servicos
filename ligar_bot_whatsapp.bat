@echo off
echo Iniciando Assistente WhatsApp (Baileys + OpenAI)...
cd /d %~dp0
node scripts/whatsapp_worker.js
pause
