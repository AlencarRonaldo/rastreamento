/**
 * GPS Types - Basic types for GPS tracking system
 */

export interface GPSCoordinates {
  latitude: number;
  longitude: number;
}

export interface GPSLocation extends GPSCoordinates {
  speed: number;
  heading: number;
  altitude?: number;
  timestamp: Date;
  accuracy?: number;
}

export interface DeviceInfo {
  deviceId: string;
  imei?: string;
  name?: string;
  model?: string;
  firmware?: string;
  lastSeen: Date;
  status: 'connected' | 'disconnected' | 'unknown';
}

export interface Vehicle {
  id: string;
  deviceId: string;
  name: string;
  plate?: string;
  model?: string;
  year?: number;
  status: 'active' | 'inactive' | 'maintenance';
  location?: GPSLocation;
  lastUpdate: Date;
}

export interface GPSMessageData {
  deviceId: string;
  type: 'LOGIN' | 'LOCATION' | 'HEARTBEAT' | 'ALARM' | 'STATUS' | 'UNKNOWN';
  timestamp: Date;
  data: any;
  raw: string;
}

export interface ConnectionStats {
  totalConnections: number;
  activeConnections: number;
  messagesProcessed: number;
  errors: number;
  startTime: Date;
  uptime: number;
  uptimeFormatted: string;
  connectedDevices: number;
  connectionsPerSecond: string;
  messagesPerSecond: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  service: string;
  version: string;
  uptime: number;
  gps: {
    status: 'connected' | 'listening' | 'error';
    activeConnections: number;
    messagesProcessed: number;
  };
}