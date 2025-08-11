// Simple test to verify login logic
const mockLogin = async (email, password) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock successful login - support multiple demo accounts
  if ((email === 'admin@tracking.com' && password === 'admin123') ||
      (email === 'demo@example.com' && password === '123456')) {
    
    const isDemo = email === 'demo@example.com';
    
    return {
      user: {
        id: isDemo ? '2' : '1',
        email: email,
        name: isDemo ? 'Demo User' : 'Administrator',
        role: isDemo ? 'operator' : 'admin',
        avatar: `https://ui-avatars.com/api/?name=${isDemo ? 'Demo' : 'Admin'}&background=3b82f6&color=fff`,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date(),
      },
      token: 'mock-jwt-token-' + Date.now(),
    };
  }
  
  throw new Error('Credenciais inválidas');
};

// Test both credential sets
async function testLogin() {
  console.log('Testing login functionality...\n');
  
  // Test demo credentials
  try {
    console.log('Testing demo@example.com / 123456...');
    const result1 = await mockLogin('demo@example.com', '123456');
    console.log('✅ Demo login successful:', result1.user);
  } catch (error) {
    console.log('❌ Demo login failed:', error.message);
  }
  
  // Test admin credentials
  try {
    console.log('\nTesting admin@tracking.com / admin123...');
    const result2 = await mockLogin('admin@tracking.com', 'admin123');
    console.log('✅ Admin login successful:', result2.user);
  } catch (error) {
    console.log('❌ Admin login failed:', error.message);
  }
  
  // Test invalid credentials
  try {
    console.log('\nTesting invalid credentials...');
    const result3 = await mockLogin('invalid@email.com', 'wrongpassword');
    console.log('❌ This should not succeed');
  } catch (error) {
    console.log('✅ Invalid login correctly rejected:', error.message);
  }
}

testLogin();