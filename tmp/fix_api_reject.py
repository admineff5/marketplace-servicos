import sys
f=open('c:/Antigravity/app/api/appointments/[id]/route.ts', 'r', encoding='utf-8')
c=f.read()
f.close()

search_code = '''        const { status, date } = body;

        const appointment = await prisma.appointment.update({
            where: { id },
            data: {
                status,
                date: date ? new Date(date) : undefined,
            },
        });'''

replace_code = '''        const { status, date, comment } = body;

        const appointment = await prisma.appointment.update({
            where: { id },
            data: {
                status,
                date: date ? new Date(date) : undefined,
                comment: comment !== undefined ? comment : undefined,
            },
        });'''

if search_code in c:
    c = c.replace(search_code, replace_code)

f=open('c:/Antigravity/app/api/appointments/[id]/route.ts', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done')
