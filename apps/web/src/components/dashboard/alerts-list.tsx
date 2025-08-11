'use client';

import * as React from 'react';
import { Alert } from '@/types';
import { cn, formatDate, getAlertSeverityColor, getRelativeTime } from '@/lib/utils';
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Car,
  CheckCircle,
  Circle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface AlertsListProps {
  alerts: Alert[];
  onAlertClick?: (alert: Alert) => void;
  compact?: boolean;
  className?: string;
}

const alertTypeIcons = {
  speed_limit: AlertTriangle,
  geofence_enter: MapPin,
  geofence_exit: MapPin,
  panic_button: AlertTriangle,
  engine_on: Car,
  engine_off: Car,
  low_battery: AlertTriangle,
  low_fuel: AlertTriangle,
  maintenance_due: Clock,
  device_offline: Circle,
  accident_detected: AlertTriangle,
  harsh_driving: AlertTriangle,
  idle_time: Clock,
  route_deviation: MapPin,
};

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

export function AlertsList({ alerts, onAlertClick, compact = false, className }: AlertsListProps) {
  if (alerts.length === 0) {
    return (
      <div className={cn('text-center py-8', className)}>
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-green-600 dark:text-green-400 mb-2">
          Tudo tranquilo!
        </h3>
        <p className="text-muted-foreground">
          Não há alertas ativos no momento
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {alerts.map((alert) => {
        const IconComponent = alertTypeIcons[alert.type] || AlertTriangle;
        const severityColors = getAlertSeverityColor(alert.severity);
        
        return (
          <div
            key={alert.id}
            className={cn(
              'flex items-start gap-3 p-3 rounded-lg border transition-colors',
              severityColors,
              onAlertClick && 'cursor-pointer hover:bg-accent/50',
              compact && 'p-2'
            )}
            onClick={() => onAlertClick?.(alert)}
          >
            <div className={cn(
              'flex-shrink-0 p-1 rounded-full',
              alert.severity === 'critical' ? 'bg-red-100 dark:bg-red-900/20' :
              alert.severity === 'high' ? 'bg-orange-100 dark:bg-orange-900/20' :
              alert.severity === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
              'bg-blue-100 dark:bg-blue-900/20'
            )}>
              <IconComponent className={cn(
                'h-4 w-4',
                compact && 'h-3 w-3',
                alert.severity === 'critical' ? 'text-red-600 dark:text-red-400' :
                alert.severity === 'high' ? 'text-orange-600 dark:text-orange-400' :
                alert.severity === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                'text-blue-600 dark:text-blue-400'
              )} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className={cn(
                    'font-medium truncate',
                    compact ? 'text-sm' : 'text-base'
                  )}>
                    {alert.title}
                  </h4>
                  {!compact && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {alert.message}
                    </p>
                  )}
                </div>
                
                <div className="flex-shrink-0 text-right">
                  <div className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    alert.status === 'pending' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                    alert.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  )}>
                    {alert.status === 'pending' ? 'Pendente' :
                     alert.status === 'acknowledged' ? 'Reconhecido' :
                     'Resolvido'}
                  </div>
                </div>
              </div>
              
              <div className={cn(
                'flex items-center gap-4 mt-2',
                compact ? 'text-xs' : 'text-sm'
              )}>
                <span className="text-muted-foreground">
                  {alertTypeLabels[alert.type]}
                </span>
                <span className="text-muted-foreground">
                  {getRelativeTime(alert.timestamp)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      
      {compact && alerts.length > 0 && (
        <div className="pt-2 border-t">
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link href="/alerts">
              Ver todos os alertas
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}