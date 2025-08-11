/**
 * Routes History Screen - SuperClaude Generated
 * Tela para visualizar histórico de rotas dos veículos
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { api } from '../services/api';

interface RouteHistory {
  id: string;
  vehicleId: string;
  vehicleName: string;
  startTime: Date;
  endTime: Date;
  distance: number;
  duration: number;
  startAddress: string;
  endAddress: string;
  averageSpeed: number;
  maxSpeed: number;
  stops: number;
}

const RoutesHistoryScreen: React.FC = () => {
  const [routes, setRoutes] = useState<RouteHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

  useEffect(() => {
    loadRoutes();
  }, [selectedPeriod]);

  const loadRoutes = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/routes/history`, {
        params: { period: selectedPeriod }
      });
      setRoutes(response.data);
    } catch (error) {
      console.error('Error loading routes:', error);
      Alert.alert('Erro', 'Não foi possível carregar o histórico de rotas');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRoutes();
    setRefreshing(false);
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${meters}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const renderPeriodButton = (period: typeof selectedPeriod, title: string) => (
    <TouchableOpacity
      style={[
        styles.periodButton,
        selectedPeriod === period && styles.periodButtonActive
      ]}
      onPress={() => setSelectedPeriod(period)}
    >
      <Text style={[
        styles.periodButtonText,
        selectedPeriod === period && styles.periodButtonTextActive
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderRouteItem = ({ item }: { item: RouteHistory }) => (
    <View style={styles.routeCard}>
      <View style={styles.routeHeader}>
        <View style={styles.vehicleInfo}>
          <Icon name="directions-car" size={20} color="#2563eb" />
          <Text style={styles.vehicleName}>{item.vehicleName}</Text>
        </View>
        <Text style={styles.routeDate}>
          {format(new Date(item.startTime), 'dd/MM/yyyy', { locale: ptBR })}
        </Text>
      </View>

      <View style={styles.routeDetails}>
        <View style={styles.addressContainer}>
          <View style={styles.addressItem}>
            <Icon name="play-circle-filled" size={16} color="#10b981" />
            <Text style={styles.addressText} numberOfLines={2}>
              {item.startAddress}
            </Text>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.addressItem}>
            <Icon name="stop-circle" size={16} color="#ef4444" />
            <Text style={styles.addressText} numberOfLines={2}>
              {item.endAddress}
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon name="schedule" size={16} color="#6b7280" />
            <Text style={styles.statValue}>
              {format(new Date(item.startTime), 'HH:mm', { locale: ptBR })} - {format(new Date(item.endTime), 'HH:mm', { locale: ptBR })}
            </Text>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Icon name="straighten" size={16} color="#6b7280" />
              <Text style={styles.statValue}>{formatDistance(item.distance)}</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="access-time" size={16} color="#6b7280" />
              <Text style={styles.statValue}>{formatDuration(item.duration)}</Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Icon name="speed" size={16} color="#6b7280" />
              <Text style={styles.statValue}>{item.averageSpeed.toFixed(0)} km/h médio</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="local-gas-station" size={16} color="#6b7280" />
              <Text style={styles.statValue}>{item.stops} paradas</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico de Rotas</Text>
        
        <View style={styles.periodSelector}>
          {renderPeriodButton('today', 'Hoje')}
          {renderPeriodButton('week', 'Semana')}
          {renderPeriodButton('month', 'Mês')}
        </View>
      </View>

      <FlatList
        data={routes}
        keyExtractor={(item) => item.id}
        renderItem={renderRouteItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563eb']}
            tintColor="#2563eb"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="route" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>
              Nenhuma rota encontrada para o período selecionado
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  periodButtonTextActive: {
    color: '#2563eb',
  },
  listContainer: {
    padding: 16,
  },
  routeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  routeDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  routeDetails: {
    gap: 12,
  },
  addressContainer: {
    paddingLeft: 8,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    lineHeight: 20,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: '#d1d5db',
    marginLeft: 8,
    marginVertical: 2,
  },
  statsContainer: {
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 32,
  },
});

export default RoutesHistoryScreen;