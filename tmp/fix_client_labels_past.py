import sys
f=open('c:/Antigravity/app/cliente/page.tsx', 'r', encoding='utf-8')
c=f.read()
f.close()

search_code = '''                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${item.status === 'cancelled' ? 'bg-red-500/10 text-red-600' : 'bg-green-500/10 text-green-600'}`}>
                                            {item.status === 'cancelled' ? 'Cancelado' : 'Realizado'}
                                        </span>'''

replace_code = '''                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${item.status === 'cancelled' ? 'bg-red-500/10 text-red-600' : 'bg-green-500/10 text-green-600'}`}>
                                            {item.status === 'cancelled' ? (item.comment ? 'Cancelado pela Loja' : 'Cancelado pelo Cliente') : 'Realizado'}
                                        </span>'''

if search_code in c:
    c = c.replace(search_code, replace_code)

f=open('c:/Antigravity/app/cliente/page.tsx', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done')
