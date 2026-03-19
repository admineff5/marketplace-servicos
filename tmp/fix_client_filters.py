import sys
f=open('c:/Antigravity/app/cliente/page.tsx', 'r', encoding='utf-8')
c=f.read()
f.close()

# 1. State definitions inclusion
state_marker = 'const [archivedIds, setArchivedIds] = useState<string[]>([]);'
state_code = '''const [archivedIds, setArchivedIds] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [clientStatusFilter, setClientStatusFilter] = useState("");'''

if state_marker in c:
    c = c.replace(state_marker, state_code)

# 2. Update Tabs bar to include Filter & Search Bar on the Right
tabs_marker = '''            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-800">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">'''

tabs_replace = '''            {/* Tabs e Filtros */}
            <div className="border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">'''

if tabs_marker in c:
    c = c.replace(tabs_marker, tabs_replace)

nav_end_marker = '''                    </button>
                </nav>
            </div>'''

nav_end_replace = '''                    </button>
                </nav>
                
                {/* Filtros em Linha */}
                <div className="flex items-center gap-2 pb-3 sm:pb-0">
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Pesquisar..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full sm:w-60 pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-600 transition-all text-gray-900 dark:text-white"
                        />
                    </div>
                    <select 
                        value={clientStatusFilter}
                        onChange={e => setClientStatusFilter(e.target.value)}
                        className="py-2 px-3 text-sm bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-600 transition-all text-gray-900 dark:text-white"
                    >
                        <option value="">Status</option>
                        <option value="confirmed">Confirmado</option>
                        <option value="cancelled">Cancelado</option>
                        {activeTab === "past" && <option value="completed">Realizado</option>}
                    </select>
                </div>
            </div>'''

if nav_end_marker in c:
    c = c.replace(nav_end_marker, nav_end_replace)

# 3. Update mappings to include search and status filters
upcoming_mapping_marker = 'upcoming.filter(item => !archivedIds.includes(item.id)).map(item => '
upcoming_mapping_replace = '''upcoming.filter(item => {
                        const matchesSearch = item.service.toLowerCase().includes(searchTerm.toLowerCase()) || item.company.toLowerCase().includes(searchTerm.toLowerCase());
                        const matchesStatus = !clientStatusFilter || item.status === clientStatusFilter;
                        return matchesSearch && matchesStatus && !archivedIds.includes(item.id);
                    }).map(item => '''

if upcoming_mapping_marker in c:
    c = c.replace(upcoming_mapping_marker, upcoming_mapping_replace)

# 4. For past mapping
past_mapping_marker = 'past.map(item => ('
past_mapping_replace = '''past.filter(item => {
                        const matchesSearch = item.service.toLowerCase().includes(searchTerm.toLowerCase()) || item.company.toLowerCase().includes(searchTerm.toLowerCase());
                        const matchesStatus = !clientStatusFilter || item.status === clientStatusFilter;
                        return matchesSearch && matchesStatus;
                    }).map(item => ('''

if past_mapping_marker in c:
    c = c.replace(past_mapping_marker, past_mapping_replace)

f=open('c:/Antigravity/app/cliente/page.tsx', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done')
