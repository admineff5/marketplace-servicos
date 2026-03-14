
import re
import os
import time
import json
import urllib.request

# Webhook from discord_notifier.py
WEBHOOK_URL = "https://discord.com/api/webhooks/1481018142657351883/Ucam0lKR08sCBfzmKtVrXqluSA2H7JPVE0QowPv52cElGUxyHx4PuUUo-eT1zeZV9tCw"

def send_to_discord(content):
    headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'Antigravity-Bot/1.0'
    }
    payload = {"content": content}
    # Discord limit is 2000 per message. We might need to chunk if a version is massive.
    # But usually changelogs fits. Let's add basic chunking just in case.
    if len(content) > 1950:
        parts = [content[i:i+1950] for i in range(0, len(content), 1950)]
    else:
        parts = [content]

    for part in parts:
        payload = {"content": part}
        data = json.dumps(payload, ensure_ascii=False).encode('utf-8')
        req = urllib.request.Request(WEBHOOK_URL, data=data, headers=headers, method='POST')
        try:
            with urllib.request.urlopen(req) as response:
                pass
        except Exception as e:
            print(f"Error sending to Discord: {e}")
            return False
        time.sleep(0.5)
    return True

def format_block(version, date, body):
    lines = body.splitlines()
    fase = None
    tipo = None
    resumo = None
    
    # Standard labels detection
    processed_lines = []
    
    # We want to keep sections like Added, Changed, Fixed
    # but we ALSO want to extract Fase/Tipo/Resumo to the top if they are there.
    
    header_info = []
    content_lines = []
    
    for line in lines:
        line = line.strip()
        if not line: continue
        
        if line.startswith("**Fase:**"):
            fase = line.replace("**Fase:**", "").strip()
        elif line.startswith("**Tipo de release:**"):
            tipo = line.replace("**Tipo de release:**", "").strip()
        elif line.startswith("**Resumo:**"):
            resumo = line.replace("**Resumo:**", "").strip()
        elif line.startswith("### "):
            content_lines.append(line.replace("### ", "").strip())
        elif line.startswith("- ") or line.startswith("* "):
            content_lines.append("• " + line[2:].strip())
        else:
            # Check if it's a date or version header we should skip
            if re.match(r"\[\d+\.\d+\.\d+\]", line):
                continue
            content_lines.append(line)

    # Defaults if not found
    fase = fase or "Beta"
    tipo = tipo or "Patch"
    resumo = resumo or "Atualizações e correções gerais."

    msg = f"**[{version}] - {date}**\n"
    msg += f"**Fase:** {fase}\n"
    msg += f"**Tipo de release:** {tipo}\n"
    msg += f"**Resumo:** {resumo}\n"
    
    # Now append the rest of the body with sections
    for line in content_lines:
        if line in ["Added", "Changed", "Fixed", "Adicionado", "Alterado", "Corrigido", "Ajustado"]:
            msg += f"\n**{line}**\n"
        else:
            msg += f"{line}\n"
            
    return msg.strip()

def parse_changelog(content):
    # Regex to find ## [v.v.v] - date
    # Or just use the separators
    blocks = []
    
    # We need to preserve the order and not miss the "anonymous" ones.
    # Split by ## [ or by ---
    # But wait, ## [ is more specific for versioned ones.
    
    sections = re.split(r"(## \[\d+\.\d+\.\d+[^\]]*\] - \d{4}-\d{2}-\d{2}|---)", content)
    
    current_version = None
    current_date = None
    
    items = []
    
    for i in range(len(sections)):
        s = sections[i].strip()
        if not s: continue
        
        # Check if it's a header
        header_match = re.match(r"## \[([\d\.]+)\] - ([\d\-]+)", s)
        if header_match:
            current_version = header_match.group(1)
            current_date = header_match.group(2)
            # The next section should be the body
            if i + 1 < len(sections):
                body = sections[i+1].strip()
                if body != "---":
                    items.append({
                        "version": current_version,
                        "date": current_date,
                        "body": body
                    })
        elif s == "---":
            # Anonymous block might follow
            if i + 1 < len(sections):
                body = sections[i+1].strip()
                # Check if it's not another header and not empty
                if not body.startswith("## [") and body != "---":
                    # Heuristic for version number
                    if "Hardening de Segurança" in body:
                        items.append({"version": "0.8.0", "date": "2026-03-13", "body": body})
                    elif "Refatoração de Segurança" in body:
                        items.append({"version": "0.7.0", "date": "2026-03-13", "body": body})
                    elif "Implementação de persistência real" in body:
                        items.append({"version": "0.6.0", "date": "2026-03-12", "body": body})
    
    # deduplicate by version
    unique = {}
    for it in items:
        unique[it["version"]] = it
    
    final_list = list(unique.values())
    # Sort by version tuple
    final_list.sort(key=lambda x: [int(p) for p in x["version"].split(".")])
    
    return [f for f in final_list if [int(p) for p in f["version"].split(".")] >= [0, 8, 0]]

def main():
    with open("CHANGELOG.md", "r", encoding="utf-8") as f:
        content = f.read()

    blocks = parse_changelog(content)
    
    print(f"Found {len(blocks)} versions to sync.")
    
    for b in blocks:
        print(f"Syncing v{b['version']}...")
        msg = format_block(b['version'], b['date'], b['body'])
        if send_to_discord(msg):
            print(f"v{b['version']} OK")
        else:
            print(f"v{b['version']} FAILED")
        time.sleep(1)

if __name__ == "__main__":
    main()
