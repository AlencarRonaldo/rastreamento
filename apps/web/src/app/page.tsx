'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Trust Bar */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-800 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>Certificado ANATEL</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">🛡️</span>
              <span>Dados Criptografados</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-400">📞</span>
              <span>Suporte 24/7</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400">⭐</span>
              <span>+50mil usuários</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-lg border-b-2 border-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">LT</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-800">LacerdaTrack</span>
                <div className="text-xs text-blue-600 font-medium">PROTEÇÃO VEICULAR</div>
              </div>
            </div>
            <nav className="hidden lg:flex space-x-8">
              <a href="#servicos" className="text-slate-600 hover:text-blue-600 font-semibold transition-colors relative group">
                Serviços
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </a>
              <a href="#diferenciais" className="text-slate-600 hover:text-blue-600 font-semibold transition-colors relative group">
                Diferenciais
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </a>
              <a href="#planos" className="text-slate-600 hover:text-blue-600 font-semibold transition-colors relative group">
                Planos
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </a>
              <a href="#contato" className="text-slate-600 hover:text-blue-600 font-semibold transition-colors relative group">
                Contato
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </a>
            </nav>
            <div className="flex items-center space-x-3 ml-16">
              <Link
                href="/login"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                👤 Login/Criar Conta
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/95 to-slate-900/90"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                <span className="block text-white">Proteção</span>
                <span className="block bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  Completa
                </span>
                <span className="block text-3xl md:text-4xl lg:text-5xl text-blue-200 font-semibold">
                  Para Motoristas de Aplicativo
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-10 text-blue-100 leading-relaxed max-w-2xl">
                <strong className="text-white">Assistência 24h + Rastreamento GPS</strong> para motoristas de aplicativos e 
                proprietários de carros sem seguro. A partir de <strong className="text-orange-300">R$ 24,90/mês</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">🛡️</div>
                  <div className="text-sm font-semibold text-white">Assistência 24h</div>
                  <div className="text-xs text-blue-200">Guincho, chaveiro, pane seca</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">📍</div>
                  <div className="text-sm font-semibold text-white">GPS em Tempo Real</div>
                  <div className="text-xs text-blue-200">Localização precisa sempre</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">💰</div>
                  <div className="text-sm font-semibold text-white">Economia Garantida</div>
                  <div className="text-xs text-blue-200">A partir de R$ 24,90/mês</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/login"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-center"
                >
                  🚗 PROTEGER MEU CARRO AGORA
                </Link>
                <a
                  href="#planos"
                  className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-slate-900 transition-all duration-300 text-center"
                >
                  Ver Preços
                </a>
              </div>

              <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-blue-200">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-1">
                    <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                    <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white"></div>
                    <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white"></div>
                  </div>
                  <span>+50.000 usuários protegidos</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">★★★★★</span>
                  <span>4.8/5 avaliação</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/50 shadow-2xl">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Proteção Para Todos os Veículos</h3>
                  <p className="text-slate-300">Carros, motos e caminhões com GPS profissional</p>
                </div>
                
                {/* Mapa com GPS */}
                <div className="relative w-full h-80 rounded-2xl mb-8 overflow-hidden border border-slate-600/30">
                  {/* Mapa de fundo real */}
                  <div 
                    className="absolute inset-0 w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url('/mapa.png')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  ></div>
                  
                  {/* Overlay escuro para melhor contraste */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-blue-950/50 to-slate-900/60"></div>
                  
                  {/* Marcador GPS Carro */}
                  <div className="absolute left-20 top-16 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative group cursor-pointer">
                      {/* Pulso GPS */}
                      <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-30 scale-150"></div>
                      <div className="absolute inset-0 bg-blue-500 rounded-full animate-pulse opacity-40 scale-125"></div>
                      
                      {/* Marcador */}
                      <div className="relative w-6 h-6 bg-blue-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center group-hover:scale-125 transition-all">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        🚗 Carro Online
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-blue-500"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Marcador GPS Moto */}
                  <div className="absolute left-1/2 top-36 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative group cursor-pointer">
                      {/* Pulso GPS */}
                      <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-30 scale-150"></div>
                      <div className="absolute inset-0 bg-orange-500 rounded-full animate-pulse opacity-40 scale-125"></div>
                      
                      {/* Marcador */}
                      <div className="relative w-6 h-6 bg-orange-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center group-hover:scale-125 transition-all">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-3 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        🏍️ Moto Online
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-orange-500"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Marcador GPS Caminhão */}
                  <div className="absolute right-24 top-56 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative group cursor-pointer">
                      {/* Pulso GPS */}
                      <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-30 scale-150"></div>
                      <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse opacity-40 scale-125"></div>
                      
                      {/* Marcador */}
                      <div className="relative w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center group-hover:scale-125 transition-all">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        🚛 Caminhão Online
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-green-500"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Rota simulada */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path
                      d="M 80 64 Q 200 80 320 144 T 520 224"
                      stroke="rgba(59, 130, 246, 0.4)"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="10,5"
                      className="animate-pulse"
                    />
                  </svg>
                  
                  {/* Status badges */}
                  <div className="absolute top-4 right-4 space-y-2">
                    <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-lg px-3 py-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-xs font-bold">3 GPS ATIVOS</span>
                      </div>
                    </div>
                    <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-lg px-3 py-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <span className="text-blue-400 text-xs font-bold">TEMPO REAL</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Coordenadas simuladas */}
                  <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-600/50">
                    <div className="text-xs text-slate-300">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-green-400">📍</span>
                        <span>São Paulo, SP</span>
                      </div>
                      <div className="text-slate-400 text-xs">
                        -23.5505, -46.6333
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Benefícios */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30 text-center">
                    <div className="text-2xl mb-2">🚗</div>
                    <div className="text-sm font-semibold text-blue-300">Carros</div>
                    <div className="text-xs text-blue-200">Uber • Particular</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-4 border border-orange-500/30 text-center">
                    <div className="text-2xl mb-2">🏍️</div>
                    <div className="text-sm font-semibold text-orange-300">Motos</div>
                    <div className="text-xs text-orange-200">Delivery • Particular</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-4 border border-green-500/30 text-center">
                    <div className="text-2xl mb-2">🚛</div>
                    <div className="text-sm font-semibold text-green-300">Caminhões</div>
                    <div className="text-xs text-green-200">Carga • Transporte</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="mb-6">
              <span className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                🏆 SERVIÇOS PROFISSIONAIS
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              <span className="block">Proteção Completa para</span>
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Motoristas de Aplicativo
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Proteção completa para <strong className="text-blue-600">motoristas de aplicativos</strong> e 
              <strong className="text-blue-600">proprietários de carros sem seguro</strong>. 
              Assistência 24h + GPS a partir de <strong className="text-orange-600">R$ 24,90/mês</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <div className="group bg-white rounded-2xl p-3 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-blue-300 transform hover:-translate-y-2">
              <div className="text-center">
                <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                  <div className="absolute inset-0 bg-blue-500 rounded-2xl animate-ping opacity-20"></div>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Rastreador Profissional</h3>
                <p className="text-slate-600 mb-4 leading-relaxed text-sm">
                  Localização em tempo real especial para <strong>corridas Uber</strong>. 
                  Compartilhe com família para maior segurança.
                </p>
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-1 rounded-xl text-xs font-bold">
                  ✅ MONITORAMENTO 24/7
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-3 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-red-300 transform hover:-translate-y-2">
              <div className="text-center">
                <div className="relative w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                  <div className="absolute inset-0 bg-red-500 rounded-2xl animate-ping opacity-20"></div>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Sistema SOS de Emergência</h3>
                <p className="text-slate-600 mb-4 leading-relaxed text-sm">
                  Botão de pânico conectado à central 24h. 
                  <strong>Proteção especial</strong> para motoristas de aplicativo.
                </p>
                <div className="bg-gradient-to-r from-red-100 to-pink-100 text-red-800 px-3 py-1 rounded-xl text-xs font-bold">
                  🚨 RESPOSTA IMEDIATA
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-3 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-purple-300 transform hover:-translate-y-2">
              <div className="text-center">
                <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Funções Avançadas</h3>
                <p className="text-slate-600 mb-4 leading-relaxed text-sm">
                  <strong>Histórico completo</strong>, alertas personalizados, 
                  <strong>bloqueio e desbloqueio</strong> e <strong>cerca eletrônica</strong> para máxima segurança.
                </p>
                <div className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 px-3 py-1 rounded-xl text-xs font-bold">
                  🔧 FUNÇÕES AVANÇADAS
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-3 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-orange-300 transform hover:-translate-y-2">
              <div className="text-center">
                <div className="relative w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                  <div className="absolute inset-0 bg-orange-500 rounded-2xl animate-ping opacity-20"></div>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Assistência Completa 24h</h3>
                <p className="text-slate-600 mb-4 leading-relaxed text-sm">
                  <strong>Substitui o seguro:</strong> Guincho, chaveiro, 
                  borracheiro e socorro para pane seca.
                </p>
                <div className="bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 px-3 py-1 rounded-xl text-xs font-bold">
                  🛠️ ASSISTÊNCIA TOTAL
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assistência 24 Horas - Redesigned Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 opacity-30"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200 rounded-full opacity-20 blur-3xl translate-x-48 translate-y-48"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            {/* 24h Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              DISPONÍVEL 24 HORAS
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">
              Assistência Completa
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Suporte profissional 24/7 com tempos de resposta garantidos. <br/>
              <span className="text-slate-800 font-semibold">Todos os serviços inclusos no seu plano, sem cobrança extra.</span>
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-7xl mx-auto">
            {/* Guincho */}
            <div className="group bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 8h-3V4H3v12h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4c0 1.66 1.34 3 3 3s3-1.34 3-3h1v-5l-3-3zM8 17c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm8 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2-3h-1c0-1.66-1.34-3-3-3s-3 1.34-3 3H7c0-1.66-1.34-3-3-3s-3 1.34-3 3H5V6h10v2h3l2 2v3z"/>
                    <path d="M20 10l-2-2h-1v4h3v-2z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Guincho</h3>
                <p className="text-slate-600 mb-3 text-sm">Reboque 24h</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-1 text-slate-700">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-xs">até 50 min no ABC</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-green-600 font-medium text-xs">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Disponível
                  </div>
                </div>
              </div>
            </div>

            {/* Mecânico */}
            <div className="group bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4zM6.7 8.8c-.7.7-1.9.7-2.6 0-.7-.7-.7-1.9 0-2.6.7-.7 1.9-.7 2.6 0 .7.7.7 1.9 0 2.6z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Mecânico</h3>
                <p className="text-slate-600 mb-3 text-sm">Reparo no local</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-1 text-slate-700">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    <span className="font-medium text-xs">até 50 min no ABC</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-green-600 font-medium text-xs">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Disponível
                  </div>
                </div>
              </div>
            </div>

            {/* Bateria */}
            <div className="group bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.67 4H14V2c0-1.1-.9-2-2-2s-2 .9-2 2v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zM13 18.5h-2V16h2v2.5zm0-4h-2V12h2v2.5zm0-4h-2V8h2v2.5z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Bateria</h3>
                <p className="text-slate-600 mb-3 text-sm">Carga e troca</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-1 text-slate-700">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                    <span className="font-medium text-xs">até 50 min no ABC</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-green-600 font-medium text-xs">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Disponível
                  </div>
                </div>
              </div>
            </div>

            {/* Pneu */}
            <div className="group bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center hover:shadow-2xl hover:shadow-slate-500/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                    <circle cx="12" cy="12" r="3"/>
                    <circle cx="12" cy="8" r="1"/>
                    <circle cx="12" cy="16" r="1"/>
                    <circle cx="8" cy="12" r="1"/>
                    <circle cx="16" cy="12" r="1"/>
                    <circle cx="9.5" cy="9.5" r="0.5"/>
                    <circle cx="14.5" cy="14.5" r="0.5"/>
                    <circle cx="9.5" cy="14.5" r="0.5"/>
                    <circle cx="14.5" cy="9.5" r="0.5"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Pneu</h3>
                <p className="text-slate-600 mb-3 text-sm">Troca rápida</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-1 text-slate-700">
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
                    <span className="font-medium text-xs">até 50 min no ABC</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-green-600 font-medium text-xs">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Disponível
                  </div>
                </div>
              </div>
            </div>

            {/* Chaveiro */}
            <div className="group bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="6" cy="12" r="3"/>
                    <circle cx="6" cy="12" r="1"/>
                    <rect x="9" y="11" width="12" height="2"/>
                    <rect x="17" y="9" width="2" height="2"/>
                    <rect x="19" y="13" width="2" height="2"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Chaveiro</h3>
                <p className="text-slate-600 mb-3 text-sm">Abertura segura</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-1 text-slate-700">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span className="font-medium text-xs">até 50 min no ABC</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-green-600 font-medium text-xs">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Disponível
                  </div>
                </div>
              </div>
            </div>

            {/* Combustível */}
            <div className="group bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 2C4.9 2 4 2.9 4 4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm0 2h7v5h5v11H6V4zm2 10h8v2H8v-2zm0 3h8v2H8v-2z"/>
                    <path d="M19 7h-4V3l4 4z"/>
                    <rect x="8" y="6" width="2" height="6" rx="1"/>
                    <circle cx="9" cy="18" r="1"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Combustível</h3>
                <p className="text-slate-600 mb-3 text-sm">Entrega rápida</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-1 text-slate-700">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    <span className="font-medium text-xs">até 50 min no ABC</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-green-600 font-medium text-xs">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Disponível
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <button className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-xl">📞</div>
              Solicitar Assistência Agora
            </button>
            <p className="text-slate-600 mt-4 text-lg">Central de atendimento disponível 24 horas por dia, 7 dias por semana</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planos" className="py-24 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="mb-6">
              <span className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full text-sm font-bold">
                💎 PLANOS PROFISSIONAIS
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
              <span className="block">Escolha sua</span>
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Proteção Ideal
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              <strong className="text-blue-600">Assistência 24h inclusa</strong>. 
              Ideal para <strong className="text-orange-600">motoristas de aplicativo</strong> e 
              <strong className="text-orange-600">veículos sem seguro</strong>
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <div className="group bg-white border-2 border-slate-200 rounded-3xl p-8 hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col">
              <div className="text-center flex-1">
                <div className="mb-4">
                  <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold">
                    💰 ECONOMIA GARANTIDA
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Uber Básico</h3>
                <div className="mb-6">
                  <div className="text-5xl font-bold text-blue-600 mb-2">
                    R$ 24,90
                    <span className="text-lg text-slate-500 font-normal">/mês</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    <span className="line-through text-red-500">R$ 150</span> em seguro tradicional
                  </p>
                </div>
                
                <ul className="text-left space-y-4 mb-8 flex-1">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3 mt-1 font-bold">✓</span>
                    <span className="text-slate-700"><strong className="text-slate-900">GPS profissional</strong> para corridas Uber</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3 mt-1 font-bold">✓</span>
                    <span className="text-slate-700">App mobile completo</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3 mt-1 font-bold">✓</span>
                    <span className="text-slate-700">Histórico de <strong className="text-slate-900">30 dias</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3 mt-1 font-bold">✓</span>
                    <span className="text-slate-700">Suporte <strong className="text-slate-900">WhatsApp 24h</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3 mt-1 font-bold">✓</span>
                    <span className="text-slate-700"><strong className="text-slate-900">1 veículo</strong> protegido</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/login"
                className="w-full bg-gradient-to-r from-slate-600 to-slate-700 text-white py-4 rounded-2xl font-bold hover:from-slate-700 hover:to-slate-800 transition-all duration-300 text-center group-hover:shadow-lg transform group-hover:-translate-y-0.5"
              >
                🚗 Proteger Agora
              </Link>
            </div>

            {/* Pro Plan - Featured */}
            <div className="group bg-gradient-to-br from-blue-600 to-blue-700 border-2 border-blue-500 rounded-3xl p-8 transform scale-105 relative flex flex-col shadow-2xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-orange-400 to-yellow-400 text-slate-900 px-6 py-3 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                  ⭐ MAIS ESCOLHIDO
                </span>
              </div>
              
              <div className="text-center flex-1">
                <div className="mb-4">
                  <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold">
                    🏆 RECOMENDADO PARA UBER
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">Uber Pro</h3>
                <div className="mb-6">
                  <div className="text-5xl font-bold text-white mb-2">
                    R$ 44,90
                    <span className="text-lg text-blue-100 font-normal">/mês</span>
                  </div>
                  <p className="text-sm text-blue-100">
                    <span className="line-through text-red-300">R$ 300</span> em seguro premium
                  </p>
                </div>
                
                <ul className="text-left space-y-4 mb-8 text-white flex-1">
                  <li className="flex items-start">
                    <span className="text-orange-300 mr-3 mt-1">✓</span>
                    <span><strong>Botão SOS</strong> de emergência</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-300 mr-3 mt-1">✓</span>
                    <span><strong>5 cercas eletrônicas</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-300 mr-3 mt-1">✓</span>
                    <span><strong>Central 24h</strong> profissional</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-300 mr-3 mt-1">✓</span>
                    <span><strong>Guincho até 50km</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-300 mr-3 mt-1">✓</span>
                    <span><strong>Chaveiro + Borracheiro</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-300 mr-3 mt-1">✓</span>
                    <span><strong>1 veículo</strong></span>
                  </li>
                </ul>
              </div>
              <Link
                href="/login"
                className="w-full bg-white text-blue-600 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 text-center shadow-lg transform group-hover:-translate-y-0.5"
              >
                🚀 Começar Agora
              </Link>
            </div>

            {/* Business Plan */}
            <div className="group bg-white border-2 border-slate-200 rounded-3xl p-8 hover:border-orange-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col">
              <div className="text-center flex-1">
                <div className="mb-4">
                  <span className="bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 px-4 py-2 rounded-full text-sm font-bold">
                    👑 PROTEÇÃO MÁXIMA
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Uber Business</h3>
                <div className="mb-6">
                  <div className="text-5xl font-bold text-orange-600 mb-2">
                    R$ 79,90
                    <span className="text-lg text-slate-500 font-normal">/mês</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    <span className="line-through text-red-500">R$ 500</span> em seguro tradicional
                  </p>
                </div>
                
                <ul className="text-left space-y-4 mb-8 flex-1">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3 mt-1 font-bold">✓</span>
                    <span className="text-slate-700"><strong className="text-slate-900">Cercas ilimitadas</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3 mt-1 font-bold">✓</span>
                    <span className="text-slate-700"><strong className="text-slate-900">Análise comportamento</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3 mt-1 font-bold">✓</span>
                    <span className="text-slate-700"><strong className="text-slate-900">Alertas manutenção</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3 mt-1 font-bold">✓</span>
                    <span className="text-slate-700"><strong className="text-slate-900">Dashboard avançado</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3 mt-1 font-bold">✓</span>
                    <span className="text-slate-700"><strong className="text-slate-900">Guincho até 100km</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3 mt-1 font-bold">✓</span>
                    <span className="text-slate-700"><strong className="text-slate-900">Socorro pane seca</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3 mt-1 font-bold">✓</span>
                    <span className="text-slate-700"><strong className="text-slate-900">1 veículo</strong></span>
                  </li>
                </ul>
              </div>
              <Link
                href="/login"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-2xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 text-center group-hover:shadow-lg transform group-hover:-translate-y-0.5"
              >
                💼 Proteção Total
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Enhanced */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="mb-8">
              <span className="inline-block bg-gradient-to-r from-orange-400 to-yellow-400 text-slate-900 px-6 py-3 rounded-full text-sm font-bold">
                🚀 COMECE HOJE MESMO
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="block text-white">Proteja seu Carro</span>
              <span className="block bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Agora Mesmo
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Mais de <strong className="text-white">50.000 motoristas</strong> já economizam com nossa proteção. 
              <strong className="text-orange-300">Primeira semana grátis!</strong>
            </p>
            
            {/* Por que nos escolher */}
            <div className="grid md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="text-lg font-bold text-white mb-2">75% Mais Barato</h3>
                <p className="text-blue-100 text-sm">Proteção completa com preço justo, especialmente pensado para motoristas.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="text-lg font-bold text-white mb-2">Resposta Imediata</h3>
                <p className="text-blue-100 text-sm">Assistência em até 50 minutos no ABC. Sem burocracia, sem demora.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-3xl mb-3">🏆</div>
                <h3 className="text-lg font-bold text-white mb-2">Especialistas em Uber</h3>
                <p className="text-blue-100 text-sm">Focado em motoristas de app. Entendemos suas necessidades específicas.</p>
              </div>
            </div>
          </div>


          {/* Comparison Section */}
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/20 rounded-3xl p-8 mb-16 max-w-4xl mx-auto">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-6">💰 Compare e Economize</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-red-400 font-bold text-lg mb-2">❌ Outros Rastreadores</div>
                  <div className="text-3xl font-bold text-red-400 mb-4">R$ 80-150/mês</div>
                  <ul className="text-red-200 text-sm space-y-2">
                    <li>• Apenas rastreamento básico</li>
                    <li>• Sem assistência 24h</li>
                    <li>• Interface complicada</li>
                    <li>• Suporte limitado</li>
                    <li>• Taxas extras por serviços</li>
                  </ul>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-bold text-lg mb-2">✅ LacerdaTrack</div>
                  <div className="text-3xl font-bold text-green-400 mb-4">R$ 24,90/mês</div>
                  <ul className="text-green-200 text-sm space-y-2">
                    <li>• Rastreamento + Assistência 24h</li>
                    <li>• Guincho, pneu, bateria inclusos</li>
                    <li>• App fácil e intuitivo</li>
                    <li>• Suporte WhatsApp direto</li>
                    <li>• Preço fixo sem surpresas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link
                href="/login"
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-2xl hover:shadow-orange-500/25 transform hover:-translate-y-1 inline-block"
              >
                🚗 PROTEGER MEU CARRO GRÁTIS
              </Link>
              <a
                href="#planos"
                className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white px-8 py-5 rounded-2xl font-semibold text-lg hover:bg-white hover:text-slate-900 transition-all duration-300 inline-block"
              >
                Ver Preços
              </a>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-blue-200">
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Sem fidelidade</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Cancela quando quiser</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Garantia 7 dias</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Primeira semana grátis</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="bg-slate-900 text-white py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">LT</span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-white">LacerdaTrack</span>
                  <div className="text-xs text-blue-400 font-medium">PROTEÇÃO VEICULAR</div>
                </div>
              </div>
              <p className="text-slate-400 mb-8 max-w-md leading-relaxed">
                <strong className="text-white">Sistema completo de rastreamento veicular</strong> 
                especializado em motoristas de aplicativo e veículos sem seguro. Tecnologia de ponta com suporte 24/7.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Contato</h4>
              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-green-400 font-semibold mb-2 flex items-center space-x-2">
                    <span>📞</span><span>Central 24h</span>
                  </div>
                  <div className="text-slate-300">(11) 3000-0000</div>
                  <div className="text-xs text-slate-400">Sempre disponível</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Para Motoristas</h4>
              <ul className="space-y-3">
                <li className="text-slate-400">🚗 Motoristas de App</li>
                <li className="text-slate-400">🚙 Veículos sem Seguro</li>
                <li className="text-slate-400">💰 25% mais barato</li>
                <li className="text-slate-400">📞 Suporte WhatsApp</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-slate-400 text-sm">
                &copy; 2024 LacerdaTrack. Todos os direitos reservados.
              </div>
              <div className="flex space-x-6 text-sm text-slate-400">
                <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
                <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
                <a href="#" className="hover:text-white transition-colors">LGPD</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}