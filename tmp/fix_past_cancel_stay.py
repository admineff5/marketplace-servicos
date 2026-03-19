import sys
f=open('c:/Antigravity/app/api/user/appointments/route.ts', 'r', encoding='utf-8')
c=f.read()
f.close()

search_code = "const past = appointments.filter((a: any) => new Date(a.date) <= now || (a.status === 'CANCELLED' && a.comment === null) || a.status === 'COMPLETED');"
replace_code = "const past = appointments.filter((a: any) => new Date(a.date) <= now || a.status === 'CANCELLED' || a.status === 'COMPLETED');"

if search_code in c:
    c = c.replace(search_code, replace_code)

f=open('c:/Antigravity/app/api/user/appointments/route.ts', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done')
