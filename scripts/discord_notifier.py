import os
import json
import re
import sys
import urllib.request
import urllib.error
import textwrap

# Webhooks
WH_CHANGELOG = "https://discord.com/api/webhooks/1481018142657351883/Ucam0lKR08sCBfzmKtVrXqluSA2H7JPVE0QowPv52cElGUxyHx4PuUUo-eT1zeZV9tCw"
WH_CHECKLIST = "https://discord.com/api/webhooks/1481018283896340482/ez0iIVgFq6NxOk6iogAl85FO5zIHgvFSi5AhyQKfePDkdmMcZgUjwOR0kOOY1Z_M7hoR"
WH_LIVE = "https://discord.com/api/webhooks/1481018439949615199/ull1wXE445yCJqQBB41yyeK5PaYfOdFIKY3g2e_h2gv_iEHHeRllCoZql3D6i2h145d5"

STATE_FILE = "manutencao/discord_state.json"

def censor_content(text):
    text = re.sub(r'(\d{1,3})\.\d{1,3}\.\d{1,3}\.\d{1,3}', r'\1.XXX.XXX.XXX', text)
    def censor_db_url(match):
        protocol = match.group(1)
        user = match.group(2)
        password = match.group(3)
        host = match.group(4)
        censored_user = user[:2] + "XXX" if len(user) > 2 else "XXX"
        return f"{protocol}{censored_user}:XXXXXX@{host}"
    text = re.sub(r'(postgresql:\/\/|postgres:\/\/)([^:]+):([^@]+)@([^/]+)', censor_db_url, text)
    def censor_generic(match):
        key = match.group(1)
        val = match.group(2)
        censored_val = val[:2] + "XXXXXX" if len(val) > 2 else "XXXXXX"
        return f"{key}={censored_val}"
    text = re.sub(r'(senha|password|token|key|secret)=([^ \s&]+)', censor_generic, text, flags=re.IGNORECASE)
    return text

def send_to_discord(webhook_url, content, message_id=None, command="unknown"):
    if not content.strip():
        return None
        
    content = censor_content(content)
    
    # Improved chunking that preserves lines and markdown structure
    max_len = 1900
    chunks = []
    current_chunk = ""
    
    for line in content.splitlines(keepends=True):
        if len(current_chunk) + len(line) > max_len:
            chunks.append(current_chunk)
            current_chunk = line
        else:
            current_chunk += line
    if current_chunk:
        chunks.append(current_chunk)
    
    headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'Antigravity-Bot/1.0'
    }
    
    last_response = None
    for i, chunk in enumerate(chunks):
        if i == 0 and message_id and message_id != "null":
            url = f"{webhook_url}/messages/{message_id}"
            method = 'PATCH'
        else:
            url = f"{webhook_url}?wait=true"
            method = 'POST'
            
        payload = {"content": chunk}
        data = json.dumps(payload, ensure_ascii=False).encode('utf-8')
        req = urllib.request.Request(url, data=data, headers=headers, method=method)
        
        try:
            with urllib.request.urlopen(req) as response:
                print(f"[OK] Mensagem enviada ({command}) - Chunk {i+1}/{len(chunks)}")
                res_body = response.read().decode('utf-8')
                last_response = json.loads(res_body) if res_body else {"status": "success"}
        except urllib.error.HTTPError as e:
            err_msg = e.read().decode('utf-8')
            print(f"[ERROR] Erro {e.code} ao enviar para Discord: {err_msg}")
            if method == 'PATCH' and (e.code == 404 or e.code == 403):
                return send_to_discord(webhook_url, content, message_id=None, command=command)
    return last_response

def load_state():
    if not os.path.exists(STATE_FILE):
        return {"checklist_message_id": None}
    try:
        with open(STATE_FILE, "r") as f:
            return json.load(f)
    except:
        return {"checklist_message_id": None}

def save_state(state):
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)

def main():
    if len(sys.argv) < 3:
        print("Usage: python scripts/discord_notifier.py {changelog|checklist|live} \"content\"")
        sys.exit(1)
    
    command = sys.argv[1]
    if sys.argv[2] == "-":
        try:
            # Try to reconfigure stdin to utf-8 if on Python 3.7+
            sys.stdin.reconfigure(encoding='utf-8')
        except AttributeError:
            pass
        content = sys.stdin.read()
    else:
        content = sys.argv[2]
    
    state = load_state()
    
    if command == "changelog":
        send_to_discord(WH_CHANGELOG, content)
    elif command == "checklist":
        response = send_to_discord(WH_CHECKLIST, content, state.get("checklist_message_id"))
        if response and "id" in response:
            state["checklist_message_id"] = response["id"]
            save_state(state)
    elif command == "new-checklist":
        send_to_discord(WH_CHECKLIST, content)
    elif command == "live" or command == "status":
        send_to_discord(WH_LIVE, content, command=command)

if __name__ == "__main__":
    main()
