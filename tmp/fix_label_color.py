import sys
f=open('c:/Antigravity/app/dashboard/servicos/page.tsx', 'r', encoding='utf-8')
c=f.read()
f.close()
c=c.replace(
    '<span className="text-[10px] text-gray-400 font-normal normal-case">Opcional</span>',
    '<span className="text-[10px] text-green-500 font-bold normal-case bg-green-500/10 px-1 py-0.5 rounded">Opcional</span>'
)
f=open('c:/Antigravity/app/dashboard/servicos/page.tsx', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done')
