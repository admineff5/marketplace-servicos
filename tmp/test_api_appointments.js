async function testApi() {
    try {
        // Como o script roda fora da sessão do browse, nós não temos os cookies de autenticação.
        // É melhor dar um log no console do response no proprio arquivo /app/dashboard/page.tsx
        // do que tentar forjar os cookies de auth_session no script node isolado.
        console.log("Para testar de verdade, vamos adicionar um console.log(aptData) no dashboard/page.tsx e ler a saída do terminal do Next.js!");
    } catch (e) {
        console.error(e);
    }
}

testApi();
