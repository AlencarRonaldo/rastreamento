/**
 * Map Screen - SuperClaude Generated with MCP Integration
 * Implementado usando /sc:implement mobile-ui MapScreen
 * Persona: Mobile Frontend Specialist
 * MCP: Context7 (React Native Maps docs) + Magic (Modern UI)
 */

import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Platform, Alert } from 'react-native';
import MapView, { Marker, Polyline, Circle, PROVIDER_GOOGLE, Polygon } from 'react-native-maps';
import * as Location from 'expo-location';
import { io, Socket } from 'socket.io-client';
import { StatusBar } from 'expo-status-bar';

// SuperClaude Generated Imports - Context7 Integration
import { useVehicleStore } from '../store/vehicleStore';
import { VehicleMarker } from '../components/VehicleMarker';
import { SpeedGauge } from '../components/SpeedGauge';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { useAuthStore } from '../store/authStore';

// Types from SuperClaude MCP Context7
interface LocationUpdate {
  vehicleId: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  ignition: boolean;
  battery: number;
  timestamp: string;
}

export default function MapScreen() {
  // SuperClaude Magic UI - Optimized state management
  const mapRef = useRef<MapView>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [following, setFollowing] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  
  // SuperClaude Store Integration
  const { 
    vehicles, 
    selectedVehicle, 
    updateVehiclePosition,
    geofences,
    selectVehicle 
  } = useVehicleStore();
  
  const { token } = useAuthStore();

  // SuperClaude Context7 - Location Permission Best Practices
  useEffect(() => {
    initializeLocation();
  }, []);

  // SuperClaude Context7 - WebSocket Best Practices
  useEffect(() => {
    if (process.env.EXPO_PUBLIC_DISABLE_SOCKET === 'true') {
      return;
    }
    if (token && mapReady) {
      initializeWebSocket();
    }
    
    return () => {
      socket?.disconnect();
    };
  }, [token, mapReady, vehicles]);

  const initializeLocation = async () => {
    try {
      // SuperClaude Context7 - Expo Location Best Practices
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Necessária',
          'Precisamos da permissão de localização para mostrar sua posição no mapa.',
          [{ text: 'OK' }]
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const initializeWebSocket = () => {
    // SuperClaude Context7 - Socket.io Best Practices
    const wsUrl = process.env.EXPO_PUBLIC_WS_URL || 'http://localhost:3002';
    
    const newSocket = io(wsUrl, {
      transports: ['websocket'],
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // SuperClaude Sequential - Connection Flow
    newSocket.on('connect', () => {
      console.log('🔗 Connected to tracking server');
      
      // Subscribe to all vehicles
      vehicles.forEach(vehicle => {
        newSocket.emit('subscribe:vehicle', vehicle.id);
      });
    });

    // SuperClaude Magic - Real-time Updates
    newSocket.on('tracking:update', (data: LocationUpdate) => {
      updateVehiclePosition(data.vehicleId, {
        latitude: data.latitude,
        longitude: data.longitude,
        speed: data.speed,
        heading: data.heading,
        ignition: data.ignition,
        battery: data.battery,
        timestamp: data.timestamp
      });

      // SuperClaude Magic - Smooth Following Animation
      if (following === data.vehicleId && mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: data.latitude,
          longitude: data.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 300);
      }
    });

    // SuperClaude Context7 - Alert Handling
    newSocket.on('alert:new', (alert: any) => {
      // Magic UI - Native notification
      Alert.alert(
        '🚨 Novo Alerta',
        alert.message,
        [
          { text: 'Ver Detalhes', onPress: () => handleAlertPress(alert) },
          { text: 'OK', style: 'default' }
        ]
      );
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from tracking server');
    });

    setSocket(newSocket);
  };

  const handleAlertPress = (alert: any) => {
    // SuperClaude Sequential - Alert Flow
    if (alert.vehicleId) {
      centerOnVehicle(alert.vehicleId);
      selectVehicle(alert.vehicleId);
    }
  };

  const centerOnVehicle = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle?.lastPosition && mapRef.current) {
      setFollowing(vehicleId);
      
      // SuperClaude Magic - Smooth Animation
      mapRef.current.animateToRegion({
        latitude: vehicle.lastPosition.latitude,
        longitude: vehicle.lastPosition.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
    }
  };

  const centerOnUserLocation = () => {
    if (userLocation && mapRef.current) {
      setFollowing(null);
      mapRef.current.animateToRegion({
        ...userLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  const toggleFollowing = () => {
    if (following) {
      setFollowing(null);
    } else if (selectedVehicle) {
      centerOnVehicle(selectedVehicle.id);
    }
  };

  // SuperClaude Context7 - Custom Map Style
  const customMapStyle = [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "transit",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* SuperClaude Magic - Optimized MapView */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={customMapStyle}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        onMapReady={() => setMapReady(true)}
        initialRegion={{
          latitude: userLocation?.latitude || -23.5505,
          longitude: userLocation?.longitude || -46.6333,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        mapType="standard"
        pitchEnabled={true}
        rotateEnabled={true}
        scrollEnabled={true}
        zoomEnabled={true}
      >
        {/* SuperClaude Context7 - Vehicle Markers */}
        {vehicles.map(vehicle => (
          vehicle.lastPosition && (
            <VehicleMarker
              key={vehicle.id}
              vehicle={vehicle}
              onPress={() => {
                selectVehicle(vehicle.id);
                centerOnVehicle(vehicle.id);
              }}
              isSelected={selectedVehicle?.id === vehicle.id}
              isFollowing={following === vehicle.id}
            />
          )
        ))}

        {/* SuperClaude Magic - Route Visualization */}
        {selectedVehicle?.route && selectedVehicle.route.length > 0 && (
          <Polyline
            coordinates={selectedVehicle.route}
            strokeColor="#2563eb"
            strokeWidth={3}
            strokePattern={[1]}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {/* SuperClaude Context7 - Geofences */}
        {geofences.map(geofence => (
          geofence.type === 'circle' ? (
            <Circle
              key={geofence.id}
              center={geofence.center}
              radius={geofence.radius}
              fillColor="rgba(59, 130, 246, 0.15)"
              strokeColor="rgba(59, 130, 246, 0.6)"
              strokeWidth={2}
            />
          ) : (
            <Polygon
              key={geofence.id}
              coordinates={geofence.coordinates}
              fillColor="rgba(59, 130, 246, 0.15)"
              strokeColor="rgba(59, 130, 246, 0.6)"
              strokeWidth={2}
            />
          )
        ))}
      </MapView>

      {/* SuperClaude Magic - Speed Gauge */}
      {selectedVehicle?.lastPosition && (
        <SpeedGauge 
          speed={selectedVehicle.lastPosition.speed}
          maxSpeed={120}
          style={styles.speedGauge}
        />
      )}

      {/* SuperClaude Magic - Floating Action Buttons */}
      <FloatingActionButton
        icon="my-location"
        onPress={centerOnUserLocation}
        style={styles.myLocationButton}
        size="medium"
      />

      <FloatingActionButton
        icon={following ? "gps-fixed" : "gps-not-fixed"}
        onPress={toggleFollowing}
        style={styles.followButton}
        active={!!following}
        disabled={!selectedVehicle}
        size="medium"
      />

      {/* SuperClaude Magic - Vehicle Count Badge */}
      {vehicles.length > 0 && (
        <View style={styles.vehicleCountBadge}>
          <Text style={styles.vehicleCountText}>
            {vehicles.filter(v => v.status === 'online').length}/{vehicles.length}
          </Text>
        </View>
      )}
    </View>
  );
}

// SuperClaude Magic - Optimized Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  map: {
    flex: 1,
  },
  speedGauge: {
    position: 'absolute',
    top: 60,
    left: 16,
  },
  myLocationButton: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  followButton: {
    position: 'absolute',
    right: 16,
    bottom: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  vehicleCountBadge: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: '#2563eb',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  vehicleCountText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});