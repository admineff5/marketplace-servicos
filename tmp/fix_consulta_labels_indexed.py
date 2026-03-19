import sys
f=open('c:/Antigravity/app/dashboard/consulta/page.tsx', 'r', encoding='utf-8')
c=f.readlines()
f.close()

# Update exact line 176 (index 175)
if 'row.status === \'CANCELLED\' ? \'Cancelado\'' in c[175] or 'row.status === "CANCELLED" ? "Cancelado"' in c[175]:
    c[175] = '                                                  row.status === \'CANCELLED\' ? (row.comment ? \'Cancelado pela Loja\' : \'Cancelado pelo Cliente\') : \n'
    print("Replace 176 success")
else:
    print("Fallback search")
    # Backup search
    found = False
    for i in range(160, 190):
        if 'row.status === \'CANCELLED\' ? \'Cancelado\'' in c[i] or 'row.status === "CANCELLED" ? "Cancelado"' in c[i]:
            c[i] = '                                                  row.status === \'CANCELLED\' ? (row.comment ? \'Cancelado pela Loja\' : \'Cancelado pelo Cliente\') : \n'
            print(f"Replace index {i} success")
            found = True
            break
    if not found:
        print("Everything failed")

f=open('c:/Antigravity/app/dashboard/consulta/page.tsx', 'w', encoding='utf-8')
f.writelines(c)
f.close()
print('Done')
