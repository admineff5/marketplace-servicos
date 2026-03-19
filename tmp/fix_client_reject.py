import sys
f=open('c:/Antigravity/app/cliente/page.tsx', 'r', encoding='utf-8')
c=f.read()
f.close()

search_code = '''                                    <div>
                                        <h3 className="text-md font-bold text-gray-900 dark:text-white mb-0.5">{item.service}</h3>
                                        <p className="font-medium text-gray-500 text-sm">{item.company}</p>
                                    </div>'''

replace_code = '''                                    <div>
                                        <h3 className="text-md font-bold text-gray-900 dark:text-white mb-0.5">{item.service}</h3>
                                        <p className="font-medium text-gray-500 text-sm">{item.company}</p>
                                        {item.status === 'cancelled' && item.comment && (
                                            <p className="text-xs text-red-600 dark:text-red-400 mt-1.5 italic font-semibold border-l-2 border-red-500 pl-2">Motivo: "{item.comment}"</p>
                                        )}
                                    </div>'''

if search_code in c:
    c = c.replace(search_code, replace_code)

f=open('c:/Antigravity/app/cliente/page.tsx', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done')
