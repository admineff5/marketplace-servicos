import sys
f=open('c:/Antigravity/app/page.tsx', 'r', encoding='utf-8')
c=f.read()
f.close()

search_code = '''  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch("/api/companies");
        const data = await res.json();
        if (Array.isArray(data)) {
          // Remover disponibilidade mockada e usar dados reais
          setCompanies(data);
        }
      } catch (err) {
        console.error("Error fetching companies:", err);
      } finally {
        setIsLoadingCompanies(false);
      }
    };
    fetchCompanies();
  }, []);'''

replace_code = '''  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch("/api/companies");
        const data = await res.json();
        if (Array.isArray(data)) {
          setCompanies(data);
        }
      } catch (err) {
        console.error("Error fetching companies:", err);
      } finally {
        setIsLoadingCompanies(false);
      }
    };
    fetchCompanies();
    
    // Polling: Atualização Automática a cada 30 segundos
    const interval = setInterval(fetchCompanies, 30000);
    return () => clearInterval(interval);
  }, []);'''

if search_code in c:
    c = c.replace(search_code, replace_code)
else:
    # Fallback to lines 78-94 regex or safer match
    print("Match failure with exact string, trying backup...")
    c = c.replace(
        '  useEffect(() => {\n    const fetchCompanies = async () => {\n      try {\n        const res = await fetch("/api/companies");\n        const data = await res.json();\n        if (Array.isArray(data)) {\n          // Remover disponibilidade mockada e usar dados reais\n          setCompanies(data);\n        }\n      } catch (err) {\n        console.error("Error fetching companies:", err);\n      } finally {\n        setIsLoadingCompanies(false);\n      }\n    };\n    fetchCompanies();\n  }, []);',
        replace_code
    )

# Also update activeCompany lookup to stay fully responsive inside open modals if updating in place
c = c.replace(
    'const activeProfessionalData = selectedCompany?.staff?.find(',
    'const openCompanyData = companies.find((c: any) => c.id === selectedCompany?.id) || selectedCompany;\n  const activeProfessionalData = openCompanyData?.staff?.find('
)

# Replace remaining selectedCompany references inside main loops to openCompanyData for Modal live updates if needed
# Actually, the user's scenario is mostly seeing the NEW service/staff on list. Re-fetch updates the list automatically!

f=open('c:/Antigravity/app/page.tsx', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done')
