import sys
f=open('c:/Antigravity/app/dashboard/agenda/page.tsx', 'r', encoding='utf-8')
c=f.read()
f.close()

search_code = '''                                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md ${getStatusStyle(apt.status)}`}>
                                                                {translateStatus(apt.status || 'Confirmado')}
                                                            </span>'''

replace_code = '''                                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md ${getStatusStyle(apt.status)}`}>
                                                                {apt.status === 'CANCELLED' ? (apt.comment ? 'Cancelado pela Loja' : 'Cancelado pelo Cliente') : translateStatus(apt.status || 'Confirmado')}
                                                            </span>'''

if search_code in c:
    c = c.replace(search_code, replace_code)

f=open('c:/Antigravity/app/dashboard/agenda/page.tsx', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done')
