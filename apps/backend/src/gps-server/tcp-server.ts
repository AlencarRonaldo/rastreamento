/**
 * GPS TCP Server - SuperClaude Generated
 * Servidor TCP para recepção de dados GPS com suporte a múltiplos protocolos
 * Integrado com SuperClaude Framework para análise e processamento inteligente
 */

import net from 'net';
import { EventEmitter } from 'events';
import { DeviceManager } from './device-manager';
import { ProtocolParser } from './protocols/protocol-parser';
import { Queue } from 'bull';
import Redis from 'ioredis';
import { logger } from '../utils/logger';
import { GPSDataProcessor } from '../services/gps-data-processor';
import { SuperClaudeAnalyzer } from '../superclaude/analyzer';

export interface GPSServerConfig {
  port: number;
  maxConnections: number;
  timeout: number;
  bufferSize: number;
  enableAnalytics: boolean;
}

export interface GPSMessage {
  deviceId: string;
  type: 'LOGIN' | 'LOCATION' | 'HEARTBEAT' | 'ALARM' | 'STATUS';
  timestamp: Date;
  data: any;
  protocol: string;
  rawBuffer: Buffer;
}

export class GPSServer extends EventEmitter {
  private server: net.Server;
  private deviceManager: DeviceManager;
  private trackingQueue: Queue;
  private redis: Redis;
  private processor: GPSDataProcessor;
  private analyzer: SuperClaudeAnalyzer;
  private config: GPSServerConfig;
  private connections: Map<string, net.Socket> = new Map();
  private stats = {
    totalConnections: 0,
    activeConnections: 0,
    messagesProcessed: 0,
    errors: 0,
    startTime: new Date()
  };

  constructor(config: GPSServerConfig) {
    super();
    this.config = config;
    this.deviceManager = new DeviceManager();
    this.trackingQueue = new Queue('gps-tracking-data', {
      redis: { host: 'localhost', port: 6379 }
    });
    this.redis = new Redis();
    this.processor = new GPSDataProcessor();
    this.analyzer = new SuperClaudeAnalyzer();
    
    this.server = net.createServer({
      allowHalfOpen: false,
      pauseOnConnect: false
    }, (socket) => {
      this.handleConnection(socket);
    });

    this.setupEventHandlers();
    this.setupQueueProcessing();
  }

  private setupEventHandlers(): void {
    this.server.on('error', (error) => {
      logger.error('GPS Server error:', error);
      this.emit('error', error);
    });

    this.server.on('close', () => {
      logger.info('GPS Server closed');
      this.emit('close');
    });

    // SuperClaude Analytics Events
    this.on('message:processed', (message: GPSMessage) => {
      if (this.config.enableAnalytics) {
        this.analyzer.analyzeGPSMessage(message);
      }
    });

    this.on('device:connected', (deviceId: string) => {
      this.analyzer.trackDeviceConnection(deviceId);
    });
  }

  private setupQueueProcessing(): void {
    // Processar dados GPS em fila para alta performance
    this.trackingQueue.process('location-update', 10, async (job) => {
      const { deviceId, locationData } = job.data;
      
      try {
        // Processar com SuperClaude Analytics
        const processedData = await this.processor.processLocationData(locationData);
        const analysis = await this.analyzer.analyzeLocationPattern(deviceId, processedData);
        
        // Salvar no banco de dados
        await this.saveLocationData(deviceId, processedData, analysis);
        
        // Publicar para clientes em tempo real
        await this.publishRealTimeUpdate(deviceId, processedData);
        
        // Verificar alertas com SuperClaude
        await this.checkAlerts(deviceId, processedData, analysis);
        
        return { success: true, analysis };
      } catch (error) {
        logger.error('Error processing location data:', error);
        throw error;
      }
    });
  }

  private handleConnection(socket: net.Socket): void {
    const connectionId = `${socket.remoteAddress}:${socket.remotePort}`;
    let deviceId: string | null = null;
    let buffer = Buffer.alloc(0);
    let protocol: string | null = null;

    // Configurar socket
    socket.setTimeout(this.config.timeout);
    socket.setKeepAlive(true, 30000);
    socket.setNoDelay(true);

    // Estatísticas
    this.stats.totalConnections++;
    this.stats.activeConnections++;
    this.connections.set(connectionId, socket);

    logger.info(`New GPS connection: ${connectionId}`);

    socket.on('data', async (data: Buffer) => {
      try {
        buffer = Buffer.concat([buffer, data]);
        
        // Processar mensagens no buffer
        while (buffer.length > 0) {
          const result = await this.processBuffer(buffer, deviceId, protocol);
          
          if (!result.success) {
            break; // Aguardar mais dados
          }

          const { message, bytesConsumed, detectedProtocol } = result;
          
          // Atualizar protocolo se detectado
          if (detectedProtocol && !protocol) {
            protocol = detectedProtocol;
            logger.info(`Protocol detected for ${connectionId}: ${protocol}`);
          }

          // Processar mensagem
          await this.handleMessage(socket, message, connectionId);
          
          // Atualizar deviceId se for login
          if (message.type === 'LOGIN' && message.deviceId) {
            deviceId = message.deviceId;
            await this.deviceManager.registerDevice(deviceId, socket);
            this.emit('device:connected', deviceId);
          }

          // Remover dados processados do buffer
          buffer = buffer.slice(bytesConsumed);
          this.stats.messagesProcessed++;
        }
      } catch (error) {
        logger.error(`Error processing data from ${connectionId}:`, error);
        this.stats.errors++;
        
        // SuperClaude Error Analysis
        await this.analyzer.analyzeError(error, { connectionId, deviceId, protocol });
      }
    });

    socket.on('close', () => {
      this.stats.activeConnections--;
      this.connections.delete(connectionId);
      
      if (deviceId) {
        this.deviceManager.unregisterDevice(deviceId);
        this.emit('device:disconnected', deviceId);
      }
      
      logger.info(`GPS connection closed: ${connectionId}`);
    });

    socket.on('error', (error) => {
      logger.error(`Socket error for ${connectionId}:`, error);
      this.stats.errors++;
    });

    socket.on('timeout', () => {
      logger.warn(`Socket timeout for ${connectionId}`);
      socket.destroy();
    });
  }

  private async processBuffer(
    buffer: Buffer, 
    deviceId: string | null, 
    protocol: string | null
  ): Promise<{
    success: boolean;
    message?: GPSMessage;
    bytesConsumed?: number;
    detectedProtocol?: string;
  }> {
    try {
      // Identificar protocolo se não conhecido
      if (!protocol) {
        const detectedProtocol = ProtocolParser.identifyProtocol(buffer);
        if (!detectedProtocol) {
          return { success: false }; // Aguardar mais dados
        }
        protocol = detectedProtocol;
      }

      // Parsear mensagem
      const parser = ProtocolParser.getParser(protocol);
      const parseResult = parser.parse(buffer);
      
      if (!parseResult.complete) {
        return { success: false }; // Mensagem incompleta
      }

      const message: GPSMessage = {
        deviceId: parseResult.deviceId || deviceId || 'unknown',
        type: parseResult.type,
        timestamp: parseResult.timestamp || new Date(),
        data: parseResult.data,
        protocol,
        rawBuffer: buffer.slice(0, parseResult.bytesConsumed)
      };

      return {
        success: true,
        message,
        bytesConsumed: parseResult.bytesConsumed,
        detectedProtocol: protocol
      };
    } catch (error) {
      logger.error('Error parsing GPS message:', error);
      return { success: false };
    }
  }

  private async handleMessage(
    socket: net.Socket, 
    message: GPSMessage, 
    connectionId: string
  ): Promise<void> {
    try {
      switch (message.type) {
        case 'LOGIN':
          await this.handleLogin(socket, message);
          break;
          
        case 'LOCATION':
          await this.handleLocation(message);
          break;
          
        case 'HEARTBEAT':
          await this.handleHeartbeat(socket, message);
          break;
          
        case 'ALARM':
          await this.handleAlarm(message);
          break;
          
        case 'STATUS':
          await this.handleStatus(message);
          break;
      }

      this.emit('message:processed', message);
    } catch (error) {
      logger.error(`Error handling message type ${message.type}:`, error);
      throw error;
    }
  }

  private async handleLogin(socket: net.Socket, message: GPSMessage): Promise<void> {
    const { deviceId, data } = message;
    
    // Validar dispositivo
    const isValid = await this.deviceManager.validateDevice(deviceId, data);
    
    if (isValid) {
      // Enviar resposta de login bem-sucedido
      const parser = ProtocolParser.getParser(message.protocol);
      const response = parser.createLoginResponse(true);
      socket.write(response);
      
      logger.info(`Device ${deviceId} logged in successfully`);
    } else {
      // Enviar resposta de login falhado
      const parser = ProtocolParser.getParser(message.protocol);
      const response = parser.createLoginResponse(false);
      socket.write(response);
      
      logger.warn(`Device ${deviceId} login failed`);
      socket.destroy();
    }
  }

  private async handleLocation(message: GPSMessage): Promise<void> {
    const { deviceId, data } = message;
    
    // Validar dados de localização
    if (!this.isValidLocation(data)) {
      logger.warn(`Invalid location data from device ${deviceId}`);
      return;
    }

    // Adicionar à fila de processamento
    await this.trackingQueue.add('location-update', {
      deviceId,
      locationData: {
        ...data,
        timestamp: message.timestamp,
        protocol: message.protocol
      }
    }, {
      priority: 1,
      attempts: 3,
      backoff: 'exponential'
    });
  }

  private async handleHeartbeat(socket: net.Socket, message: GPSMessage): Promise<void> {
    // Enviar ACK para heartbeat
    const parser = ProtocolParser.getParser(message.protocol);
    const ack = parser.createHeartbeatResponse();
    socket.write(ack);
    
    // Atualizar último heartbeat
    await this.deviceManager.updateLastHeartbeat(message.deviceId);
  }

  private async handleAlarm(message: GPSMessage): Promise<void> {
    const { deviceId, data } = message;
    
    // Processar alarme com alta prioridade
    await this.trackingQueue.add('alarm-processing', {
      deviceId,
      alarmData: data,
      timestamp: message.timestamp
    }, {
      priority: 10, // Alta prioridade
      attempts: 5
    });
    
    logger.warn(`Alarm received from device ${deviceId}:`, data);
  }

  private async handleStatus(message: GPSMessage): Promise<void> {
    const { deviceId, data } = message;
    
    // Atualizar status do dispositivo
    await this.deviceManager.updateDeviceStatus(deviceId, data);
  }

  private isValidLocation(data: any): boolean {
    return (
      data &&
      typeof data.latitude === 'number' &&
      typeof data.longitude === 'number' &&
      data.latitude >= -90 && data.latitude <= 90 &&
      data.longitude >= -180 && data.longitude <= 180 &&
      data.latitude !== 0 && data.longitude !== 0
    );
  }

  private async saveLocationData(
    deviceId: string, 
    locationData: any, 
    analysis: any
  ): Promise<void> {
    // Implementar salvamento no banco de dados
    // Com análise SuperClaude integrada
  }

  private async publishRealTimeUpdate(
    deviceId: string, 
    locationData: any
  ): Promise<void> {
    // Publicar via Redis Pub/Sub para clientes WebSocket
    await this.redis.publish('vehicle:location', JSON.stringify({
      deviceId,
      ...locationData,
      timestamp: new Date().toISOString()
    }));
  }

  private async checkAlerts(
    deviceId: string, 
    locationData: any, 
    analysis: any
  ): Promise<void> {
    // Verificar alertas com SuperClaude Analytics
    const alerts = await this.analyzer.checkLocationAlerts(deviceId, locationData, analysis);
    
    for (const alert of alerts) {
      await this.trackingQueue.add('alert-notification', {
        deviceId,
        alert,
        locationData
      }, { priority: 8 });
    }
  }

  public start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.listen(this.config.port, () => {
        logger.info(`GPS TCP Server listening on port ${this.config.port}`);
        logger.info(`Max connections: ${this.config.maxConnections}`);
        logger.info(`SuperClaude Analytics: ${this.config.enableAnalytics ? 'Enabled' : 'Disabled'}`);
        resolve();
      });

      this.server.on('error', reject);
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve) => {
      this.server.close(() => {
        logger.info('GPS TCP Server stopped');
        resolve();
      });
    });
  }

  public getStats() {
    return {
      ...this.stats,
      uptime: Date.now() - this.stats.startTime.getTime(),
      connectionsPerSecond: this.stats.totalConnections / ((Date.now() - this.stats.startTime.getTime()) / 1000),
      messagesPerSecond: this.stats.messagesProcessed / ((Date.now() - this.stats.startTime.getTime()) / 1000)
    };
  }

  public async getSupperClaudeAnalytics() {
    return await this.analyzer.getAnalytics();
  }
}