import sys
f=open('c:/Antigravity/app/dashboard/agenda/page.tsx', 'r', encoding='utf-8')
c=f.read()
f.close()
c=c.replace(
    '(selectedPros.length === 0 || selectedPros.includes(apt.employeeId) || selectedPros.includes(apt.employee?.id) || selectedPros.includes(apt.prof))',
    '(selectedPros.includes(apt.employeeId) || selectedPros.includes(apt.employee?.id) || selectedPros.includes(apt.prof))'
)
f=open('c:/Antigravity/app/dashboard/agenda/page.tsx', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done')
