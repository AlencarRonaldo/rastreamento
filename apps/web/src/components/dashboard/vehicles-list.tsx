'use client';

import * as React from 'react';
import { Vehicle } from '@/types';
import { cn, formatSpeed, getVehicleStatusColor, getRelativeTime } from '@/lib/utils';
import { 
  Car, 
  Navigation, 
  Clock, 
  Activity,
  Battery,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface VehiclesListProps {
  vehicles: Vehicle[];
  onVehicleClick?: (vehicleId: string) => void;
  selectedVehicleId?: string | null;
  compact?: boolean;
  className?: string;
}

export function VehiclesList({ 
  vehicles, 
  onVehicleClick, 
  selectedVehicleId,
  compact = false, 
  className 
}: VehiclesListProps) {
  if (vehicles.length === 0) {
    return (
      <div className={cn('text-center py-8', className)}>
        <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Nenhum veículo encontrado</h3>
        <p className="text-muted-foreground">
          Adicione veículos para começar o monitoramento
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {vehicles.map((vehicle) => {
        const isSelected = selectedVehicleId === vehicle.id;
        const statusColor = getVehicleStatusColor(vehicle.status);
        
        return (
          <div
            key={vehicle.id}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:bg-accent/50',
              isSelected && 'bg-accent border-primary',
              compact && 'p-2'
            )}
            onClick={() => onVehicleClick?.(vehicle.id)}
          >
            {/* Vehicle Icon */}
            <div 
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${vehicle.color || '#3b82f6'}20` }}
            >
              <Car 
                className="h-5 w-5"
                style={{ color: vehicle.color || '#3b82f6' }}
              />
            </div>
            
            {/* Vehicle Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className={cn(
                    'font-medium truncate',
                    compact ? 'text-sm' : 'text-base'
                  )}>
                    {vehicle.name}
                  </h4>
                  <p className={cn(
                    'text-muted-foreground truncate',
                    compact ? 'text-xs' : 'text-sm'
                  )}>
                    {vehicle.plateNumber}
                  </p>
                </div>
                
                {/* Status Badge */}
                <div className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded text-xs font-medium',
                  statusColor
                )}>
                  <Activity className="w-3 h-3" />
                  <span className="capitalize">{vehicle.status}</span>
                </div>
              </div>
              
              {/* Vehicle Details */}
              <div className={cn(
                'flex items-center gap-4 mt-2',
                compact ? 'text-xs' : 'text-sm'
              )}>
                {/* Speed */}
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Navigation className="w-3 h-3" />
                  <span>{formatSpeed(vehicle.speed)}</span>
                </div>
                
                {/* Battery (if available) */}
                {vehicle.batteryLevel && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Battery className="w-3 h-3" />
                    <span>{vehicle.batteryLevel}%</span>
                  </div>
                )}
                
                {/* Movement Status */}
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{vehicle.isMoving ? 'Em movimento' : 'Parado'}</span>
                </div>
                
                {/* Last Update */}
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{getRelativeTime(vehicle.lastUpdate)}</span>
                </div>
              </div>
              
              {/* Location (if not compact) */}
              {!compact && vehicle.position.address && (
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  📍 {vehicle.position.address}
                </p>
              )}
            </div>
            
            {/* Arrow Icon */}
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </div>
        );
      })}
      
      {compact && vehicles.length > 0 && (
        <div className="pt-2 border-t">
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link href="/vehicles">
              Ver todos os veículos
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}