import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import type { Vehicle } from '@vehicle-tracking/shared';
import { RouteProp, useRoute } from '@react-navigation/native';

// Define the type for the route parameters
type VehicleDetailsScreenRouteProp = RouteProp<{
  VehicleDetails: { vehicleId: string };
}, 'VehicleDetails'>;

export function VehicleDetailsScreen() {
  const route = useRoute<VehicleDetailsScreenRouteProp>();
  const { vehicleId } = route.params;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        // Placeholder for API call to fetch single vehicle details
        // const data = await getVehicleDetails(vehicleId);
        // For now, use mock data
        const mockData: Vehicle = {
          id: vehicleId,
          plate: 'MOCK-' + vehicleId.toUpperCase(),
          lastPosition: {
            latitude: -23.5505 + Math.random() * 0.01,
            longitude: -46.6333 + Math.random() * 0.01,
            speed: Math.floor(Math.random() * 100),
            heading: Math.floor(Math.random() * 360),
            ignition: Math.random() > 0.5,
            battery: Math.floor(Math.random() * 100),
            timestamp: new Date().toISOString(),
          },
        };
        setVehicle(mockData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch vehicle details');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [vehicleId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text>Carregando detalhes do veículo...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erro: {error}</Text>
      </View>
    );
  }

  if (!vehicle) {
    return (
      <View style={styles.centered}>
        <Text>Veículo não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Detalhes do Veículo</Text>
        <Text style={styles.detailText}>ID: {vehicle.id}</Text>
        <Text style={styles.detailText}>Placa: {vehicle.plate}</Text>
      </View>

      {vehicle.lastPosition && (
        <View style={styles.card}>
          <Text style={styles.title}>Última Posição</Text>
          <Text style={styles.detailText}>Latitude: {vehicle.lastPosition.latitude.toFixed(4)}</Text>
          <Text style={styles.detailText}>Longitude: {vehicle.lastPosition.longitude.toFixed(4)}</Text>
          <Text style={styles.detailText}>Velocidade: {vehicle.lastPosition.speed} km/h</Text>
          <Text style={styles.detailText}>Direção: {vehicle.lastPosition.heading}°</Text>
          <Text style={styles.detailText}>Ignição: {vehicle.lastPosition.ignition ? 'Ligada' : 'Desligada'}</Text>
          <Text style={styles.detailText}>Bateria: {vehicle.lastPosition.battery}%</Text>
          <Text style={styles.detailText}>Última Atualização: {new Date(vehicle.lastPosition.timestamp).toLocaleString()}</Text>
        </View>
      )}
      {/* Add more details as needed */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
