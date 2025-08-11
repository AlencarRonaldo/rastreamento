/**
 * Protocol Parser Interface - SuperClaude Generated
 * Interface base para todos os parsers GPS
 * Persona: GPS Architect
 */

export interface GPSMessage {
  type: 'LOGIN' | 'LOCATION' | 'HEARTBEAT' | 'ALARM' | 'STATUS' | 'UNKNOWN';
  deviceId?: string;
  timestamp?: Date;
  protocol: string;
  data: any;
  rawData?: Buffer;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  altitude?: number;
  satellites?: number;
  battery?: number;
  ignition?: boolean;
  mileage?: number;
  gsm?: number;
  timestamp: string;
  valid: boolean;
}

export interface ProtocolParserInterface {
  identify(buffer: Buffer): boolean;
  parse(buffer: Buffer): {
    success: boolean;
    message?: GPSMessage;
    bytesConsumed?: number;
    error?: string;
  };
}

export class ProtocolParser {
  private static parsers: Map<string, any> = new Map();

  static registerParser(name: string, parser: any) {
    this.parsers.set(name, parser);
  }

  static identifyProtocol(buffer: Buffer): string | null {
    // Try GT06 first (most common)
    if (buffer.length >= 4 && buffer[0] === 0x78 && buffer[1] === 0x78) {
      return 'GT06';
    }

    // Try H02 (ASCII based)
    const str = buffer.toString('ascii', 0, Math.min(10, buffer.length));
    if (str.startsWith('*HQ')) {
      return 'H02';
    }

    // Try TK103
    if (str.startsWith('(') || str.includes('BP05')) {
      return 'TK103';
    }

    // Try TOTEM
    if (str.startsWith('$$') || str.includes('TOTEM')) {
      return 'TOTEM';
    }

    return null;
  }

  static getParser(protocol: string): any {
    const parser = this.parsers.get(protocol);
    if (!parser) {
      throw new Error(`Parser not found for protocol: ${protocol}`);
    }
    return parser;
  }

  static getAllParsers(): string[] {
    return Array.from(this.parsers.keys());
  }
}