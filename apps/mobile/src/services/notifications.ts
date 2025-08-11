/**
 * Notification Service - SuperClaude Generated
 * Serviço para gerenciamento de notificações push
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
  sound?: boolean;
  badge?: number;
}

class NotificationService {
  private expoPushToken: string | null = null;
  private initialized = false;

  async initialize(): Promise<string | null> {
    if (this.initialized) {
      return this.expoPushToken;
    }

    try {
      // Verificar se é dispositivo físico
      if (!Device.isDevice) {
        console.warn('Push notifications only work on physical devices');
        return null;
      }

      // Solicitar permissões
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Failed to get push token for push notification!');
        return null;
      }

      // Obter token
      const tokenResponse = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      
      this.expoPushToken = tokenResponse.data;
      this.initialized = true;

      console.log('Push token obtained:', this.expoPushToken);
      return this.expoPushToken;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return null;
    }
  }

  getToken(): string | null {
    return this.expoPushToken;
  }

  async scheduleLocalNotification(notification: NotificationData, trigger?: Notifications.NotificationTriggerInput) {
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: notification.sound !== false,
          badge: notification.badge,
        },
        trigger: trigger || null,
      });
      
      return id;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  }

  async cancelNotification(notificationId: string) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  async setBadgeCount(count: number) {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Error setting badge count:', error);
    }
  }

  async clearBadge() {
    try {
      await Notifications.setBadgeCountAsync(0);
    } catch (error) {
      console.error('Error clearing badge:', error);
    }
  }

  // Configurar handlers de notificação
  configureHandlers() {
    // Handler para quando a notificação é recebida
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        };
      },
    });

    // Listener para quando a notificação é tocada
    Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      console.log('Notification response:', data);
      
      // Navegar para tela específica baseado nos dados
      this.handleNotificationResponse(data);
    });

    // Listener para notificações recebidas em foreground
    Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
    });
  }

  private handleNotificationResponse(data: any) {
    // Implementar navegação baseada no tipo de notificação
    switch (data?.type) {
      case 'vehicle_alert':
        // Navegar para detalhes do veículo
        break;
      case 'speed_violation':
        // Navegar para alertas
        break;
      case 'geofence_violation':
        // Navegar para mapa
        break;
      default:
        // Navegar para tela principal
        break;
    }
  }
}

export const notificationService = new NotificationService();

export const initializeNotifications = async (): Promise<string | null> => {
  const token = await notificationService.initialize();
  notificationService.configureHandlers();
  return token;
};

export default notificationService;