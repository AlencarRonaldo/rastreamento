/**
 * GT06 Protocol Parser - SuperClaude Generated
 * Comando: /sc:implement gps-parser gt06
 * Persona: GPS Architect
 * MCP: Context7 (GPS Protocol Documentation)
 */

import { Parser } from 'binary-parser';
import { GPSMessage, ProtocolParserInterface } from './protocol-parser';

export class GT06Parser implements ProtocolParserInterface {
  static readonly PROTOCOL_NAME = 'GT06';
  static readonly START_BITS = [0x78, 0x78];
  static readonly STOP_BITS = [0x0D, 0x0A];

  // SuperClaude Context7 - GT06 Protocol Specification
  static readonly MESSAGE_TYPES = {
    LOGIN: 0x01,
    LOCATION: 0x12,
    HEARTBEAT: 0x13,
    STATUS: 0x14,
    ALARM: 0x16,
    GPS_LBS: 0x22,
    LBS: 0x17,
    GPS_LBS_STATUS: 0x26,
    GPS_LBS_ALARM: 0x18,
    GPS_LBS_EXTEND: 0x19
  };

  static identify(buffer: Buffer): boolean {
    return buffer.length >= 4 && 
           buffer[0] === GT06Parser.START_BITS[0] && 
           buffer[1] === GT06Parser.START_BITS[1] &&
           buffer.length >= buffer[2] + 5; // length + header + crc + stop
  }

  static parse(buffer: Buffer): { 
    success: boolean; 
    message?: GPSMessage; 
    bytesConsumed?: number; 
    error?: string 
  } {
    try {
      // SuperClaude GPS Architect - Robust parsing
      if (!this.identify(buffer)) {
        return { success: false, error: 'Invalid GT06 packet format' };
      }

      const length = buffer[2];
      const totalLength = length + 5; // header(2) + length(1) + data + serial(2) + crc(2) + stop(2)

      if (buffer.length < totalLength) {
        return { success: false, error: 'Incomplete packet' };
      }

      // SuperClaude Context7 - Binary parsing best practices
      const parser = new Parser()
        .uint8('start1')
        .uint8('start2')
        .uint8('length')
        .uint8('protocol')
        .buffer('data', { length: () => length - 4 }) // protocol + data + serial + crc
        .uint16be('crc')
        .uint8('stop1')
        .uint8('stop2');

      const parsed = parser.parse(buffer);
      
      // Verify CRC
      if (!this.verifyCRC(buffer.slice(2, 2 + length + 1), parsed.crc)) {
        return { success: false, error: 'CRC verification failed' };
      }

      // Parse specific message type
      const message = this.parseMessageData(parsed.protocol, parsed.data);
      
      return {
        success: true,
        message: {
          ...message,
          protocol: 'GT06',
          rawData: buffer.slice(0, totalLength)
        },
        bytesConsumed: totalLength
      };

    } catch (error) {
      return { 
        success: false, 
        error: `GT06 parsing error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  private static parseMessageData(protocol: number, data: Buffer): Partial<GPSMessage> {
    switch (protocol) {
      case this.MESSAGE_TYPES.LOGIN:
        return this.parseLogin(data);
      
      case this.MESSAGE_TYPES.LOCATION:
      case this.MESSAGE_TYPES.GPS_LBS:
        return this.parseLocation(data);
      
      case this.MESSAGE_TYPES.HEARTBEAT:
        return this.parseHeartbeat(data);
      
      case this.MESSAGE_TYPES.ALARM:
      case this.MESSAGE_TYPES.GPS_LBS_ALARM:
        return this.parseAlarm(data);
      
      case this.MESSAGE_TYPES.STATUS:
        return this.parseStatus(data);
      
      default:
        return {
          type: 'UNKNOWN',
          data: { protocol, rawData: data }
        };
    }
  }

  // SuperClaude GPS Architect - Login message parsing
  private static parseLogin(data: Buffer): Partial<GPSMessage> {
    if (data.length < 10) {
      throw new Error('Invalid login data length');
    }

    const imei = data.slice(0, 8).toString('hex');
    const model = data.readUInt16BE(8);
    
    return {
      type: 'LOGIN',
      deviceId: imei,
      data: {
        imei,
        model: model.toString(16),
        timestamp: new Date()
      }
    };
  }

  // SuperClaude Context7 - Location parsing with GPS coordinates
  private static parseLocation(data: Buffer): Partial<GPSMessage> {
    if (data.length < 21) {
      throw new Error('Invalid location data length');
    }

    // SuperClaude GPS Architect - Date/time parsing
    const year = 2000 + data[0];
    const month = data[1];
    const day = data[2];
    const hour = data[3];
    const minute = data[4];
    const second = data[5];
    
    const timestamp = new Date(year, month - 1, day, hour, minute, second);

    // GPS info
    const gpsLength = data[6] >> 4;
    const satellites = data[6] & 0x0F;

    // SuperClaude Context7 - Coordinate conversion
    const latRaw = data.readUInt32BE(7);
    const lonRaw = data.readUInt32BE(11);
    
    const latitude = (latRaw / 30000) / 60;
    const longitude = (lonRaw / 30000) / 60;

    const speed = data[15];
    const heading = data.readUInt16BE(16) & 0x03FF;

    // LBS info
    const mcc = data.readUInt16BE(18);
    const mnc = data[20];

    return {
      type: 'LOCATION',
      timestamp,
      data: {
        latitude,
        longitude,
        speed,
        heading,
        satellites,
        timestamp: timestamp.toISOString(),
        gpsLength,
        mcc,
        mnc,
        valid: gpsLength > 0
      }
    };
  }

  private static parseHeartbeat(data: Buffer): Partial<GPSMessage> {
    return {
      type: 'HEARTBEAT',
      timestamp: new Date(),
      data: {
        timestamp: new Date().toISOString()
      }
    };
  }

  private static parseAlarm(data: Buffer): Partial<GPSMessage> {
    // Similar to location but with alarm info
    const locationData = this.parseLocation(data);
    
    return {
      ...locationData,
      type: 'ALARM',
      data: {
        ...locationData.data,
        alarmType: 'general'
      }
    };
  }

  private static parseStatus(data: Buffer): Partial<GPSMessage> {
    return {
      type: 'STATUS',
      timestamp: new Date(),
      data: {
        status: data.toString('hex'),
        timestamp: new Date().toISOString()
      }
    };
  }

  // SuperClaude GPS Architect - CRC verification
  private static verifyCRC(data: Buffer, expectedCRC: number): boolean {
    let crc = 0xFFFF;
    
    for (let i = 0; i < data.length - 2; i++) {
      crc ^= data[i];
      for (let j = 0; j < 8; j++) {
        if (crc & 1) {
          crc = (crc >> 1) ^ 0x8408;
        } else {
          crc >>= 1;
        }
      }
    }
    
    return crc === expectedCRC;
  }

  // SuperClaude Context7 - Response generation
  static createLoginResponse(success: boolean = true): Buffer {
    const response = Buffer.alloc(10);
    response[0] = 0x78;
    response[1] = 0x78;
    response[2] = 0x05;
    response[3] = 0x01;
    response[4] = success ? 0x01 : 0x00;
    response[5] = 0x00;
    response[6] = 0x00;
    response[7] = 0x00;
    response[8] = 0x0D;
    response[9] = 0x0A;
    
    return response;
  }

  static createAck(serial: number): Buffer {
    const response = Buffer.alloc(10);
    response[0] = 0x78;
    response[1] = 0x78;
    response[2] = 0x05;
    response[3] = 0x12;
    response.writeUInt16BE(serial, 4);
    // CRC calculation would go here
    response[8] = 0x0D;
    response[9] = 0x0A;
    
    return response;
  }

  static createHeartbeatResponse(): Buffer {
    const response = Buffer.alloc(10);
    response[0] = 0x78;
    response[1] = 0x78;
    response[2] = 0x05;
    response[3] = 0x13;
    response[4] = 0x00;
    response[5] = 0x00;
    response[6] = 0x00;
    response[7] = 0x00;
    response[8] = 0x0D;
    response[9] = 0x0A;
    
    return response;
  }
}