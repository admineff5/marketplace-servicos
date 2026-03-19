import sys
f=open('c:/Antigravity/app/dashboard/layout.tsx', 'r', encoding='utf-8')
c=f.read()
f.close()
c=c.replace(
    '    { name: "Leads", href: "/dashboard/leads", icon: Target },\n',
    ''
)
f=open('c:/Antigravity/app/dashboard/layout.tsx', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done')
