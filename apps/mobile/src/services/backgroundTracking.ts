/**
 * Background Tracking Service - SuperClaude Generated
 * Comando: /sc:implement background-tracking
 * Persona: Mobile Frontend Specialist
 * MCP: Context7 (Expo TaskManager + Location Documentation)
 */

import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';

// SuperClaude Context7 - Background task configuration
const LOCATION_TASK = 'background-location-task';
const SYNC_TASK = 'background-sync-task';

interface LocationUpdate {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number;
  speed: number | null;
  heading: number | null;
  timestamp: number;
}

interface BackgroundConfig {
  enabled: boolean;
  accuracy: Location.Accuracy;
  timeInterval: number;
  distanceInterval: number;
  showNotification: boolean;
  syncInterval: number;
}

// SuperClaude Mobile Frontend - Background location task definition
TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error('❌ Background location error:', error);
    await logError('background-location', error.message);
    return;
  }

  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    
    if (locations && locations.length > 0) {
      const location = locations[0];
      
      try {
        // SuperClaude Context7 - Process location data
        const processedLocation: LocationUpdate = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          altitude: location.coords.altitude,
          accuracy: location.coords.accuracy || 0,
          speed: location.coords.speed,
          heading: location.coords.heading,
          timestamp: location.timestamp
        };

        // Store locally for offline sync
        await storeLocationOffline(processedLocation);
        
        // Try to send immediately if online
        const isOnline = await checkNetworkStatus();
        if (isOnline) {
          await sendLocationToServer(processedLocation);
        }

        console.log('📍 Background location updated:', {
          lat: processedLocation.latitude.toFixed(6),
          lng: processedLocation.longitude.toFixed(6),
          accuracy: processedLocation.accuracy
        });

      } catch (error) {
        console.error('❌ Error processing background location:', error);
        await logError('location-processing', error instanceof Error ? error.message : 'Unknown error');
      }
    }
  }
});

// SuperClaude Context7 - Background sync task for offline data
TaskManager.defineTask(SYNC_TASK, async () => {
  try {
    const isOnline = await checkNetworkStatus();
    if (!isOnline) {
      console.log('📡 Device offline, skipping sync');
      return;
    }

    const offlineLocations = await getOfflineLocations();
    if (offlineLocations.length === 0) {
      console.log('✅ No offline locations to sync');
      return;
    }

    console.log(`🔄 Syncing ${offlineLocations.length} offline locations`);
    
    let syncedCount = 0;
    for (const location of offlineLocations) {
      try {
        await sendLocationToServer(location);
        await removeOfflineLocation(location.timestamp);
        syncedCount++;
      } catch (error) {
        console.error('❌ Failed to sync location:', error);
        break; // Stop syncing on first error to preserve order
      }
    }

    console.log(`✅ Synced ${syncedCount}/${offlineLocations.length} locations`);
    
    if (syncedCount > 0) {
      await showSyncNotification(syncedCount);
    }

  } catch (error) {
    console.error('❌ Background sync error:', error);
    await logError('background-sync', error instanceof Error ? error.message : 'Unknown error');
  }
});

export class BackgroundTrackingService {
  private static instance: BackgroundTrackingService;
  private config: BackgroundConfig;
  private isTracking: boolean = false;

  private constructor() {
    // SuperClaude Mobile Frontend - Default configuration
    this.config = {
      enabled: false,
      accuracy: Location.Accuracy.High,
      timeInterval: 30000, // 30 seconds
      distanceInterval: 50, // 50 meters
      showNotification: true,
      syncInterval: 300000 // 5 minutes
    };
  }

  static getInstance(): BackgroundTrackingService {
    if (!BackgroundTrackingService.instance) {
      BackgroundTrackingService.instance = new BackgroundTrackingService();
    }
    return BackgroundTrackingService.instance;
  }

  // SuperClaude Context7 - Start background tracking with permissions
  async startTracking(customConfig?: Partial<BackgroundConfig>): Promise<boolean> {
    try {
      if (this.isTracking) {
        console.log('⚠️ Background tracking already active');
        return true;
      }

      // Update configuration
      if (customConfig) {
        this.config = { ...this.config, ...customConfig };
      }

      // SuperClaude Context7 - Request permissions
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== 'granted') {
        throw new Error('Foreground location permission not granted');
      }

      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== 'granted') {
        throw new Error('Background location permission not granted');
      }

      // SuperClaude Mobile Frontend - Start location updates
      await Location.startLocationUpdatesAsync(LOCATION_TASK, {
        accuracy: this.config.accuracy,
        timeInterval: this.config.timeInterval,
        distanceInterval: this.config.distanceInterval,
        deferredUpdatesInterval: 1000,
        deferredUpdatesDistance: 1,
        showsBackgroundLocationIndicator: true,
        foregroundService: this.config.showNotification ? {
          notificationTitle: "🚗 Rastreamento Ativo",
          notificationBody: "Monitorando localização do veículo em tempo real",
          notificationColor: "#2563eb",
        } : undefined,
      });

      // Start sync task
      await TaskManager.startTaskAsync(SYNC_TASK, {
        interval: this.config.syncInterval
      });

      this.isTracking = true;
      await this.saveConfig();
      
      console.log('✅ Background tracking started successfully');
      return true;

    } catch (error) {
      console.error('❌ Failed to start background tracking:', error);
      await logError('start-tracking', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }

  // SuperClaude Mobile Frontend - Stop background tracking
  async stopTracking(): Promise<void> {
    try {
      if (!this.isTracking) {
        console.log('⚠️ Background tracking not active');
        return;
      }

      const isLocationTaskRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK);
      if (isLocationTaskRegistered) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK);
      }

      const isSyncTaskRegistered = await TaskManager.isTaskRegisteredAsync(SYNC_TASK);
      if (isSyncTaskRegistered) {
        await TaskManager.unregisterTaskAsync(SYNC_TASK);
      }

      this.isTracking = false;
      this.config.enabled = false;
      await this.saveConfig();

      console.log('🛑 Background tracking stopped');

    } catch (error) {
      console.error('❌ Failed to stop background tracking:', error);
      await logError('stop-tracking', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  // SuperClaude Context7 - Configuration management
  async updateConfig(newConfig: Partial<BackgroundConfig>): Promise<void> {
    this.config = { ...this.config, ...newConfig };
    await this.saveConfig();

    // Restart tracking if active with new config
    if (this.isTracking) {
      await this.stopTracking();
      await this.startTracking();
    }
  }

  getConfig(): BackgroundConfig {
    return { ...this.config };
  }

  isActive(): boolean {
    return this.isTracking;
  }

  // SuperClaude Mobile Frontend - Get tracking statistics
  async getTrackingStats(): Promise<{
    isActive: boolean;
    offlineLocations: number;
    lastSync: Date | null;
    totalLocations: number;
  }> {
    const offlineLocations = await getOfflineLocations();
    const lastSync = await AsyncStorage.getItem('last_sync_time');
    const totalLocations = await AsyncStorage.getItem('total_locations_sent');

    return {
      isActive: this.isTracking,
      offlineLocations: offlineLocations.length,
      lastSync: lastSync ? new Date(lastSync) : null,
      totalLocations: totalLocations ? parseInt(totalLocations, 10) : 0
    };
  }

  private async saveConfig(): Promise<void> {
    try {
      await AsyncStorage.setItem('background_tracking_config', JSON.stringify(this.config));
    } catch (error) {
      console.error('❌ Failed to save config:', error);
    }
  }

  async loadConfig(): Promise<void> {
    try {
      const savedConfig = await AsyncStorage.getItem('background_tracking_config');
      if (savedConfig) {
        this.config = { ...this.config, ...JSON.parse(savedConfig) };
      }
    } catch (error) {
      console.error('❌ Failed to load config:', error);
    }
  }
}

// SuperClaude Context7 - Utility functions
async function storeLocationOffline(location: LocationUpdate): Promise<void> {
  try {
    const existingLocations = await getOfflineLocations();
    existingLocations.push(location);
    
    // Keep only last 1000 locations to prevent storage overflow
    const locationsToStore = existingLocations.slice(-1000);
    
    await AsyncStorage.setItem('offline_locations', JSON.stringify(locationsToStore));
  } catch (error) {
    console.error('❌ Failed to store location offline:', error);
  }
}

async function getOfflineLocations(): Promise<LocationUpdate[]> {
  try {
    const stored = await AsyncStorage.getItem('offline_locations');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('❌ Failed to get offline locations:', error);
    return [];
  }
}

async function removeOfflineLocation(timestamp: number): Promise<void> {
  try {
    const locations = await getOfflineLocations();
    const filtered = locations.filter(loc => loc.timestamp !== timestamp);
    await AsyncStorage.setItem('offline_locations', JSON.stringify(filtered));
  } catch (error) {
    console.error('❌ Failed to remove offline location:', error);
  }
}

async function sendLocationToServer(location: LocationUpdate): Promise<void> {
  try {
    await api.post('/tracking/location', {
      latitude: location.latitude,
      longitude: location.longitude,
      altitude: location.altitude,
      accuracy: location.accuracy,
      speed: location.speed,
      heading: location.heading,
      timestamp: new Date(location.timestamp).toISOString(),
      source: 'background'
    });

    // Update statistics
    const totalSent = await AsyncStorage.getItem('total_locations_sent');
    const newTotal = (totalSent ? parseInt(totalSent, 10) : 0) + 1;
    await AsyncStorage.setItem('total_locations_sent', newTotal.toString());
    await AsyncStorage.setItem('last_sync_time', new Date().toISOString());

  } catch (error) {
    console.error('❌ Failed to send location to server:', error);
    throw error;
  }
}

async function checkNetworkStatus(): Promise<boolean> {
  try {
    // Simple connectivity check
    const response = await fetch('https://www.google.com/generate_204', {
      method: 'HEAD',
      timeout: 5000
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function showSyncNotification(count: number): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔄 Sincronização Concluída',
        body: `${count} localizações foram sincronizadas com o servidor`,
        data: { type: 'sync_complete', count }
      },
      trigger: null
    });
  } catch (error) {
    console.error('❌ Failed to show sync notification:', error);
  }
}

async function logError(context: string, message: string): Promise<void> {
  try {
    const errorLog = {
      context,
      message,
      timestamp: new Date().toISOString()
    };
    
    const existingLogs = await AsyncStorage.getItem('error_logs');
    const logs = existingLogs ? JSON.parse(existingLogs) : [];
    logs.push(errorLog);
    
    // Keep only last 100 errors
    const logsToStore = logs.slice(-100);
    await AsyncStorage.setItem('error_logs', JSON.stringify(logsToStore));
  } catch (error) {
    console.error('❌ Failed to log error:', error);
  }
}

// Export singleton instance
export const backgroundTracking = BackgroundTrackingService.getInstance();