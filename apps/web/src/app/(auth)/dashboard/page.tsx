'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DynamicMapView as MapView } from '@/components/map/dynamic-map-view';
import { StatsCard } from '@/components/dashboard/stats-card';
import { AlertsList } from '@/components/dashboard/alerts-list';
import { VehiclesList } from '@/components/dashboard/vehicles-list';
import { ActivityChart } from '@/components/dashboard/activity-chart';
import { useVehiclesStore } from '@/store/vehicles';
import { useAuthStore } from '@/store/auth';
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
          Aqui está o resumo da sua frota hoje
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Veículos"
          value={vehicles.length.toString()}
          description={`${onlineVehicles.length} online`}
          icon={Car}
          trend={onlineVehicles.length > 0 ? 'up' : 'neutral'}
        />
        
        <StatsCard
          title="Em Movimento"
          value={movingVehicles.length.toString()}
          description={`de ${vehicles.length} veículos`}
          icon={Activity}
          trend={movingVehicles.length > 0 ? 'up' : 'neutral'}
        />
        
        <StatsCard
          title="Alertas Ativos"
          value={activeAlerts.length.toString()}
          description="Requer atenção"
          icon={AlertTriangle}
          trend={activeAlerts.length > 0 ? 'down' : 'up'}
          variant={activeAlerts.length > 0 ? 'destructive' : 'default'}
        />
        
        <StatsCard
          title="Distância Total"
          value={formatDistance(totalDistance)}
          description="Todos os veículos"
          icon={MapPin}
          trend="up"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Mapa em Tempo Real
              </CardTitle>
              <CardDescription>
                Posição atual de todos os veículos da frota
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <MapView
                vehicles={vehicles}
                selectedVehicleId={selectedVehicleId}
                height="400px"
                onVehicleClick={(vehicle) => handleVehicleClick(vehicle.id)}
                showRoutes={false}
                followMode={false}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alertas Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AlertsList 
                alerts={activeAlerts.slice(0, 5)} 
                onAlertClick={(alert) => console.log('Alert clicked:', alert)}
                compact
              />
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Velocidade Média</span>
                  </div>
                  <span className="text-lg font-bold">{formatSpeed(avgSpeed)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Tempo Online</span>
                  </div>
                  <span className="text-lg font-bold">
                    {stats?.uptime ? `${stats.uptime.toFixed(1)}%` : '0%'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade da Frota</CardTitle>
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