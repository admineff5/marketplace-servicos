const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function seed() {
    console.log("🚀 Iniciando Seed de 30 empresas para teste de busca...");

    const niches = [
        { name: "Barbearia", examples: ["Barba & Navalha", "Corte de Ouro", "The Gentlemen", "Barbearia do Zé", "Navalha Afiada", "Barber Shop Elite", "Vintage Barber", "Style & Cut", "Dono do Estilo", "Viking Barber"] },
        { name: "Clínica", examples: ["Clínica Bem Estar", "Saúde Total", "Centro Médico Vida", "Clínica Sorella", "Care & Health", "Viver Bem", "MedCenter", "Espaço Saúde", "Clínica Santê", "Harmony Medical"] },
        { name: "Estética", examples: ["Studio Beauty", "Espaço Glamour", "Estética Renovare", "Pele de Seda", "GlowUp Studio", "Harmonize Estética", "Pureza & Beleza", "Divina Face", "Realce Estética", "Luxor Beauty"] }
    ];

    const locations = [
        { city: "São Paulo", state: "SP", neighborhoods: ["Moema", "Itaim Bibi", "Pinheiros", "Vila Mariana", "Jardins"], ceps: ["04515-030", "04533-000", "05419-000", "04106-000", "01415-000"] },
        { city: "Rio de Janeiro", state: "RJ", neighborhoods: ["Copacabana", "Ipanema", "Leblon", "Barra da Tijuca", "Botafogo"], ceps: ["22020-001", "22410-000", "22430-040", "22631-000", "22250-040"] },
        { city: "Curitiba", state: "PR", neighborhoods: ["Batel", "Centro", "Bigorrilho", "Santa Felicidade", "Água Verde"], ceps: ["80420-090", "80010-000", "80730-000", "82020-000", "80240-000"] }
    ];

    const schedules = [
        "Segunda a Sexta | 09:00-18:00",
        "Segunda a Sábado | 08:00-20:00",
        "Terça a Sábado | 10:00-22:00",
        "Segunda a Sexta | 13:00-22:00",
        "Sábado e Domingo | 09:00-15:00"
    ];

    const password = await bcrypt.hash("teste123", 12);

    for (let i = 0; i < niches.length; i++) {
        const niche = niches[i];
        for (let j = 0; j < 10; j++) {
            const companyName = niche.examples[j];
            const email = `test_${niche.name.toLowerCase()}_${j}@eff5.com.br`;
            const phone = `55${Math.floor(10000000000 + Math.random() * 90000000000)}`;
            const cpf = `${Math.floor(10000000000 + Math.random() * 90000000000)}`.substring(0, 11);

            // 1. Create User
            const user = await prisma.user.create({
                data: {
                    name: `Dono ${companyName}`,
                    email,
                    password,
                    phone,
                    role: "BUSINESS",
                    cpf,
                    emailVerified: true
                }
            });

            // 2. Create Company
            const company = await prisma.company.create({
                data: {
                    ownerId: user.id,
                    name: companyName,
                    niche: niche.name,
                    legalName: `${companyName} LTDA`,
                    imageUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800"
                }
            });

            // 3. Create Location (Store)
            const locInfo = locations[Math.floor(Math.random() * locations.length)];
            const neighborhood = locInfo.neighborhoods[Math.floor(Math.random() * locInfo.neighborhoods.length)];
            const cep = locInfo.ceps[Math.floor(Math.random() * locInfo.ceps.length)];
            
            const location = await prisma.location.create({
                data: {
                    companyId: company.id,
                    name: "Unidade Principal",
                    cep,
                    address: `Rua de Teste, ${Math.floor(Math.random() * 1000)}`,
                    number: `${Math.floor(Math.random() * 500)}`,
                    neighborhood,
                    city: locInfo.city,
                    state: locInfo.state
                }
            });

            // 4. Create Employee (Professional)
            const schedule = schedules[Math.floor(Math.random() * schedules.length)];
            await prisma.employee.create({
                data: {
                    companyId: company.id,
                    locationId: location.id,
                    name: `Profissional ${companyName}`,
                    hours: schedule,
                    role: niche.name === "Barbearia" ? "Barbeiro" : niche.name === "Clínica" ? "Médico" : "Esteticista"
                }
            });

            // 5. Create a Service
            await prisma.service.create({
                data: {
                    companyId: company.id,
                    name: `Serviço Padrão ${niche.name}`,
                    price: 50 + Math.random() * 100,
                    duration: 30 + Math.floor(Math.random() * 3) * 15
                }
            });

            console.log(`✅ [${j+1}/30] Criado: ${companyName} (${niche.name}) em ${locInfo.city} - ${neighborhood}`);
        }
    }

    console.log("✨ SEED CONCLUÍDO COM SUCESSO!");
}

seed()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
