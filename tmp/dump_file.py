import sys
f=open('c:/Antigravity/app/dashboard/consulta/page.tsx', 'r', encoding='utf-8')
c=f.readlines()
f.close()

# Print lines 170-180
for i in range(165, 180):
    if i < len(c):
        print(f"{i+1}: {repr(c[i])}")
