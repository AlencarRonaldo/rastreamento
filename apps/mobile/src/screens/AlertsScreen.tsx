/**
 * Alerts Screen - SuperClaude Generated
 * Tela para visualizar alertas dos veículos
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
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { api } from '../services/api';

interface AlertItem {
  id: string;
  vehicleId: string;
  vehicleName: string;
  type: 'speed' | 'geofence' | 'maintenance' | 'emergency' | 'offline';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

const AlertsScreen: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');
  const [pushEnabled, setPushEnabled] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, [filter]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/alerts', {
        params: { filter }
      });
      setAlerts(response.data);
    } catch (error) {
      console.error('Error loading alerts:', error);
      Alert.alert('Erro', 'Não foi possível carregar os alertas');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAlerts();
    setRefreshing(false);
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      await api.patch(`/alerts/${alertId}/acknowledge`);
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, acknowledged: true }
            : alert
        )
      );
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      Alert.alert('Erro', 'Não foi possível marcar alerta como lido');
    }
  };

  const clearAllAlerts = () => {
    Alert.alert(
      'Confirmar',
      'Tem certeza que deseja marcar todos os alertas como lidos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await api.patch('/alerts/acknowledge-all');
              setAlerts(prev => 
                prev.map(alert => ({ ...alert, acknowledged: true }))
              );
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível marcar alertas como lidos');
            }
          }
        }
      ]
    );
  };

  const getAlertIcon = (type: AlertItem['type']): string => {
    switch (type) {
      case 'speed':
        return 'speed';
      case 'geofence':
        return 'location-on';
      case 'maintenance':
        return 'build';
      case 'emergency':
        return 'emergency';
      case 'offline':
        return 'signal-wifi-off';
      default:
        return 'warning';
    }
  };

  const getAlertColor = (severity: AlertItem['severity']): string => {
    switch (severity) {
      case 'critical':
        return '#dc2626';
      case 'high':
        return '#ea580c';
      case 'medium':
        return '#d97706';
      case 'low':
        return '#059669';
      default:
        return '#6b7280';
    }
  };

  const getSeverityText = (severity: AlertItem['severity']): string => {
    switch (severity) {
      case 'critical':
        return 'Crítico';
      case 'high':
        return 'Alto';
      case 'medium':
        return 'Médio';
      case 'low':
        return 'Baixo';
      default:
        return 'Indefinido';
    }
  };

  const renderFilterButton = (filterType: typeof filter, title: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === filterType && styles.filterButtonActive
      ]}
      onPress={() => setFilter(filterType)}
    >
      <Text style={[
        styles.filterButtonText,
        filter === filterType && styles.filterButtonTextActive
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderAlertItem = ({ item }: { item: AlertItem }) => (
    <TouchableOpacity
      style={[
        styles.alertCard,
        !item.acknowledged && styles.alertCardUnread
      ]}
      onPress={() => acknowledgeAlert(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.alertHeader}>
        <View style={styles.alertIconContainer}>
          <Icon 
            name={getAlertIcon(item.type)} 
            size={24} 
            color={getAlertColor(item.severity)} 
          />
        </View>
        
        <View style={styles.alertInfo}>
          <Text style={styles.alertTitle}>{item.title}</Text>
          <Text style={styles.alertVehicle}>{item.vehicleName}</Text>
        </View>

        <View style={styles.alertMeta}>
          <View style={[
            styles.severityBadge,
            { backgroundColor: getAlertColor(item.severity) + '20' }
          ]}>
            <Text style={[
              styles.severityText,
              { color: getAlertColor(item.severity) }
            ]}>
              {getSeverityText(item.severity)}
            </Text>
          </View>
          <Text style={styles.alertTime}>
            {format(new Date(item.timestamp), 'HH:mm', { locale: ptBR })}
          </Text>
        </View>
      </View>

      <Text style={styles.alertMessage}>{item.message}</Text>

      {item.location && (
        <View style={styles.locationContainer}>
          <Icon name="place" size={16} color="#6b7280" />
          <Text style={styles.locationText} numberOfLines={2}>
            {item.location.address}
          </Text>
        </View>
      )}

      <View style={styles.alertFooter}>
        <Text style={styles.alertDate}>
          {format(new Date(item.timestamp), 'dd/MM/yyyy', { locale: ptBR })}
        </Text>
        {!item.acknowledged && (
          <View style={styles.unreadIndicator}>
            <Text style={styles.unreadText}>Não lido</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const unreadCount = alerts.filter(alert => !alert.acknowledged).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Alertas</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        <View style={styles.headerActions}>
          <View style={styles.pushToggle}>
            <Text style={styles.pushToggleLabel}>Push</Text>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
              thumbColor={pushEnabled ? '#ffffff' : '#f3f4f6'}
            />
          </View>

          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearAllAlerts}
            >
              <Icon name="done-all" size={20} color="#2563eb" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'Todos')}
        {renderFilterButton('unread', 'Não lidos')}
        {renderFilterButton('critical', 'Críticos')}
      </View>

      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        renderItem={renderAlertItem}
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
            <Icon name="notifications-none" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>
              {filter === 'all' 
                ? 'Nenhum alerta encontrado'
                : filter === 'unread'
                ? 'Todos os alertas foram lidos'
                : 'Nenhum alerta crítico'
              }
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  badge: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pushToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pushToggleLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  clearButton: {
    padding: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    padding: 16,
  },
  alertCard: {
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
  alertCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  alertVehicle: {
    fontSize: 14,
    color: '#6b7280',
  },
  alertMeta: {
    alignItems: 'flex-end',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  alertTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  alertMessage: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    backgroundColor: '#f9fafb',
    padding: 8,
    borderRadius: 8,
  },
  locationText: {
    flex: 1,
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 6,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  alertDate: {
    fontSize: 13,
    color: '#9ca3af',
  },
  unreadIndicator: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  unreadText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500',
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

export default AlertsScreen;