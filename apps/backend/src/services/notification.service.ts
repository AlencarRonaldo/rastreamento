/**
 * Notification Service - SuperClaude Generated
 * Comando: /sc:implement notification-service
 * Persona: Backend Engineer
 * MCP: Context7 (Firebase Cloud Messaging Documentation)
 */

import admin from 'firebase-admin';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

interface Alert {
  id: string;
  vehicleId: string;
  type: 'speed' | 'geofence_enter' | 'geofence_exit' | 'ignition_on' | 'ignition_off' | 'battery_low' | 'sos' | 'offline';
  message: string;
  timestamp: Date;
  data?: any;
  vehicle?: {
    id: string;
    plate: string;
    model: string;
  };
}

interface User {
  id: string;
  email: string;
  name: string;
  devices: Array<{
    id: string;
    fcmToken: string;
    platform: 'ios' | 'android' | 'web';
  }>;
}

export class NotificationService {
  private messaging: admin.messaging.Messaging;
  private prisma: PrismaClient;
  private initialized: boolean = false;

  constructor() {
    this.prisma = new PrismaClient();
    this.initializeFirebase();
  }

  // SuperClaude Context7 - Firebase Admin SDK initialization
  private initializeFirebase() {
    try {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        });
      }
      
      this.messaging = admin.messaging();
      this.initialized = true;
      logger.info('🔥 Firebase Admin SDK initialized successfully');
    } catch (error) {
      logger.error('❌ Failed to initialize Firebase Admin SDK:', error);
      this.initialized = false;
    }
  }

  // SuperClaude Backend Engineer - Alert notification with multi-platform support
  async sendAlert(userId: string, alert: Alert): Promise<void> {
    if (!this.initialized) {
      logger.warn('⚠️ Firebase not initialized, skipping notification');
      return;
    }

    try {
      // Buscar tokens do usuário
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { 
          devices: {
            where: {
              fcmToken: { not: null },
              active: true
            }
          }
        }
      });

      if (!user || user.devices.length === 0) {
        logger.warn(`📱 No active devices found for user ${userId}`);
        return;
      }

      const tokens = user.devices.map(d => d.fcmToken).filter(Boolean);
      
      if (tokens.length === 0) {
        logger.warn(`🔕 No FCM tokens found for user ${userId}`);
        return;
      }

      // SuperClaude Context7 - FCM message structure
      const message = this.buildNotificationMessage(alert, tokens);
      
      const response = await this.messaging.sendMulticast(message);
      
      logger.info(`📨 Sent ${response.successCount}/${tokens.length} notifications for alert ${alert.id}`);
      
      // SuperClaude Backend Engineer - Handle failed tokens
      if (response.failureCount > 0) {
        await this.handleFailedTokens(response.responses, user.devices);
      }
      
      // Salvar log de notificação
      await this.logNotification(userId, alert.id, response.successCount, response.failureCount);
      
    } catch (error) {
      logger.error('❌ Error sending notification:', error);
      throw error;
    }
  }

  // SuperClaude Context7 - Multi-platform notification message
  private buildNotificationMessage(alert: Alert, tokens: string[]): admin.messaging.MulticastMessage {
    const title = this.getAlertTitle(alert.type);
    const body = this.getAlertBody(alert);
    const icon = this.getAlertIcon(alert.type);

    return {
      notification: {
        title,
        body,
        imageUrl: icon,
      },
      data: {
        alertId: alert.id,
        vehicleId: alert.vehicleId,
        type: alert.type,
        timestamp: alert.timestamp.toISOString(),
        action: 'OPEN_ALERT',
        ...alert.data
      },
      // SuperClaude Context7 - Android specific configuration
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          clickAction: 'OPEN_ALERT',
          channelId: 'vehicle_alerts',
          color: '#2563eb',
          icon: 'notification_icon',
          tag: `alert_${alert.vehicleId}`,
          sticky: alert.type === 'sos',
          priority: alert.type === 'sos' ? 'max' : 'high',
          visibility: 'public',
          lightSettings: {
            color: '#2563eb',
            lightOnDurationMillis: 300,
            lightOffDurationMillis: 300
          },
          vibrateTimingsMillis: [0, 250, 250, 250]
        },
        data: {
          click_action: 'FLUTTER_NOTIFICATION_CLICK'
        }
      },
      // SuperClaude Context7 - iOS specific configuration
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
            contentAvailable: true,
            category: 'VEHICLE_ALERT',
            threadId: `vehicle_${alert.vehicleId}`,
            interruptionLevel: alert.type === 'sos' ? 'critical' : 'active'
          }
        },
        headers: {
          'apns-priority': alert.type === 'sos' ? '10' : '5',
          'apns-collapse-id': `alert_${alert.vehicleId}`
        }
      },
      // SuperClaude Context7 - Web push configuration
      webpush: {
        notification: {
          icon: '/icons/notification-icon-192.png',
          badge: '/icons/badge-icon-96.png',
          image: icon,
          requireInteraction: alert.type === 'sos',
          silent: false,
          tag: `alert_${alert.vehicleId}`,
          renotify: true,
          vibrate: [200, 100, 200],
          actions: [
            {
              action: 'view',
              title: 'Ver Detalhes',
              icon: '/icons/view-icon.png'
            },
            {
              action: 'dismiss',
              title: 'Dispensar',
              icon: '/icons/dismiss-icon.png'
            }
          ]
        },
        headers: {
          TTL: '3600'
        }
      },
      tokens
    };
  }

  // SuperClaude Backend Engineer - Alert title localization
  private getAlertTitle(type: string): string {
    const titles: Record<string, string> = {
      speed: '⚠️ Alerta de Velocidade',
      geofence_enter: '📍 Entrada em Área',
      geofence_exit: '📍 Saída de Área',
      ignition_on: '🔑 Ignição Ligada',
      ignition_off: '🔑 Ignição Desligada',
      battery_low: '🔋 Bateria Baixa',
      sos: '🆘 SOS Acionado',
      offline: '📡 Veículo Offline',
      maintenance: '🔧 Manutenção Necessária',
      fuel_low: '⛽ Combustível Baixo',
      temperature: '🌡️ Alerta de Temperatura'
    };
    
    return titles[type] || '⚠️ Alerta do Veículo';
  }

  // SuperClaude Backend Engineer - Dynamic alert body generation
  private getAlertBody(alert: Alert): string {
    const vehicle = alert.vehicle;
    const plate = vehicle?.plate || 'Veículo';
    
    switch (alert.type) {
      case 'speed':
        return `${plate} excedeu o limite: ${alert.data?.speed || 'N/A'} km/h`;
      
      case 'geofence_enter':
        return `${plate} entrou em ${alert.data?.geofenceName || 'área monitorada'}`;
      
      case 'geofence_exit':
        return `${plate} saiu de ${alert.data?.geofenceName || 'área monitorada'}`;
      
      case 'ignition_on':
        return `${plate} foi ligado às ${new Date(alert.timestamp).toLocaleTimeString('pt-BR')}`;
      
      case 'ignition_off':
        return `${plate} foi desligado às ${new Date(alert.timestamp).toLocaleTimeString('pt-BR')}`;
      
      case 'battery_low':
        return `Bateria baixa em ${plate}: ${alert.data?.battery || 'N/A'}%`;
      
      case 'sos':
        return `🆘 EMERGÊNCIA: Botão SOS acionado em ${plate}`;
      
      case 'offline':
        return `${plate} está offline há ${alert.data?.duration || 'alguns minutos'}`;
      
      case 'maintenance':
        return `${plate} precisa de manutenção: ${alert.data?.reason || 'Verificar sistema'}`;
      
      case 'fuel_low':
        return `Combustível baixo em ${plate}: ${alert.data?.fuelLevel || 'N/A'}%`;
      
      case 'temperature':
        return `Temperatura anormal em ${plate}: ${alert.data?.temperature || 'N/A'}°C`;
      
      default:
        return alert.message || `Alerta em ${plate}`;
    }
  }

  private getAlertIcon(type: string): string {
    const baseUrl = process.env.CDN_URL || 'https://cdn.vehicletracker.com';
    
    const icons: Record<string, string> = {
      speed: `${baseUrl}/icons/speed-alert.png`,
      geofence_enter: `${baseUrl}/icons/geofence-enter.png`,
      geofence_exit: `${baseUrl}/icons/geofence-exit.png`,
      ignition_on: `${baseUrl}/icons/ignition-on.png`,
      ignition_off: `${baseUrl}/icons/ignition-off.png`,
      battery_low: `${baseUrl}/icons/battery-low.png`,
      sos: `${baseUrl}/icons/sos-alert.png`,
      offline: `${baseUrl}/icons/offline.png`,
      maintenance: `${baseUrl}/icons/maintenance.png`,
      fuel_low: `${baseUrl}/icons/fuel-low.png`,
      temperature: `${baseUrl}/icons/temperature.png`
    };
    
    return icons[type] || `${baseUrl}/icons/default-alert.png`;
  }

  // SuperClaude Backend Engineer - Token cleanup for failed deliveries
  private async handleFailedTokens(
    responses: admin.messaging.SendResponse[], 
    devices: Array<{ id: string; fcmToken: string; }>
  ): Promise<void> {
    const failedTokens: string[] = [];
    
    responses.forEach((response, index) => {
      if (!response.success) {
        const error = response.error;
        const token = devices[index]?.fcmToken;
        
        if (token && this.shouldRemoveToken(error)) {
          failedTokens.push(token);
        }
        
        logger.warn(`📱 Failed to send notification to token ${index}:`, error?.message);
      }
    });
    
    // Remove invalid tokens
    if (failedTokens.length > 0) {
      await this.removeInvalidTokens(failedTokens);
    }
  }

  private shouldRemoveToken(error: admin.messaging.MessagingError): boolean {
    const invalidTokenErrors = [
      'messaging/invalid-registration-token',
      'messaging/registration-token-not-registered',
      'messaging/invalid-argument'
    ];
    
    return invalidTokenErrors.includes(error.code);
  }

  private async removeInvalidTokens(tokens: string[]): Promise<void> {
    try {
      await this.prisma.device.updateMany({
        where: { fcmToken: { in: tokens } },
        data: { 
          fcmToken: null,
          active: false,
          updatedAt: new Date()
        }
      });
      
      logger.info(`🧹 Removed ${tokens.length} invalid FCM tokens`);
    } catch (error) {
      logger.error('❌ Error removing invalid tokens:', error);
    }
  }

  private async logNotification(
    userId: string, 
    alertId: string, 
    sent: number, 
    failed: number
  ): Promise<void> {
    try {
      await this.prisma.notificationLog.create({
        data: {
          userId,
          alertId,
          sent,
          failed,
          timestamp: new Date()
        }
      });
    } catch (error) {
      logger.error('❌ Error logging notification:', error);
    }
  }

  // SuperClaude Backend Engineer - Bulk notification for multiple users
  async sendBulkAlert(userIds: string[], alert: Alert): Promise<void> {
    const promises = userIds.map(userId => 
      this.sendAlert(userId, alert).catch(error => 
        logger.error(`❌ Failed to send alert to user ${userId}:`, error)
      )
    );
    
    await Promise.allSettled(promises);
    logger.info(`📨 Bulk alert sent to ${userIds.length} users`);
  }

  // SuperClaude Context7 - Topic-based notifications
  async sendTopicNotification(topic: string, alert: Alert): Promise<void> {
    if (!this.initialized) return;

    try {
      const message: admin.messaging.Message = {
        notification: {
          title: this.getAlertTitle(alert.type),
          body: this.getAlertBody(alert),
        },
        data: {
          alertId: alert.id,
          vehicleId: alert.vehicleId,
          type: alert.type,
          timestamp: alert.timestamp.toISOString(),
        },
        topic
      };

      const response = await this.messaging.send(message);
      logger.info(`📡 Topic notification sent: ${response}`);
    } catch (error) {
      logger.error('❌ Error sending topic notification:', error);
    }
  }

  async cleanup(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

// SuperClaude Backend Engineer - Singleton pattern
export const notificationService = new NotificationService();