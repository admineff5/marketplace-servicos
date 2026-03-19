import sys
f=open('c:/Antigravity/app/api/user/appointments/route.ts', 'r', encoding='utf-8')
c=f.read()
f.close()

# 1. Backend update: Let Cancelled with Comment stay in Upcoming
search_55 = "const upcoming = appointments.filter((a: any) => new Date(a.date) > now && a.status !== 'CANCELLED');\n        const past = appointments.filter((a: any) => new Date(a.date) <= now || a.status === 'CANCELLED' || a.status === 'COMPLETED');"
replace_55 = "const upcoming = appointments.filter((a: any) => new Date(a.date) > now && (a.status !== 'CANCELLED' || (a.status === 'CANCELLED' && a.comment !== null)));\n        const past = appointments.filter((a: any) => new Date(a.date) <= now || (a.status === 'CANCELLED' && a.comment === null) || a.status === 'COMPLETED');"

if search_55 in c:
    c = c.replace(search_55, replace_55)

f=open('c:/Antigravity/app/api/user/appointments/route.ts', 'w', encoding='utf-8')
f.write(c)
f.close()

# 2. Frontend update: app/cliente/page.tsx
f=open('c:/Antigravity/app/cliente/page.tsx', 'r', encoding='utf-8')
c=f.read()
f.close()

# Add Archived State to client page
state_marker = 'const [isLoading, setIsLoading] = useState(true);'
state_code = 'const [isLoading, setIsLoading] = useState(true);\n    const [archivedIds, setArchivedIds] = useState<string[]>([]);'

if state_marker in c:
    c = c.replace(state_marker, state_code)

# Update Tag render logic in upcoming card
tag_marker = '''                                <div className="absolute top-3 right-3">
                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full shadow-sm backdrop-blur-sm ${item.status === 'confirmed' ? 'bg-green-500/90 text-white' : 'bg-yellow-500/90 text-black'}`}>
                                        {item.status === 'confirmed' ? 'Confirmado' : 'Aguardando'}
                                    </span>
                                </div>'''

tag_replace = '''                                <div className="absolute top-3 right-3">
                                    {item.status === 'cancelled' ? (
                                        <span className="px-2.5 py-1 text-xs font-bold rounded-full shadow-sm backdrop-blur-sm bg-red-600 text-white">
                                            Recusado pela Loja
                                        </span>
                                    ) : (
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full shadow-sm backdrop-blur-sm ${item.status === 'confirmed' ? 'bg-green-500/90 text-white' : 'bg-yellow-500/90 text-black'}`}>
                                            {item.status === 'confirmed' ? 'Confirmado' : 'Aguardando'}
                                        </span>
                                    )}
                                </div>'''

if tag_marker in c:
    c = c.replace(tag_marker, tag_replace)

# Render comment inside Upcoming card as well if cancelled
card_info_marker = '''                                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400">'''
card_info_replace = '''                                    {item.status === 'cancelled' && item.comment && (
                                        <p className="text-xs text-red-600 dark:text-red-400 mb-2 italic font-semibold border-l-2 border-red-500 pl-2">Motivo da recusa: "{item.comment}"</p>
                                    )}
                                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400">'''

if card_info_marker in c:
    c = c.replace(card_info_marker, card_info_replace)

# Add Archivied Button in Upcoming Actions
actions_marker = '''                                        <div className="flex gap-2 w-full">
                                            <button onClick={() => handleCancel(item.id)} className="flex-1 px-3 py-2 border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">Cancelar</button>
                                            <button onClick={() => handleRebook(item)} className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Reagendar</button>
                                        </div>'''

actions_replace = '''                                        <div className="flex gap-2 w-full">
                                            {item.status !== 'cancelled' ? (
                                                <>
                                                    <button onClick={() => handleCancel(item.id)} className="flex-1 px-3 py-2 border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">Cancelar</button>
                                                    <button onClick={() => handleRebook(item)} className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Reagendar</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => handleRebook(item)} className="flex-1 px-3 py-2 border border-gray-100 bg-gray-50 text-gray-800 font-bold rounded-xl text-xs hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-700 transition-all">Reagendar</button>
                                                    <button onClick={() => setArchivedIds([...archivedIds, item.id])} className="flex-1 px-3 py-2 border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">Arquivar</button>
                                                </>
                                            )}
                                        </div>'''

if actions_marker in c:
    c = c.replace(actions_marker, actions_replace)

# Filter out archived ids in upcoming mapping
mapping_marker = 'upcoming.map(item => '
mapping_replace = 'upcoming.filter(item => !archivedIds.includes(item.id)).map(item => '

if mapping_marker in c:
    c = c.replace(mapping_marker, mapping_replace)

f=open('c:/Antigravity/app/cliente/page.tsx', 'w', encoding='utf-8')
f.write(c)
f.close()

print('Done')
