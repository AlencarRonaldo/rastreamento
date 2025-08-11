/**
 * Device Manager - SuperClaude Generated
 * Gerenciamento de dispositivos GPS conectados
 */

import { EventEmitter } from 'events';
import { Socket } from 'net';

export interface Device {
  id: string;
  socket: Socket;
  protocol: string;
  lastHeartbeat: Date;
  status: 'online' | 'offline' | 'error';
  metadata: any;
}

export class DeviceManager extends EventEmitter {
  private devices: Map<string, Device> = new Map();

  async registerDevice(deviceId: string, socket: Socket): Promise<void> {
    const device: Device = {
      id: deviceId,
      socket,
      protocol: 'unknown',
      lastHeartbeat: new Date(),
      status: 'online',
      metadata: {}
    };

    this.devices.set(deviceId, device);
    this.emit('device:registered', device);
  }

  async unregisterDevice(deviceId: string): Promise<void> {
    const device = this.devices.get(deviceId);
    if (device) {
      this.devices.delete(deviceId);
      this.emit('device:unregistered', device);
    }
  }

  async validateDevice(deviceId: string, data: any): Promise<boolean> {
    // Implementar validação de dispositivo
    return true;
  }

  async updateLastHeartbeat(deviceId: string): Promise<void> {
    const device = this.devices.get(deviceId);
    if (device) {
      device.lastHeartbeat = new Date();
    }
  }

  async updateDeviceStatus(deviceId: string, status: any): Promise<void> {
    const device = this.devices.get(deviceId);
    if (device) {
      device.metadata = { ...device.metadata, ...status };
    }
  }

  getDevice(deviceId: string): Device | undefined {
    return this.devices.get(deviceId);
  }

  getAllDevices(): Device[] {
    return Array.from(this.devices.values());
  }
}