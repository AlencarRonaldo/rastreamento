'use client';

import * as React from 'react';
import { Circle, Polygon, Popup } from 'react-leaflet';
import { LatLng } from 'leaflet';
import { Geofence } from '@/types';
import { Shield, MapPin, Users } from 'lucide-react';

interface GeofenceOverlayProps {
  geofence: Geofence;
  onClick?: (geofence: Geofence) => void;
}

export function GeofenceOverlay({ geofence, onClick }: GeofenceOverlayProps) {
  const handleClick = React.useCallback(() => {
    if (onClick) {
      onClick(geofence);
    }
  }, [onClick, geofence]);

  // Style options
  const fillColor = geofence.isActive ? '#22c55e' : '#6b7280';
  const color = geofence.isActive ? '#16a34a' : '#4b5563';
  const fillOpacity = 0.2;
  const opacity = 0.8;
  const weight = 2;

  const pathOptions = {
    color,
    fillColor,
    fillOpacity,
    opacity,
    weight,
  };

  const eventHandlers = {
    click: handleClick,
  };

  if (geofence.type === 'circle' && geofence.coordinates.circle) {
    const { center, radius } = geofence.coordinates.circle;
    
    return (
      <Circle
        center={[center.lat, center.lng]}
        radius={radius}
        pathOptions={pathOptions}
        eventHandlers={eventHandlers}
      >
        <Popup>
          <div className="space-y-3 p-2 min-w-[250px]">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{geofence.name}</h3>
              <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                geofence.isActive 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                <Shield className="w-3 h-3" />
                {geofence.isActive ? 'Ativo' : 'Inativo'}
              </div>
            </div>

            {geofence.description && (
              <p className="text-sm text-gray-600">{geofence.description}</p>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>Cerca Circular</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-500">Raio:</span>
                  <p className="font-medium">{radius}m</p>
                </div>
                <div>
                  <span className="text-gray-500">Área:</span>
                  <p className="font-medium">
                    {((Math.PI * radius * radius) / 1000000).toFixed(2)} km²
                  </p>
                </div>
              </div>

              <div>
                <span className="text-gray-500">Centro:</span>
                <p className="font-mono text-xs">
                  {center.lat.toFixed(6)}, {center.lng.toFixed(6)}
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" />
                <span className="text-sm">
                  {geofence.vehicleIds.length} veículo{geofence.vehicleIds.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex gap-2 text-xs">
                {geofence.alertOnEnter && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                    Alerta Entrada
                  </span>
                )}
                {geofence.alertOnExit && (
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
                    Alerta Saída
                  </span>
                )}
              </div>
            </div>
          </div>
        </Popup>
      </Circle>
    );
  }

  if (geofence.type === 'polygon' && geofence.coordinates.polygon) {
    const positions = geofence.coordinates.polygon.points.map(
      point => new LatLng(point.lat, point.lng)
    );

    // Calculate polygon area (approximate)
    const calculatePolygonArea = (points: { lat: number; lng: number }[]) => {
      let area = 0;
      const n = points.length;
      
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        area += points[i].lat * points[j].lng;
        area -= points[j].lat * points[i].lng;
      }
      
      return Math.abs(area / 2) * 111000 * 111000; // Approximate conversion to m²
    };

    const area = calculatePolygonArea(geofence.coordinates.polygon.points);

    return (
      <Polygon
        positions={positions}
        pathOptions={pathOptions}
        eventHandlers={eventHandlers}
      >
        <Popup>
          <div className="space-y-3 p-2 min-w-[250px]">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{geofence.name}</h3>
              <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                geofence.isActive 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                <Shield className="w-3 h-3" />
                {geofence.isActive ? 'Ativo' : 'Inativo'}
              </div>
            </div>

            {geofence.description && (
              <p className="text-sm text-gray-600">{geofence.description}</p>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>Cerca Poligonal</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-500">Pontos:</span>
                  <p className="font-medium">{geofence.coordinates.polygon.points.length}</p>
                </div>
                <div>
                  <span className="text-gray-500">Área:</span>
                  <p className="font-medium">
                    {(area / 1000000).toFixed(2)} km²
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" />
                <span className="text-sm">
                  {geofence.vehicleIds.length} veículo{geofence.vehicleIds.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex gap-2 text-xs">
                {geofence.alertOnEnter && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                    Alerta Entrada
                  </span>
                )}
                {geofence.alertOnExit && (
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
                    Alerta Saída
                  </span>
                )}
              </div>
            </div>
          </div>
        </Popup>
      </Polygon>
    );
  }

  return null;
}