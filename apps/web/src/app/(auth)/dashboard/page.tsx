'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/stats-card';
import { AlertsList } from '@/components/dashboard/alerts-list';
import { VehiclesList } from '@/components/dashboard/vehicles-list';
import { ActivityChart } from '@/components/dashboard/activity-chart';
import { useVehiclesStore } from '@/store/vehicles';
import { useAuthStore } from '@/store/auth';
import { cn } from '@/lib/utils';
import {
  Car,
  Activity,
  AlertTriangle,
  MapPin,
  TrendingUp,
  Fuel,
  Clock,
  Users
} from 'lucide-react';
import { formatDistance, formatSpeed } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { vehicles, stats, getActiveAlerts, getOnlineVehicles, getMovingVehicles } = useVehiclesStore();
  const [selectedVehicleId, setSelectedVehicleId] = React.useState<string | null>(null);

  const activeAlerts = getActiveAlerts();
  const onlineVehicles = getOnlineVehicles();
  const movingVehicles = getMovingVehicles();

  const handleVehicleClick = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
  };

  const totalDistance = React.useMemo(() => {
    return vehicles.reduce((sum, vehicle) => sum + vehicle.totalDistance, 0);
  }, [vehicles]);

  const avgSpeed = React.useMemo(() => {
    if (movingVehicles.length === 0) return 0;
    return movingVehicles.reduce((sum, vehicle) => sum + vehicle.speed, 0) / movingVehicles.length;
  }, [movingVehicles]);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Bem-vindo de volta, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground">
          Aqui está o resumo dos seus veículos hoje
        </p>
      </div>

      {/* Stats and Alerts Grid */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <StatsCard
          title="Total de Veículos"
          value={vehicles.length.toString()}
          description={`${onlineVehicles.length} online`}
          icon={Car}
          trend={onlineVehicles.length > 0 ? 'up' : 'neutral'}
          compact
        />
        
        <StatsCard
          title="Em Movimento"
          value={movingVehicles.length.toString()}
          description={`de ${vehicles.length} veículos`}
          icon={Activity}
          trend={movingVehicles.length > 0 ? 'up' : 'neutral'}
          compact
        />
        
        <StatsCard
          title="Distância Total"
          value={formatDistance(totalDistance)}
          description="Todos os veículos"
          icon={MapPin}
          trend="up"
          compact
        />

        {/* Alertas Recentes Card - Enhanced */}
        <Card className="h-full">
          <CardContent className="p-4">
            <div className="flex items-center justify-between space-y-0 pb-1">
              <h3 className="tracking-tight font-medium text-xs">Alertas Recentes</h3>
              <AlertTriangle className={cn(
                "h-3 w-3",
                activeAlerts.length > 0 ? "text-red-500" : "text-muted-foreground"
              )} />
            </div>
            
            <div className="space-y-1">
              <div className="text-lg font-bold">{activeAlerts.length}</div>
              
              {activeAlerts.length > 0 ? (
                <div className="space-y-1">
                  {activeAlerts.slice(0, 2).map((alert, index) => {
                    const alertTypeLabels = {
                      speed_limit: 'Excesso de Velocidade',
                      geofence_enter: 'Entrada em Área',
                      geofence_exit: 'Saída de Área',
                      panic_button: 'Botão de Pânico',
                      engine_on: 'Motor Ligado',
                      engine_off: 'Motor Desligado',
                      low_battery: 'Bateria Baixa',
                      low_fuel: 'Combustível Baixo',
                      maintenance_due: 'Manutenção Pendente',
                      device_offline: 'Dispositivo Offline',
                      accident_detected: 'Acidente Detectado',
                      harsh_driving: 'Condução Brusca',
                      idle_time: 'Tempo Parado',
                      route_deviation: 'Desvio de Rota',
                    };
                    
                    return (
                      <div key={index} className="text-xs text-muted-foreground border-l-2 border-red-400 pl-2">
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                          <span className="font-medium">{alertTypeLabels[alert.type] || alert.type}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {alert.message?.includes('Caminhão A001') ? 'Caminhão A001' :
                           alert.message?.includes('Van B002') ? 'Van B002' :
                           'Veículo #' + (index + 1)}
                        </div>
                      </div>
                    );
                  })}
                  {activeAlerts.length > 2 && (
                    <div className="text-xs text-gray-400 text-center pt-1">
                      +{activeAlerts.length - 2} mais
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Tudo normal</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade dos Veículos</CardTitle>
            <CardDescription>
              Movimentação dos veículos nas últimas 24 horas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityChart vehicles={vehicles} />
          </CardContent>
        </Card>

        {/* Vehicles List */}
        <Card>
          <CardHeader>
            <CardTitle>Status dos Veículos</CardTitle>
            <CardDescription>
              Resumo do status atual de cada veículo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VehiclesList
              vehicles={vehicles.slice(0, 8)}
              onVehicleClick={handleVehicleClick}
              selectedVehicleId={selectedVehicleId}
              compact
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}