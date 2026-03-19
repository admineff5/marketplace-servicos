import sys
f=open('c:/Antigravity/app/dashboard/consulta/page.tsx', 'r', encoding='utf-8')
c=f.read()
f.close()

search_code = "{row.status === 'CANCELLED' ? 'Cancelado' : "
replace_code = "{row.status === 'CANCELLED' ? (row.comment ? 'Cancelado pela Loja' : 'Cancelado pelo Cliente') : "

if search_code in c:
    c = c.replace(search_code, replace_code)
    print("Match 1 Success")
else:
    # Try with double quotes
    search_code2 = '{row.status === "CANCELLED" ? "Cancelado" : '
    if search_code2 in c:
        c = c.replace(search_code2, replace_code)
        print("Match 2 Success")
    else:
        print("Match Failure")

f=open('c:/Antigravity/app/dashboard/consulta/page.tsx', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done')
