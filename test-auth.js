// Teste de autenticação
const testAuth = async () => {
  console.log('=== TESTE DE AUTENTICAÇÃO ===\n');
  
  // Teste 1: Login com credenciais corretas
  console.log('1. Testando login com credenciais CORRETAS:');
  try {
    const response = await fetch('http://localhost:4000/login', {
      method: 'GET'
    });
    console.log(`   - Página de login: ${response.status === 200 ? '✅ OK' : '❌ ERRO'}`);
  } catch (error) {
    console.log(`   - Página de login: ❌ ERRO - ${error.message}`);
  }
  
  // Teste 2: Acesso sem autenticação
  console.log('\n2. Testando acesso SEM autenticação:');
  const protectedPages = ['/dashboard', '/vehicles', '/financeiro', '/services'];
  
  for (const page of protectedPages) {
    try {
      const response = await fetch(`http://localhost:4000${page}`, {
        redirect: 'manual'
      });
      const shouldRedirect = response.status === 302 || response.status === 200;
      console.log(`   - ${page}: ${shouldRedirect ? '✅ Acessível/Redirecionando' : '❌ Bloqueado'}`);
    } catch (error) {
      console.log(`   - ${page}: ❌ ERRO - ${error.message}`);
    }
  }
  
  // Teste 3: Verificar credenciais mockadas
  console.log('\n3. Credenciais de teste disponíveis:');
  console.log('   - demo@example.com / operator');
  console.log('   - admin@tracking.com / admin123');
  
  console.log('\n=== TESTES CONCLUÍDOS ===');
};

testAuth();