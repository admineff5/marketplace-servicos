import sys
f=open('c:/Antigravity/app/api/appointments/route.ts', 'r', encoding='utf-8')
c=f.read()
f.close()

search_code = '''                value: apt.service?.price || 0,
                status: apt.status,
                comment: apt.comment || "",
                date: apt.date,'''

replace_code = '''                value: apt.service?.price || 0,
                status: apt.status,
                comment: apt.comment,
                date: apt.date,'''

if search_code in c:
    c = c.replace(search_code, replace_code)

f=open('c:/Antigravity/app/api/appointments/route.ts', 'w', encoding='utf-8')
f.write(c)
f.close()

# 2. Update app/dashboard/consulta/page.tsx
f=open('c:/Antigravity/app/dashboard/consulta/page.tsx', 'r', encoding='utf-8')
c=f.read()
f.close()

# Update Filters choice Modal Option List
search_select = '''                                    <option value="">Todos</option>
                                    <option value="CONFIRMED">Confirmado</option>
                                    <option value="PENDING">Pendente</option>
                                    <option value="CANCELLED">Cancelado</option>'''

replace_select = '''                                    <option value="">Todos</option>
                                    <option value="CONFIRMED">Confirmado</option>
                                    <option value="PENDING">Pendente</option>
                                    <option value="CANCELLED_LOJA">Cancelado pela Loja</option>
                                    <option value="CANCELLED_CLIENTE">Cancelado pelo Cliente</option>'''

if search_select in c:
    c = c.replace(search_select, replace_select)

# Update match logics filter
search_match = "const matchesStatus = !appliedFilters.status || item.status === appliedFilters.status;"
replace_match = '''const matchesStatus = !appliedFilters.status || 
                (appliedFilters.status === "CANCELLED_LOJA" ? (item.status === "CANCELLED" && item.comment) :
                 appliedFilters.status === "CANCELLED_CLIENTE" ? (item.status === "CANCELLED" && !item.comment) :
                 item.status === appliedFilters.status);'''

if search_match in c:
    c = c.replace(search_match, replace_match)

f=open('c:/Antigravity/app/dashboard/consulta/page.tsx', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done')
