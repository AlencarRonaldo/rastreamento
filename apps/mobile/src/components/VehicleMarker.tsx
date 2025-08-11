import React from 'react';
import { Marker } from 'react-native-maps';
import { View, Text } from 'react-native';
import type { Vehicle } from '@vehicle-tracking/shared';

interface VehicleMarkerProps {
  vehicle: Vehicle;
  onPress: () => void;
}

export function VehicleMarker({ vehicle, onPress }: VehicleMarkerProps) {
  const getMarkerColor = () => {
    if (!vehicle.lastPosition?.ignition) return '#6b7280'; // Cinza - desligado
    if (vehicle.lastPosition.speed > 0) return '#10b981'; // Verde - em movimento
    return '#f59e0b'; // Amarelo - parado com ignição ligada
  };

  const getRotation = () => {
    return vehicle.lastPosition?.heading || 0;
  };

  // The component will not render if lastPosition is not available.
  if (!vehicle.lastPosition) {
    return null;
  }

  return (
    <Marker
      coordinate={{
        latitude: vehicle.lastPosition.latitude,
        longitude: vehicle.lastPosition.longitude,
      }}
      onPress={onPress}
      anchor={{ x: 0.5, y: 0.5 }}
      rotation={getRotation()}
    >
      <View style={{ alignItems: 'center' }}>
        <View
          style={{
            backgroundColor: getMarkerColor(),
            padding: 8,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: 'white',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Text style={{ fontSize: 20 }}>🚗</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
            marginTop: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 10, fontWeight: 'bold' }}>
            {vehicle.plate}
          </Text>
        </View>
      </View>
    </Marker>
  );
}
