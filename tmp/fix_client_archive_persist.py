import sys
f=open('c:/Antigravity/app/cliente/page.tsx', 'r', encoding='utf-8')
c=f.read()
f.close()

# 1. State initializer updates
state_marker = 'const [archivedIds, setArchivedIds] = useState<string[]>([]);'
state_code = '''const [archivedIds, setArchivedIds] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem("archived_appointments");
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    const handleArchive = (id: string) => {
        const next = [...archivedIds, id];
        setArchivedIds(next);
        if (typeof window !== 'undefined') {
            localStorage.setItem("archived_appointments", JSON.stringify(next));
        }
    };'''

if state_marker in c:
    c = c.replace(state_marker, state_code)

# 2. Update inline trigger in list actions
click_marker = 'onClick={() => setArchivedIds([...archivedIds, item.id])}'
click_replace = 'onClick={() => handleArchive(item.id)}'

if click_marker in c:
    c = c.replace(click_marker, click_replace)

f=open('c:/Antigravity/app/cliente/page.tsx', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done')
