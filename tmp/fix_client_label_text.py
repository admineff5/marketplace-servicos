import sys
f=open('c:/Antigravity/app/cliente/page.tsx', 'r', encoding='utf-8')
c=f.read()
f.close()

search_code = '''                                        <span className="px-2.5 py-1 text-xs font-bold rounded-full shadow-sm backdrop-blur-sm bg-red-600 text-white">
                                            Recusado pela Loja
                                        </span>'''

replace_code = '''                                        <span className="px-2.5 py-1 text-xs font-bold rounded-full shadow-sm backdrop-blur-sm bg-red-600 text-white">
                                            Cancelado pela Loja
                                        </span>'''

if search_code in c:
    c = c.replace(search_code, replace_code)

f=open('c:/Antigravity/app/cliente/page.tsx', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done')
