import sys
f=open('c:/Antigravity/app/api/appointments/route.ts', 'r', encoding='utf-8')
c=f.read()
f.close()

search_code = '''                value: apt.service?.price || 0,
                status: apt.status,
                date: apt.date,'''

replace_code = '''                value: apt.service?.price || 0,
                status: apt.status,
                comment: apt.comment || "",
                date: apt.date,'''

if search_code in c:
    c = c.replace(search_code, replace_code)

f=open('c:/Antigravity/app/api/appointments/route.ts', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done')
