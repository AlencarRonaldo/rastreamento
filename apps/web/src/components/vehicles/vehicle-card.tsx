'use client';

import * as React from 'react';
import { Vehicle } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn, formatSpeed, formatDistance, getVehicleStatusColor, getRelativeTime } from '@/lib/utils';
import {
  Car,
  Navigation,
  Clock,
  Activity,
  Battery,
  MapPin,
  Fuel,
  Settings,
  Eye,
  MoreVertical,
  Play,
  Pause
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface VehicleCardProps {
  vehicle: Vehicle;
  onClick?: () => void;
  className?: string;
}

export function VehicleCard({ vehicle, onClick, className }: VehicleCardProps) {
  const statusColor = getVehicleStatusColor(vehicle.status);

  const handleAction = (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Action: ${action} for vehicle ${vehicle.id}`);
    // Implement actions like engine start/stop, lock/unlock, etc.
  };

  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
        'group',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-4 pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-sm"
                style={{ backgroundColor: `${vehicle.color || '#3b82f6'}20` }}
              >
                <Car 
                  className="h-6 w-6"
                  style={{ color: vehicle.color || '#3b82f6' }}
                />
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">{vehicle.name}</h3>
                <p className="text-sm text-muted-foreground">{vehicle.plateNumber}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {/* Status Badge */}
              <div className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                statusColor
              )}>
                <Activity className="w-3 h-3" />
                <span className="capitalize">{vehicle.status}</span>
              </div>
              
              {/* Actions Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => handleAction('view', e)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => handleAction('locate', e)}>
                    <MapPin className="mr-2 h-4 w-4" />
                    Localizar no mapa
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {vehicle.engineStatus ? (
                    <DropdownMenuItem onClick={(e) => handleAction('engine_stop', e)}>
                      <Pause className="mr-2 h-4 w-4" />
                      Desligar motor
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={(e) => handleAction('engine_start', e)}>
                      <Play className="mr-2 h-4 w-4" />
                      Ligar motor
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={(e) => handleAction('settings', e)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="px-4 pb-2">
          <div className="grid grid-cols-2 gap-3 text-sm">
            {/* Speed */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium">{formatSpeed(vehicle.speed)}</p>
                <p className="text-xs text-muted-foreground">Velocidade</p>
              </div>
            </div>

            {/* Battery */}
            {vehicle.batteryLevel && (
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  vehicle.batteryLevel > 50 ? "bg-green-100 dark:bg-green-900/20" :
                  vehicle.batteryLevel > 20 ? "bg-yellow-100 dark:bg-yellow-900/20" :
                  "bg-red-100 dark:bg-red-900/20"
                )}>
                  <Battery className={cn(
                    "w-4 h-4",
                    vehicle.batteryLevel > 50 ? "text-green-600 dark:text-green-400" :
                    vehicle.batteryLevel > 20 ? "text-yellow-600 dark:text-yellow-400" :
                    "text-red-600 dark:text-red-400"
                  )} />
                </div>
                <div>
                  <p className="font-medium">{vehicle.batteryLevel}%</p>
                  <p className="text-xs text-muted-foreground">Bateria</p>
                </div>
              </div>
            )}

            {/* Fuel Level */}
            {vehicle.fuelLevel && (
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  vehicle.fuelLevel > 50 ? "bg-green-100 dark:bg-green-900/20" :
                  vehicle.fuelLevel > 20 ? "bg-yellow-100 dark:bg-yellow-900/20" :
                  "bg-red-100 dark:bg-red-900/20"
                )}>
                  <Fuel className={cn(
                    "w-4 h-4",
                    vehicle.fuelLevel > 50 ? "text-green-600 dark:text-green-400" :
                    vehicle.fuelLevel > 20 ? "text-yellow-600 dark:text-yellow-400" :
                    "text-red-600 dark:text-red-400"
                  )} />
                </div>
                <div>
                  <p className="font-medium">{vehicle.fuelLevel}%</p>
                  <p className="text-xs text-muted-foreground">Combustível</p>
                </div>
              </div>
            )}

            {/* Distance */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium">{formatDistance(vehicle.totalDistance)}</p>
                <p className="text-xs text-muted-foreground">Distância Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Movement Status */}
        <div className="px-4 pb-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                vehicle.isMoving ? "bg-green-500 animate-pulse" : "bg-gray-400"
              )} />
              <span className="text-muted-foreground">
                {vehicle.isMoving ? 'Em movimento' : 'Parado'}
              </span>
            </div>
            
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{getRelativeTime(vehicle.lastUpdate)}</span>
            </div>
          </div>
        </div>

        {/* Location */}
        {vehicle.position.address && (
          <div className="px-4 pb-4">
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground line-clamp-2">
                {vehicle.position.address}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-3 bg-muted/30 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{vehicle.model} • {vehicle.year}</span>
            <span>ID: {vehicle.deviceId}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}