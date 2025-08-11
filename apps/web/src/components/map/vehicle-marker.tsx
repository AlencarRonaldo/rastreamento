'use client';

import * as React from 'react';
import { Marker, Popup, Polyline } from 'react-leaflet';
import { DivIcon, LatLng } from 'leaflet';
import { Vehicle, Position } from '@/types';
import { formatDate, formatSpeed, getVehicleStatusColor } from '@/lib/utils';
import { 
  Car,
  Truck, 
  Navigation,
  Battery,
  Fuel,
  MapPin,
  Clock,
  Activity
} from 'lucide-react';
import { useVehiclesStore } from '@/store/vehicles';

interface VehicleMarkerProps {
  vehicle: Vehicle;
  isSelected?: boolean;
  showRoutes?: boolean;
  onClick?: (vehicle: Vehicle) => void;
}

// Create custom vehicle icon
function createVehicleIcon(
  vehicle: Vehicle,
  isSelected: boolean = false
): DivIcon {
  const statusColor = vehicle.status === 'online' ? '#22c55e' : 
                     vehicle.status === 'offline' ? '#6b7280' : '#f59e0b';
  
  const size = isSelected ? 40 : 32;
  const iconColor = vehicle.color || '#3b82f6';
  
  return new DivIcon({
    html: `
      <div class="vehicle-marker ${vehicle.status} ${vehicle.isMoving ? 'moving' : ''}" 
           style="
             width: ${size}px; 
             height: ${size}px; 
             background: ${iconColor}; 
             border: 3px solid ${statusColor};
             border-radius: 50%;
             display: flex;
             align-items: center;
             justify-content: center;
             transform: rotate(${vehicle.position.heading || 0}deg);
             transition: all 0.3s ease;
             box-shadow: 0 2px 8px rgba(0,0,0,0.2);
           ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
    `,
    className: 'custom-vehicle-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function VehicleMarker({ 
  vehicle, 
  isSelected = false, 
  showRoutes = false,
  onClick 
}: VehicleMarkerProps) {
  const { getVehiclePositions } = useVehiclesStore();
  const positions = getVehiclePositions(vehicle.id);

  const handleClick = React.useCallback(() => {
    if (onClick) {
      onClick(vehicle);
    }
  }, [onClick, vehicle]);

  const icon = React.useMemo(
    () => createVehicleIcon(vehicle, isSelected),
    [vehicle, isSelected]
  );

  // Get route polyline coordinates
  const routeCoordinates = React.useMemo(() => {
    if (!showRoutes || positions.length < 2) return [];
    
    return positions
      .slice(-50) // Last 50 positions
      .map(pos => new LatLng(pos.latitude, pos.longitude));
  }, [showRoutes, positions]);

  return (
    <>
      {/* Route polyline */}
      {showRoutes && routeCoordinates.length > 1 && (
        <Polyline
          positions={routeCoordinates}
          color={vehicle.color || '#3b82f6'}
          weight={3}
          opacity={0.7}
          dashArray={vehicle.isMoving ? undefined : '5, 5'}
        />
      )}

      {/* Vehicle marker */}
      <Marker
        position={[vehicle.position.latitude, vehicle.position.longitude]}
        icon={icon}
        eventHandlers={{
          click: handleClick,
        }}
        zIndexOffset={isSelected ? 1000 : 0}
      >
        <Popup
          closeButton={false}
          className="custom-popup"
          maxWidth={300}
        >
          <div className="space-y-3 p-2">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{vehicle.name}</h3>
                <p className="text-sm text-gray-600">{vehicle.plateNumber}</p>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getVehicleStatusColor(vehicle.status)}`}>
                <Activity className="w-3 h-3" />
                <span className="capitalize">{vehicle.status}</span>
              </div>
            </div>

            {/* Status indicators */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-500" />
                <span>{formatSpeed(vehicle.speed)}</span>
              </div>
              
              {vehicle.batteryLevel && (
                <div className="flex items-center gap-2">
                  <Battery className="w-4 h-4 text-green-500" />
                  <span>{vehicle.batteryLevel}%</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-500" />
                <span>{vehicle.isMoving ? 'Em movimento' : 'Parado'}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>{formatDate(vehicle.lastUpdate, 'time')}</span>
              </div>
            </div>

            {/* Location */}
            {vehicle.position.address && (
              <div className="text-sm">
                <strong>Localização:</strong>
                <p className="text-gray-600 mt-1">{vehicle.position.address}</p>
              </div>
            )}

            {/* Coordinates */}
            <div className="text-xs text-gray-500 font-mono">
              {vehicle.position.latitude.toFixed(6)}, {vehicle.position.longitude.toFixed(6)}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2 border-t">
              <button
                onClick={() => onClick?.(vehicle)}
                className="flex-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
              >
                Ver detalhes
              </button>
              <button
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  // Copy coordinates to clipboard
                  navigator.clipboard.writeText(
                    `${vehicle.position.latitude}, ${vehicle.position.longitude}`
                  );
                }}
              >
                Copiar GPS
              </button>
            </div>
          </div>
        </Popup>
      </Marker>
    </>
  );
}