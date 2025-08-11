'use client';

import * as React from 'react';
import { Polyline, Popup } from 'react-leaflet';
import { LatLng } from 'leaflet';
import { Position } from '@/types';
import { formatDistance, formatDuration, formatSpeed } from '@/lib/utils';

interface RoutePolylineProps {
  positions: Position[];
  color?: string;
  weight?: number;
  opacity?: number;
  showPopup?: boolean;
  vehicleName?: string;
}

export function RoutePolyline({
  positions,
  color = '#3b82f6',
  weight = 3,
  opacity = 0.7,
  showPopup = true,
  vehicleName,
}: RoutePolylineProps) {
  const coordinates = React.useMemo(() => {
    return positions.map(pos => new LatLng(pos.latitude, pos.longitude));
  }, [positions]);

  const routeStats = React.useMemo(() => {
    if (positions.length < 2) return null;

    const start = positions[0];
    const end = positions[positions.length - 1];
    const duration = end.timestamp.getTime() - start.timestamp.getTime();
    
    // Calculate total distance
    let totalDistance = 0;
    for (let i = 1; i < positions.length; i++) {
      const prev = positions[i - 1];
      const curr = positions[i];
      
      // Haversine formula for distance calculation
      const R = 6371000; // Earth's radius in meters
      const lat1 = (prev.latitude * Math.PI) / 180;
      const lat2 = (curr.latitude * Math.PI) / 180;
      const deltaLat = ((curr.latitude - prev.latitude) * Math.PI) / 180;
      const deltaLng = ((curr.longitude - prev.longitude) * Math.PI) / 180;
      
      const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      
      totalDistance += distance;
    }

    // Calculate average speed
    const averageSpeed = duration > 0 ? (totalDistance / (duration / 1000)) * 3.6 : 0; // km/h

    return {
      distance: totalDistance,
      duration: duration / 1000, // seconds
      averageSpeed,
      startTime: start.timestamp,
      endTime: end.timestamp,
    };
  }, [positions]);

  if (coordinates.length < 2) {
    return null;
  }

  return (
    <Polyline
      positions={coordinates}
      color={color}
      weight={weight}
      opacity={opacity}
      smoothFactor={1}
    >
      {showPopup && routeStats && (
        <Popup>
          <div className="space-y-2 p-2 min-w-[200px]">
            <h4 className="font-semibold text-base">
              {vehicleName ? `Rota - ${vehicleName}` : 'Informações da Rota'}
            </h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Distância:</span>
                <span className="font-medium">{formatDistance(routeStats.distance)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Duração:</span>
                <span className="font-medium">{formatDuration(routeStats.duration)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Vel. Média:</span>
                <span className="font-medium">{formatSpeed(routeStats.averageSpeed)}</span>
              </div>
              
              <hr className="border-gray-200" />
              
              <div className="flex justify-between">
                <span>Início:</span>
                <span className="font-medium">
                  {routeStats.startTime.toLocaleTimeString('pt-BR')}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Fim:</span>
                <span className="font-medium">
                  {routeStats.endTime.toLocaleTimeString('pt-BR')}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Pontos:</span>
                <span className="font-medium">{positions.length}</span>
              </div>
            </div>
          </div>
        </Popup>
      )}
    </Polyline>
  );
}