import sys
f=open('c:/Antigravity/app/cliente/page.tsx', 'r', encoding='utf-8')
c=f.read()
f.close()

# 1. Update Dropdown Options
search_select = '''                        <option value="">Status</option>
                        <option value="confirmed">Confirmado</option>
                        <option value="cancelled">Cancelado</option>'''

replace_select = '''                        <option value="">Status</option>
                        <option value="confirmed">Confirmado</option>
                        <option value="cancelled_loja">Cancelado pela Loja</option>
                        <option value="cancelled_cliente">Cancelado pelo Cliente</option>'''

if search_select in c:
    c = c.replace(search_select, replace_select)

# 2. Update upcoming mapping filter match
search_match_upcoming = "const matchesStatus = !clientStatusFilter || item.status === clientStatusFilter;"
replace_match_upcoming = '''const matchesStatus = !clientStatusFilter || 
                            (clientStatusFilter === "cancelled_loja" ? (item.status === "cancelled" && item.comment) :
                             clientStatusFilter === "cancelled_cliente" ? (item.status === "cancelled" && !item.comment) :
                             item.status === clientStatusFilter);'''

if search_match_upcoming in c:
    # Use replace but limited to 1 count if we want to isolate upcoming vs past or multiply
    # We will replace ALL occurrences since they belong to similar match block definitions!
    c = c.replace(search_match_upcoming, replace_match_upcoming)

f=open('c:/Antigravity/app/cliente/page.tsx', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done')
