import os
import time
import json
import requests
import feedparser
from datetime import datetime

# Configuração
WEBHOOK_URL = "https://discord.com/api/webhooks/1481419674682921143/7ZOPFAXHcfqUc8qNi82371I6torbPeXuMeFX95DIMCu9r2cymIxzT_gLxrSCVQVJGB4T"
FEEDS = [
    "https://feeds.feedburner.com/venturebeat/SZYF",
    "https://techcrunch.com/category/artificial-intelligence/feed/"
]
HISTORY_FILE = os.path.join(os.path.dirname(__file__), "news_history.json")
POLL_INTERVAL = 1800  # 30 minutos em segundos

def load_history():
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r") as f:
                return set(json.load(f))
        except:
            return set()
    return set()

def save_history(history):
    with open(HISTORY_FILE, "w") as f:
        json.dump(list(history), f)

def send_to_discord(entry):
    embed = {
        "title": entry.title,
        "url": entry.link,
        "description": entry.summary[:200] + "..." if hasattr(entry, 'summary') else "",
        "color": 3447003, # Azul royal
        "timestamp": datetime.now().isoformat(),
        "footer": {
            "text": "Oliv-IA News Monitor"
        }
    }
    
    # Tenta extrair imagem se disponível (variável entre feeds)
    if 'media_content' in entry and len(entry.media_content) > 0:
        embed["image"] = {"url": entry.media_content[0]['url']}
    elif 'links' in entry:
        for link in entry.links:
            if 'image' in link.get('type', ''):
                embed["image"] = {"url": link.href}

    payload = {
        "username": "Oliv-IA News Hub",
        "avatar_url": "https://i.imgur.com/4M34hi2.png", # Avatar opcional
        "embeds": [embed]
    }
    
    try:
        response = requests.post(WEBHOOK_URL, json=payload)
        response.raise_for_status()
        print(f"✅ Enviado: {entry.title}")
    except Exception as e:
        print(f"❌ Erro ao enviar para Discord: {e}")

def main():
    print("🚀 News Monitor iniciado...")
    history = load_history()
    
    while True:
        print(f"🔍 Checando feeds em {datetime.now().strftime('%H:%M:%S')}...")
        new_entries_found = False
        
        for url in FEEDS:
            try:
                feed = feedparser.parse(url)
                for entry in feed.entries:
                    # Usa o link ou ID como identificador único
                    entry_id = entry.get('id', entry.link)
                    
                    if entry_id not in history:
                        send_to_discord(entry)
                        history.add(entry_id)
                        new_entries_found = True
                        # Pequena pausa entre envios para não dar rate limit no Discord
                        time.sleep(2)
            except Exception as e:
                print(f"❌ Erro ao processar feed {url}: {e}")
        
        if new_entries_found:
            save_history(history)
            
        print(f"😴 Aguardando {POLL_INTERVAL/60} minutos para a próxima checagem...")
        time.sleep(POLL_INTERVAL)

if __name__ == "__main__":
    main()
