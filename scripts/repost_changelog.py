import os
import sys
import re

# Adicionar o diretório atual ao path para importar o notifier se necessário
# Mas como o notifier já é um script, vamos apenas importar a lógica de envio
from discord_notifier import send_to_discord, WH_CHANGELOG

CHANGELOG_PATH = "CHANGELOG.md"

def repost():
    if not os.path.exists(CHANGELOG_PATH):
        print("Changelog not found.")
        return

    with open(CHANGELOG_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    # Split by the separator "---"
    # Note: Some versions might not have it if it's the first/last, 
    # but the file seems consistent.
    blocks = content.split("---")
    
    # Strip whitespace from blocks and filter empty ones
    blocks = [b.strip() for b in blocks if b.strip()]
    
    # The file is newest first, so we reverse to send oldest first
    blocks.reverse()
    
    print(f"Found {len(blocks)} version blocks. Sending in chronological order...")
    
    for i, block in enumerate(blocks):
        print(f"Sending block {i+1}/{len(blocks)}...")
        send_to_discord(WH_CHANGELOG, block)
        # Pequeno delay para evitar rate limit ou ordem bagunçada no Discord (opcional, send_to_discord é síncrono)
        import time
        time.sleep(1)

    print("All versions sent successfully.")

if __name__ == "__main__":
    repost()
