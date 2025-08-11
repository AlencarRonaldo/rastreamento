/**
 * Socket Service - SuperClaude Generated
 * Serviço para conexão WebSocket em tempo real
 */

import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { notificationService } from './notifications';

export interface VehicleUpdate {
  id: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: Date;
  status: 'active' | 'inactive' | 'alert';
}

export interface AlertData {
  id: string;
  vehicleId: string;
  type: 'speed' | 'geofence' | 'maintenance' | 'emergency';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
}

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // 1 segundo inicial
  private isConnecting = false;
  private callbacks: Map<string, Function[]> = new Map();

  async connect(token: string): Promise<void> {
    if (this.socket?.connected || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      // Configurar URL do servidor
      const serverUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';
      
      this.socket = io(serverUrl, {
        auth: {
          token: token,
        },
        transports: ['websocket'],
        timeout: 10000,
        forceNew: true,
      });

      // Configurar event listeners
      this.setupEventListeners();

      // Aguardar conexão
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 10000);

        this.socket!.on('connect', () => {
          clearTimeout(timeout);
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          console.log('Socket connected:', this.socket!.id);
          resolve();
        });

        this.socket!.on('connect_error', (error) => {
          clearTimeout(timeout);
          this.isConnecting = false;
          console.error('Socket connection error:', error);
          reject(error);
        });
      });
    } catch (error) {
      this.isConnecting = false;
      throw error;
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    // Eventos de conexão
    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.reconnectAttempts = 0;
      this.emit('connection', { status: 'connected' });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.emit('connection', { status: 'disconnected', reason });
      
      // Tentar reconectar se não foi desconexão manual
      if (reason !== 'io client disconnect') {
        this.handleReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.emit('connection', { status: 'error', error });
      this.handleReconnect();
    });

    // Eventos de dados
    this.socket.on('vehicle:update', (data: VehicleUpdate) => {
      console.log('Vehicle update received:', data);
      this.emit('vehicle:update', data);
    });

    this.socket.on('vehicle:alert', (data: AlertData) => {
      console.log('Vehicle alert received:', data);
      this.emit('vehicle:alert', data);
      
      // Mostrar notificação local se o app não estiver em foco
      this.handleAlert(data);
    });

    this.socket.on('vehicles:batch', (data: VehicleUpdate[]) => {
      console.log('Vehicles batch update:', data.length);
      this.emit('vehicles:batch', data);
    });

    // Eventos de sistema
    this.socket.on('system:maintenance', (data) => {
      console.log('System maintenance:', data);
      this.emit('system:maintenance', data);
    });
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      if (!this.socket?.connected) {
        this.socket?.connect();
      }
    }, delay);
  }

  private async handleAlert(alert: AlertData): Promise<void> {
    try {
      // Criar notificação local
      await notificationService.scheduleLocalNotification({
        title: this.getAlertTitle(alert.type),
        body: alert.message,
        data: {
          type: 'vehicle_alert',
          alertId: alert.id,
          vehicleId: alert.vehicleId,
        },
        sound: alert.severity === 'critical' || alert.severity === 'high',
      });
    } catch (error) {
      console.error('Error handling alert notification:', error);
    }
  }

  private getAlertTitle(type: AlertData['type']): string {
    switch (type) {
      case 'speed':
        return 'Alerta de Velocidade';
      case 'geofence':
        return 'Alerta de Cerca Virtual';
      case 'maintenance':
        return 'Alerta de Manutenção';
      case 'emergency':
        return 'Alerta de Emergência';
      default:
        return 'Alerta do Veículo';
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnecting = false;
    this.reconnectAttempts = 0;
  }

  // Event system
  on(event: string, callback: Function): void {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }
    this.callbacks.get(event)!.push(callback);
  }

  off(event: string, callback?: Function): void {
    if (!callback) {
      this.callbacks.delete(event);
      return;
    }

    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in socket callback:', error);
        }
      });
    }
  }

  // Métodos públicos para enviar dados
  subscribeToVehicle(vehicleId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('vehicle:subscribe', { vehicleId });
    }
  }

  unsubscribeFromVehicle(vehicleId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('vehicle:unsubscribe', { vehicleId });
    }
  }

  subscribeToAllVehicles(): void {
    if (this.socket?.connected) {
      this.socket.emit('vehicles:subscribe:all');
    }
  }

  unsubscribeFromAllVehicles(): void {
    if (this.socket?.connected) {
      this.socket.emit('vehicles:unsubscribe:all');
    }
  }

  sendCommand(vehicleId: string, command: string, data?: any): void {
    if (this.socket?.connected) {
      this.socket.emit('vehicle:command', {
        vehicleId,
        command,
        data,
        timestamp: new Date(),
      });
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();

export const initializeSocket = async (): Promise<void> => {
  const { token } = useAuthStore.getState();
  if (!token) {
    throw new Error('No authentication token available');
  }

  try {
    await socketService.connect(token);
    console.log('Socket service initialized');
  } catch (error) {
    console.error('Failed to initialize socket service:', error);
    throw error;
  }
};

export default socketService;