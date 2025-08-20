'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DynamicMapView as MapView } from '@/components/map/dynamic-map-view';
import { useVehiclesStore } from '@/store/vehicles';
import { useAuthStore } from '@/store/auth';
import { MapPin, Car, Activity, AlertTriangle, Navigation, Maximize2, Clock, Fuel } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MonitoringPage() {
  const { vehicles, getOnlineVehicles, getMovingVehicles, getActiveAlerts } = useVehiclesStore();
  const { user } = useAuthStore();
  const [selectedVehicleId, setSelectedVehicleId] = React.useState<string | null>(null);
  const [fullscreen, setFullscreen] = React.useState(false);
  
  const onlineVehicles = getOnlineVehicles();
  const movingVehicles = getMovingVehicles();
  const activeAlerts = getActiveAlerts();

  const handleVehicleClick = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId === selectedVehicleId ? null : vehicleId);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Monitoramento em Tempo Real</h1>
          <p className="text-muted-foreground">
            Acompanhe todos os seus veículos em tempo real
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{vehicles.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{onlineVehicles.length}</div>
            <div className="text-sm text-muted-foreground">Online</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{movingVehicles.length}</div>
            <div className="text-sm text-muted-foreground">Em movimento</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{activeAlerts.length}</div>
            <div className="text-sm text-muted-foreground">Alertas</div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <Card className="flex-1">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <CardTitle>Localização dos Veículos</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFullscreen(!fullscreen)}
              className="flex items-center gap-2"
            >
              <Maximize2 className="h-4 w-4" />
              {fullscreen ? 'Normal' : 'Tela cheia'}
            </Button>
          </div>
          <CardDescription>
            Posição atual e status de todos os veículos em tempo real
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <MapView
            vehicles={vehicles}
            selectedVehicleId={selectedVehicleId}
            height={fullscreen ? "80vh" : "500px"}
            onVehicleClick={(vehicle) => handleVehicleClick(vehicle.id)}
            showRoutes={true}
            followMode={false}
          />
        </CardContent>
      </Card>

      {/* Vehicle Monitoring Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Vehicle List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Status dos Veículos ({vehicles.length})
            </CardTitle>
            <CardDescription>
              Monitoramento detalhado em tempo real
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent/50 ${
                    selectedVehicleId === vehicle.id ? 'bg-accent border-primary' : ''
                  }`}
                  onClick={() => handleVehicleClick(vehicle.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      vehicle.status === 'online' ? 'bg-green-500' :
                      vehicle.status === 'idle' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`} />
                    <div>
                      <div className="font-medium">{vehicle.name}</div>
                      <div className="text-sm text-muted-foreground">{vehicle.plateNumber}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    {vehicle.isMoving && (
                      <div className="flex items-center gap-1 text-orange-600">
                        <Activity className="h-4 w-4" />
                        <span>{vehicle.speed} km/h</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span className="text-muted-foreground">
                        {new Date(vehicle.lastUpdate).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vehicle.status === 'online' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                      vehicle.status === 'idle' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {vehicle.status === 'online' ? 'Online' :
                       vehicle.status === 'idle' ? 'Parado' :
                       'Offline'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts and Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Atividade e Alertas
            </CardTitle>
            <CardDescription>
              Últimos eventos e notificações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Active Alerts */}
              {activeAlerts.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-red-600">Alertas Ativos ({activeAlerts.length})</h4>
                  {activeAlerts.slice(0, 3).map((alert, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-red-700 dark:text-red-400">
                          {alert.title}
                        </div>
                        <div className="text-xs text-red-600 dark:text-red-500 mt-1">
                          {new Date(alert.timestamp).toLocaleTimeString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  ))}
                  {activeAlerts.length > 3 && (
                    <div className="text-xs text-center text-muted-foreground">
                      +{activeAlerts.length - 3} alertas adicionais
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Car className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-sm font-medium text-green-600 dark:text-green-400">
                    Tudo funcionando normalmente
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Nenhum alerta ativo no momento
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Ações Rápidas</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Navigation className="h-3 w-3 mr-1" />
                    Centralizar Mapa
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Activity className="h-3 w-3 mr-1" />
                    Atualizar Status
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}