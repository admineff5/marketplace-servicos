import sys
f=open('c:/Antigravity/app/dashboard/consulta/page.tsx', 'r', encoding='utf-8')
c=f.read()
f.close()

search_code = '''                                                 {row.status === 'CONFIRMED' ? 'Confirmado' : 
                                                 row.status === 'PENDING' ? 'Pendente' : 
                                                 row.status === 'CANCELLED' ? 'Cancelado' : 
                                                 row.status === 'COMPLETED' ? 'Concluído' : row.status}'''

# row.status === 'CANCELLED' ? (row.comment ? 'Cancelado pela Loja' : 'Cancelado pelo Cliente') :
replace_code = '''                                                 {row.status === 'CONFIRMED' ? 'Confirmado' : 
                                                 row.status === 'PENDING' ? 'Pendente' : 
                                                 row.status === 'CANCELLED' ? (row.comment ? 'Cancelado pela Loja' : 'Cancelado pelo Cliente') : 
                                                 row.status === 'COMPLETED' ? 'Concluído' : row.status}'''

if search_code in c:
    c = c.replace(search_code, replace_code)

f=open('c:/Antigravity/app/dashboard/consulta/page.tsx', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done')
