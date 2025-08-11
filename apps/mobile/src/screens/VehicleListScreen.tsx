import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import type { Vehicle } from '@vehicle-tracking/shared';
// Assuming api.ts has a function to fetch vehicles
// import { getVehicles } from '../services/api'; // This file doesn't exist yet, will mock

interface VehicleListScreenProps {
  navigation: any; // Assuming React Navigation prop
}

export function VehicleListScreen({ navigation }: VehicleListScreenProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError(null);
        // Placeholder for API call
        // const data = await getVehicles();
        // For now, use mock data
        const mockData: Vehicle[] = [
          { id: 'v1', plate: 'ABC-1234', lastPosition: { latitude: -23.55, longitude: -46.63, speed: 60, heading: 90, ignition: true, battery: 80, timestamp: new Date().toISOString() } },
          { id: 'v2', plate: 'DEF-5678', lastPosition: { latitude: -23.56, longitude: -46.64, speed: 0, heading: 0, ignition: false, battery: 70, timestamp: new Date().toISOString() } },
          { id: 'v3', plate: 'GHI-9012', lastPosition: { latitude: -23.57, longitude: -46.65, speed: 30, heading: 180, ignition: true, battery: 90, timestamp: new Date().toISOString() } },
        ];
        setVehicles(mockData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch vehicles');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const renderItem = ({ item }: { item: Vehicle }) => (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('VehicleDetails', { vehicleId: item.id })}>
      <Text style={styles.plateText}>{item.plate}</Text>
      <Text style={styles.statusText}>
        {item.lastPosition?.ignition ? (item.lastPosition.speed > 0 ? 'Em Movimento' : 'Parado') : 'Desligado'}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Carregando veículos...</Text>
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

  return (
    <View style={styles.container}>
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  plateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  listContent: {
    paddingVertical: 8,
  },
});
