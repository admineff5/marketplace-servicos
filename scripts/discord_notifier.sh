#!/bin/bash

# Webhooks
WH_CHANGELOG="https://discord.com/api/webhooks/1481018142657351883/Ucam0lKR08sCBfzmKtVrXqluSA2H7JPVE0QowPv52cElGUxyHx4PuUUo-eT1zeZV9tCw"
WH_CHECKLIST="https://discord.com/api/webhooks/1481018283896340482/ez0iIVgFq6NxOk6iogAl85FO5zIHgvFSi5AhyQKfePDkdmMcZgUjwOR0kOOY1Z_M7hoR"
WH_LIVE="https://discord.com/api/webhooks/1481018439949615199/ull1wXE445yCJqQBB41yyeK5PaYfOdFIKY3g2e_h2gv_iEHHeRllCoZql3D6i2h145d5"

STATE_FILE="manutencao/discord_state.json"

# Função para censurar dados sensíveis
censor_content() {
    local text="$1"
    
    # Censurar IPs (ex: 127.0.0.1 -> 127.XXX.XXX.XXX)
    text=$(echo "$text" | sed -E 's/([0-9]{1,3})\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/\1.XXX.XXX.XXX/g')
    
    # Censurar URLs de Banco (postgresql://user:pass@host...)
    text=$(echo "$text" | sed -E 's/(postgresql:\/\/)([^:]+):([^@]+)@([^/]+)/\1\2:XXXXXX@\4/g')
    
    # Censurar senhas e tokens genéricos (senha=123, password=123)
    text=$(echo "$text" | sed -E 's/(senha|password|token)=([^ &]+)/\1=XXXXXX/gI')

    echo "$text"
}

# Enviar para o Changelog (manda tudo ou incrementos)
send_changelog() {
    local content="$1"
    content=$(censor_content "$content")
    
    # Discord tem limite de 2000 chars. Se for maior, precisamos quebrar.
    # Para o changelog inicial, vamos mandar em blocos.
    echo "$content" | fold -s -w 1900 | while read -r line; do
        if [ ! -z "$line" ]; then
            curl -H "Content-Type: application/json" -X POST -d "{\"content\": \"$line\"}" "$WH_CHANGELOG"
        fi
    done
}

# Enviar/Editar Checklist
send_checklist() {
    local content="$1"
    content=$(censor_content "$content")
    
    # Tenta ler o message_id do estado
    local msg_id=$(grep -oP '(?<="checklist_message_id": ")[^"]*' "$STATE_FILE")
    
    if [ "$msg_id" != "null" ] && [ ! -z "$msg_id" ]; then
        # Editar mensagem existente
        local response=$(curl -s -H "Content-Type: application/json" -X PATCH -d "{\"content\": \"$content\"}" "$WH_CHECKLIST/messages/$msg_id")
        
        # Se a edição falhou (ex: mensagem deletada), cria uma nova
        if [[ $response == *"Unknown Message"* ]]; then
             msg_id="null"
        fi
    fi
    
    if [ "$msg_id" == "null" ] || [ -z "$msg_id" ]; then
        # Criar nova mensagem
        local response=$(curl -s -H "Content-Type: application/json" -X POST -d "{\"content\": \"$content\"}" "$WH_CHECKLIST?wait=true")
        local new_id=$(echo "$response" | grep -oP '(?<="id": ")[^"]*')
        
        # Salvar o novo ID no estado
        sed -i "s/\"checklist_message_id\": .*/\"checklist_message_id\": \"$new_id\"/" "$STATE_FILE"
    fi
}

# Logs ao vivo
send_live() {
    local content="$1"
    content=$(censor_content "$content")
    curl -H "Content-Type: application/json" -X POST -d "{\"content\": \"$content\"}" "$WH_LIVE"
}

# Command line interface
case "$1" in
    changelog)
        send_changelog "$2"
        ;;
    checklist)
        send_checklist "$2"
        ;;
    live)
        send_live "$2"
        ;;
    *)
        echo "Usage: $0 {changelog|checklist|live} \"content\""
        exit 1
esac
