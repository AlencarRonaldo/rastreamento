'use client';

import Link from 'next/link';

export default function TestMenuPage() {
  const menuItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Veículos', href: '/vehicles' },
    { name: 'Financeiro', href: '/financeiro' },
    { name: 'Serviços', href: '/services' },
  ];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Teste de Menu - Links Diretos</h1>
      
      <div className="grid gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block p-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Ir para {item.name} ({item.href})
          </Link>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <p className="text-sm text-gray-600">
          Se você consegue ver esta página, você está autenticado.
          Use os links acima para testar o acesso direto às páginas.
        </p>
      </div>
    </div>
  );
}