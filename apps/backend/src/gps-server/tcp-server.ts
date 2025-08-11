/**
 * GPS TCP Server - Simplified Version
 * Servidor TCP básico para recepção de dados GPS
 */

import net from 'net';
import { EventEmitter } from 'events';
import { logger } from '../utils/logger';

export interface GPSMessage {
  deviceId: string;
  type: 'LOGIN' | 'LOCATION' | 'HEARTBEAT' | 'UNKNOWN';
  timestamp: Date;
  data: any;
  raw: string;
}

export class TCPServer extends EventEmitter {
  private server: net.Server | null = null;
  private connections: Map<string, net.Socket> = new Map();
  private devices: Map<string, any> = new Map();
  private stats = {
    totalConnections: 0,
    activeConnections: 0,
    messagesProcessed: 0,
    errors: 0,
    startTime: new Date()
  };

  constructor() {
    super();
  }

  public start(): Promise<void> {
    return new Promise((resolve, reject) => {
      const port = Number(process.env.GPS_TCP_PORT) || 5001;
      
      this.server = net.createServer((socket) => {
        this.handleConnection(socket);
      });

      this.server.listen(port, '0.0.0.0', () => {
        logger.info(`GPS TCP Server listening on port ${port}`);
        resolve();
      });

      this.server.on('error', (error) => {
        logger.error('GPS TCP Server error:', error);
        reject(error);
      });
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          logger.info('GPS TCP Server stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  private handleConnection(socket: net.Socket): void {
    const connectionId = `${socket.remoteAddress}:${socket.remotePort}`;
    let deviceId: string | null = null;

    this.stats.totalConnections++;
    this.stats.activeConnections++;
    this.connections.set(connectionId, socket);

    logger.info(`New GPS connection: ${connectionId}`);

    socket.on('data', (data: Buffer) => {
      try {
        const message = this.parseMessage(data);
        
        if (message) {
          if (message.type === 'LOGIN' && message.deviceId) {
            deviceId = message.deviceId;
            this.devices.set(deviceId, {
              connectionId,
              socket,
              lastSeen: new Date(),
              status: 'connected'
            });
            
            // Send login response
            socket.write(Buffer.from([0x78, 0x78, 0x05, 0x01, 0x00, 0x01, 0x0d, 0x0a]));
            logger.info(`Device ${deviceId} logged in`);
          }

          this.stats.messagesProcessed++;
          this.emit('message', message);
          
          logger.debug(`Message from ${deviceId || connectionId}:`, {
            type: message.type,
            deviceId: message.deviceId
          });
        }
      } catch (error) {
        logger.error(`Error processing data from ${connectionId}:`, error);
        this.stats.errors++;
      }
    });

    socket.on('close', () => {
      this.stats.activeConnections--;
      this.connections.delete(connectionId);
      
      if (deviceId && this.devices.has(deviceId)) {
        this.devices.delete(deviceId);
        logger.info(`Device ${deviceId} disconnected`);
      } else {
        logger.info(`Connection closed: ${connectionId}`);
      }
    });

    socket.on('error', (error) => {
      logger.error(`Socket error for ${connectionId}:`, error);
      this.stats.errors++;
    });
  }

  private parseMessage(buffer: Buffer): GPSMessage | null {
    try {
      // Basic parsing - detect GT06 protocol pattern
      if (buffer.length >= 4 && buffer[0] === 0x78 && buffer[1] === 0x78) {
        const length = buffer[2];
        const protocol = buffer[3];

        // Login message
        if (protocol === 0x01 && buffer.length >= 17) {
          const imei = buffer.slice(4, 12).toString('hex');
          return {
            deviceId: imei,
            type: 'LOGIN',
            timestamp: new Date(),
            data: { imei },
            raw: buffer.toString('hex')
          };
        }

        // Location message
        if (protocol === 0x12 || protocol === 0x22) {
          // Extract basic GPS data
          const lat = buffer.readUInt32BE(11) / 1800000;
          const lng = buffer.readUInt32BE(15) / 1800000;
          
          return {
            deviceId: 'unknown',
            type: 'LOCATION',
            timestamp: new Date(),
            data: { 
              latitude: lat > 90 ? lat - 180 : lat,
              longitude: lng > 180 ? lng - 360 : lng,
              speed: 0,
              heading: 0
            },
            raw: buffer.toString('hex')
          };
        }

        // Heartbeat
        if (protocol === 0x13) {
          return {
            deviceId: 'unknown',
            type: 'HEARTBEAT',
            timestamp: new Date(),
            data: {},
            raw: buffer.toString('hex')
          };
        }
      }

      // Unknown protocol
      return {
        deviceId: 'unknown',
        type: 'UNKNOWN',
        timestamp: new Date(),
        data: { buffer: buffer.toString('hex') },
        raw: buffer.toString('hex')
      };
    } catch (error) {
      logger.error('Error parsing GPS message:', error);
      return null;
    }
  }

  public getStats() {
    const now = Date.now();
    const uptime = now - this.stats.startTime.getTime();
    
    return {
      ...this.stats,
      uptime,
      uptimeFormatted: this.formatUptime(uptime),
      connectedDevices: this.devices.size,
      connectionsPerSecond: uptime > 0 ? (this.stats.totalConnections / (uptime / 1000)).toFixed(2) : '0',
      messagesPerSecond: uptime > 0 ? (this.stats.messagesProcessed / (uptime / 1000)).toFixed(2) : '0'
    };
  }

  public getConnectedDevices() {
    const devices = [];
    for (const [deviceId, info] of this.devices) {
      devices.push({
        deviceId,
        connectionId: info.connectionId,
        lastSeen: info.lastSeen,
        status: info.status
      });
    }
    return devices;
  }

  private formatUptime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }
}