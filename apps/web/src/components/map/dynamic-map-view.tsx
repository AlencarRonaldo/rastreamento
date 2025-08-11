'use client';

import dynamic from 'next/dynamic';
import * as React from 'react';
import { Vehicle, Geofence } from '@/types';
import { cn } from '@/lib/utils';

interface MapViewProps {
  vehicles: Vehicle[];
  selectedVehicleId?: string | null;
  geofences?: Geofence[];
  showGeofences?: boolean;
  showRoutes?: boolean;
  showTraffic?: boolean;
  followMode?: boolean;
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  className?: string;
  onVehicleClick?: (vehicle: Vehicle) => void;
  onMapClick?: (lat: number, lng: number) => void;
  onBoundsChange?: (bounds: any) => void;
}

// Dynamically import MapView with SSR disabled
const MapView = dynamic(() => import('./map-view').then(mod => ({ default: mod.MapView })), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center" style={{ height: '400px' }}>
      <div className="text-center space-y-2">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
        <div className="text-sm text-muted-foreground">Carregando mapa...</div>
      </div>
    </div>
  ),
});

export function DynamicMapView(props: MapViewProps) {
  return <MapView {...props} />;
}