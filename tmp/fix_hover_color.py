import sys
f=open('c:/Antigravity/app/dashboard/servicos/page.tsx', 'r', encoding='utf-8')
c=f.read()
f.close()
c=c.replace(
    '<span className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-primary">{cat}</span>',
    '<span className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-cyan-700 dark:group-hover:text-primary">{cat}</span>'
)
c=c.replace(
    '<div className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-cyan-700 dark:hover:text-primary transition-colors">{srv.name}</div>',
    '<div className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-primary transition-colors">{srv.name}</div>'
)
f=open('c:/Antigravity/app/dashboard/servicos/page.tsx', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done')
