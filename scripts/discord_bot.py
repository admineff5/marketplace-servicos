import discord
from discord.ext import commands
import google.generativeai as genai
import json
import os
import re
import textwrap

# Carregar Configurações
CONFIG_PATH = "manutencao/bot_config.json"
MASTER_PROMPT_PATH = "manutencao/project_context.md"
CHANGELOG_PATH = "CHANGELOG.md"

def load_config():
    with open(CONFIG_PATH, "r") as f:
        return json.load(f)

config = load_config()

# Configurar Gemini
genai.configure(api_key=config["GEMINI_API_KEY"])

# Usando o modelo solicitado pelo usuário: Gemini 3 Flash
# De acordo com a listagem anterior, o nome técnico é 'gemini-3-flash-preview'
PRIMARY_MODEL = 'gemini-3-flash-preview'
FALLBACK_MODEL = 'gemini-2.0-flash' # Caso o 3 ainda esteja instável na API

model = genai.GenerativeModel(PRIMARY_MODEL)

# Configurar Discord Bot
intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix="!", intents=intents)

# Lógica de Censura (Reaproveitada)
def censor_content(text):
    text = re.sub(r'(\d{1,3})\.\d{1,3}\.\d{1,3}\.\d{1,3}', r'\1.XXX.XXX.XXX', text)
    def censor_db_url(match):
        protocol, user, password, host = match.groups()
        censored_user = user[:2] + "XXX" if len(user) > 2 else "XXX"
        return f"{protocol}{censored_user}:XXXXXX@{host}"
    text = re.sub(r'(postgresql:\/\/|postgres:\/\/)([^:]+):([^@]+)@([^/]+)', censor_db_url, text)
    def censor_generic(match):
        key, val = match.groups()
        censored_val = val[:2] + "XXXXXX" if len(val) > 2 else "XXXXXX"
        return f"{key}={censored_val}"
    text = re.sub(r'(senha|password|token|key|secret)=([^ \s&]+)', censor_generic, text, flags=re.IGNORECASE)
    return text

def get_project_context():
    context = "Você é o assistente técnico do projeto AgendeJá. Use o contexto abaixo para responder:\n\n"
    if os.path.exists(MASTER_PROMPT_PATH):
        with open(MASTER_PROMPT_PATH, "r", encoding="utf-8") as f:
            context += "--- MASTER PROMPT ---\n" + f.read() + "\n\n"
    if os.path.exists(CHANGELOG_PATH):
        with open(CHANGELOG_PATH, "r", encoding="utf-8") as f:
            context += "--- CHANGELOG ---\n" + f.read() + "\n\n"
    return context

@bot.event
async def on_ready():
    print(f'--- BOT PRONTO ---')
    print(f'Logado como: {bot.user.name}')
    print(f'Modelo Primário: {PRIMARY_MODEL}')
    print(f'------------------')

@bot.event
async def on_message(message):
    print(f"[DEBUG] Mensagem de {message.author}: {message.content}")
    
    if message.author == bot.user:
        return

    is_mentioned = bot.user.mentioned_in(message)
    is_dm = isinstance(message.channel, discord.DMChannel)

    if is_mentioned or is_dm:
        async with message.channel.typing():
            try:
                prompt = get_project_context()
                user_msg = re.sub(r'<@!?[0-9]+>', '', message.content).strip()
                
                try:
                    response = model.generate_content(f"{prompt}\n\nsócio diz: {user_msg}")
                except Exception as e:
                    print(f"[DEBUG] Erro no modelo {PRIMARY_MODEL}, tentando fallback {FALLBACK_MODEL}...")
                    fb_model = genai.GenerativeModel(FALLBACK_MODEL)
                    response = fb_model.generate_content(f"{prompt}\n\nsócio diz: {user_msg}")
                
                reply = censor_content(response.text)
                
                if len(reply) > 2000:
                    chunks = textwrap.wrap(reply, 1900, break_long_words=False, replace_whitespace=False)
                    for chunk in chunks:
                        await message.reply(chunk)
                else:
                    await message.reply(reply)
            except Exception as e:
                print(f"[DEBUG] ERRO FATAL: {str(e)}")
                await message.reply(f"❌ Erro: {str(e)}")

    await bot.process_commands(message)

if __name__ == "__main__":
    bot.run(config["DISCORD_TOKEN"])
