'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-hot-toast';

interface EmergencyService {
  id: string;
  name: string;
  icon: string;
  description: string;
  estimatedTime: string;
  available: boolean;
}

interface ActiveRequest {
  id: string;
  service: string;
  status: 'requested' | 'dispatched' | 'arrived' | 'completed';
  estimatedTime: number;
  provider: {
    name: string;
    phone: string;
    rating: number;
  };
  location: {
    address: string;
    coordinates: [number, number];
  };
  requestedAt: string;
}

export default function ServicesPage() {
  const [activeRequest, setActiveRequest] = useState<ActiveRequest | null>({
    id: '1',
    service: 'Guincho',
    status: 'dispatched',
    estimatedTime: 25,
    provider: {
      name: 'João Carlos',
      phone: '(11) 99999-8888',
      rating: 4.8
    },
    location: {
      address: 'Av. Paulista, 1000 - Bela Vista, São Paulo',
      coordinates: [-23.5505, -46.6333]
    },
    requestedAt: '2024-01-15T14:30:00Z'
  });

  const emergencyServices: EmergencyService[] = [
    {
      id: 'tow',
      name: 'Guincho',
      icon: '🚛',
      description: 'Reboque 24 horas',
      estimatedTime: '30-45 min',
      available: true
    },
    {
      id: 'mechanic',
      name: 'Mecânico',
      icon: '🔧',
      description: 'Reparo no local',
      estimatedTime: '45-60 min',
      available: true
    },
    {
      id: 'battery',
      name: 'Bateria',
      icon: '🔋',
      description: 'Carga/troca de bateria',
      estimatedTime: '20-30 min',
      available: true
    },
    {
      id: 'tire',
      name: 'Pneu',
      icon: '⚫',
      description: 'Troca de pneu',
      estimatedTime: '15-25 min',
      available: true
    },
    {
      id: 'locksmith',
      name: 'Chaveiro',
      icon: '🔑',
      description: 'Abertura veicular',
      estimatedTime: '25-35 min',
      available: true
    },
    {
      id: 'fuel',
      name: 'Combustível',
      icon: '⛽',
      description: 'Entrega de combustível',
      estimatedTime: '20-40 min',
      available: true
    }
  ];

  const handleServiceRequest = (service: EmergencyService) => {
    if (activeRequest) {
      toast.error('Você já possui uma solicitação ativa!');
      return;
    }

    const newRequest: ActiveRequest = {
      id: Date.now().toString(),
      service: service.name,
      status: 'requested',
      estimatedTime: parseInt(service.estimatedTime.split('-')[1]),
      provider: {
        name: 'Aguardando...',
        phone: '',
        rating: 0
      },
      location: {
        address: 'Av. Paulista, 1000 - Bela Vista, São Paulo',
        coordinates: [-23.5505, -46.6333]
      },
      requestedAt: new Date().toISOString()
    };

    setActiveRequest(newRequest);
    toast.success(`Serviço de ${service.name} solicitado!`);

    // Simular resposta do sistema
    setTimeout(() => {
      setActiveRequest(prev => prev ? {
        ...prev,
        status: 'dispatched',
        provider: {
          name: 'João Carlos',
          phone: '(11) 99999-8888',
          rating: 4.8
        }
      } : null);
      toast.success('Profissional designado!');
    }, 3000);
  };

  const handleCancelRequest = () => {
    setActiveRequest(null);
    toast.success('Solicitação cancelada');
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'requested': return 'Solicitado';
      case 'dispatched': return 'Profissional a caminho';
      case 'arrived': return 'Profissional chegou';
      case 'completed': return 'Serviço concluído';
      default: return 'Status desconhecido';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested': return 'bg-yellow-100 text-yellow-800';
      case 'dispatched': return 'bg-blue-100 text-blue-800';
      case 'arrived': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Serviços de Emergência</h1>
        <p className="text-gray-600">Assistência 24 horas para seu veículo</p>
      </div>

      {/* Active Emergency Request */}
      {activeRequest && (
        <Card className="mb-8 border-red-200 bg-red-50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-red-800">
                🚨 Emergência Ativa
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(activeRequest.status)}`}>
                {getStatusText(activeRequest.status)}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Serviço</p>
                <p className="font-semibold">{activeRequest.service}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tempo Estimado</p>
                <p className="font-semibold">{activeRequest.estimatedTime} minutos</p>
              </div>
            </div>

            {activeRequest.provider.name !== 'Aguardando...' && (
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Profissional</p>
                  <p className="font-semibold">{activeRequest.provider.name}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm ml-1">{activeRequest.provider.rating}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contato</p>
                  <p className="font-semibold">{activeRequest.provider.phone}</p>
                </div>
              </div>
            )}

            <div className="mb-4">
              <p className="text-sm text-gray-600">Localização</p>
              <p className="font-semibold">{activeRequest.location.address}</p>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => window.open(`tel:${activeRequest.provider.phone}`)}
                disabled={!activeRequest.provider.phone}
              >
                📞 Ligar
              </Button>
              <Button variant="outline" onClick={handleCancelRequest}>
                ❌ Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Emergency Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {emergencyServices.map((service) => (
          <Card
            key={service.id}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => handleServiceRequest(service)}
          >
            <div className="p-6 text-center">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
              <p className="text-gray-600 mb-2">{service.description}</p>
              <p className="text-sm font-medium text-blue-600">
                ⏱️ {service.estimatedTime}
              </p>
              <div className="mt-4">
                {service.available ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✅ Disponível
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    ❌ Indisponível
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Service Coverage Area */}
      <Card>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">📍 Área de Cobertura</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Cobertura Nacional</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• São Paulo e Grande SP</li>
                <li>• Rio de Janeiro e Região</li>
                <li>• Belo Horizonte e RMBH</li>
                <li>• Brasília e Entorno</li>
                <li>• Principais rodovias</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Horário de Atendimento</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 24 horas por dia</li>
                <li>• 7 dias por semana</li>
                <li>• Feriados inclusos</li>
                <li>• Emergências prioritárias</li>
                <li>• Suporte via telefone</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Additional Services */}
      <Card className="mt-6">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">🛠️ Serviços Adicionais</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl mb-2">🏥</div>
              <h4 className="font-semibold">Socorro Médico</h4>
              <p className="text-sm text-gray-600">Emergências médicas</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🚗</div>
              <h4 className="font-semibold">Carro Reserva</h4>
              <p className="text-sm text-gray-600">Veículo substituto</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🏨</div>
              <h4 className="font-semibold">Hospedagem</h4>
              <p className="text-sm text-gray-600">Hotel de emergência</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">👨‍💼</div>
              <h4 className="font-semibold">Consultoria</h4>
              <p className="text-sm text-gray-600">Orientação técnica</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}