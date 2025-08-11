'use client';

import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { LatLngBounds, LatLng, DivIcon, Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Vehicle, Position, Geofence } from '@/types';
import { VehicleMarker } from './vehicle-marker';
import { RoutePolyline } from './route-polyline';
import { GeofenceOverlay } from './geofence-overlay';
import { cn } from '@/lib/utils';

// Fix for default markers in React Leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

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
  onBoundsChange?: (bounds: LatLngBounds) => void;
}

// Component to handle map events and updates
function MapController({
  vehicles,
  selectedVehicleId,
  followMode,
  onBoundsChange,
}: {
  vehicles: Vehicle[];
  selectedVehicleId?: string | null;
  followMode?: boolean;
  onBoundsChange?: (bounds: LatLngBounds) => void;
}) {
  const map = useMap();

  // Follow selected vehicle
  React.useEffect(() => {
    if (followMode && selectedVehicleId) {
      const vehicle = vehicles.find(v => v.id === selectedVehicleId);
      if (vehicle) {
        map.setView(
          [vehicle.position.latitude, vehicle.position.longitude],
          Math.max(map.getZoom(), 15),
          { animate: true }
        );
      }
    }
  }, [map, vehicles, selectedVehicleId, followMode]);

  // Fit bounds to show all vehicles
  React.useEffect(() => {
    if (!followMode && vehicles.length > 0) {
      const bounds = new LatLngBounds([]);
      vehicles.forEach(vehicle => {
        bounds.extend([vehicle.position.latitude, vehicle.position.longitude]);
      });
      
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [map, vehicles, followMode]);

  // Map events
  useMapEvents({
    moveend: () => {
      if (onBoundsChange) {
        onBoundsChange(map.getBounds());
      }
    },
    zoomend: () => {
      if (onBoundsChange) {
        onBoundsChange(map.getBounds());
      }
    },
  });

  return null;
}

export function MapView({
  vehicles,
  selectedVehicleId,
  geofences = [],
  showGeofences = false,
  showRoutes = false,
  showTraffic = false,
  followMode = false,
  center = { lat: -23.5505, lng: -46.6333 }, // São Paulo
  zoom = 12,
  height = '400px',
  className,
  onVehicleClick,
  onMapClick,
  onBoundsChange,
}: MapViewProps) {
  const [isClient, setIsClient] = React.useState(false);

  // Ensure this only renders on client side
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const handleMapClick = React.useCallback((e: any) => {
    if (onMapClick) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    }
  }, [onMapClick]);

  const handleVehicleClick = React.useCallback((vehicle: Vehicle) => {
    if (onVehicleClick) {
      onVehicleClick(vehicle);
    }
  }, [onVehicleClick]);

  if (!isClient) {
    return (
      <div 
        className={cn('bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center', className)}
        style={{ height }}
      >
        <div className="text-muted-foreground">Carregando mapa...</div>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden rounded-lg', className)} style={{ height }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        whenReady={() => console.log('Map ready')}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Traffic layer (optional) */}
        {showTraffic && (
          <TileLayer
            url="https://traffic-{s}.tiles.mapbox.com/traffic-v1/{z}/{x}/{y}.png?access_token={accessToken}"
            attribution="Traffic data © Mapbox"
            // Note: You'll need to add your Mapbox access token
          />
        )}

        {/* Map controller */}
        <MapController
          vehicles={vehicles}
          selectedVehicleId={selectedVehicleId}
          followMode={followMode}
          onBoundsChange={onBoundsChange}
        />

        {/* Vehicle markers */}
        {vehicles.map((vehicle) => (
          <VehicleMarker
            key={vehicle.id}
            vehicle={vehicle}
            isSelected={vehicle.id === selectedVehicleId}
            onClick={handleVehicleClick}
            showRoutes={showRoutes}
          />
        ))}

        {/* Geofences */}
        {showGeofences && geofences.map((geofence) => (
          <GeofenceOverlay
            key={geofence.id}
            geofence={geofence}
          />
        ))}
      </MapContainer>

      {/* Map overlays */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        {/* Status indicator */}
        {vehicles.length > 0 && (
          <div className="bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>{vehicles.length} veículo{vehicles.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}

        {/* Follow mode indicator */}
        {followMode && selectedVehicleId && (
          <div className="bg-primary/90 text-primary-foreground backdrop-blur-sm rounded-lg px-3 py-2 text-sm shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span>Seguindo veículo</span>
            </div>
          </div>
        )}
      </div>

      {/* Loading overlay */}
      {vehicles.length === 0 && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-20">
          <div className="text-center space-y-2">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            <div className="text-sm text-muted-foreground">Carregando veículos...</div>
          </div>
        </div>
      )}
    </div>
  );
}