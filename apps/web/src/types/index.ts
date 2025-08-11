// Core interfaces for the vehicle tracking system

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'operator' | 'viewer';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vehicle {
  id: string;
  name: string;
  plateNumber: string;
  model: string;
  year: number;
  deviceId: string;
  groupId?: string;
  driverId?: string;
  status: 'online' | 'offline' | 'maintenance';
  isMoving: boolean;
  position: Position;
  lastUpdate: Date;
  totalDistance: number;
  batteryLevel?: number;
  fuelLevel?: number;
  engineStatus: boolean;
  speed: number;
  maxSpeed: number;
  averageSpeed: number;
  ignitionStatus: boolean;
  icon?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Position {
  id: string;
  vehicleId: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  heading: number;
  speed: number;
  timestamp: Date;
  address?: string;
  odometer?: number;
  engineStatus: boolean;
  ignitionStatus: boolean;
  batteryLevel?: number;
  fuelLevel?: number;
  course?: number;
  satellites?: number;
  hdop?: number;
}

export interface Alert {
  id: string;
  vehicleId: string;
  type: AlertType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  status: 'pending' | 'acknowledged' | 'resolved';
  position?: Position;
  timestamp: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  data?: Record<string, any>;
}

export type AlertType =
  | 'speed_limit'
  | 'geofence_enter'
  | 'geofence_exit'
  | 'panic_button'
  | 'engine_on'
  | 'engine_off'
  | 'low_battery'
  | 'low_fuel'
  | 'maintenance_due'
  | 'device_offline'
  | 'accident_detected'
  | 'harsh_driving'
  | 'idle_time'
  | 'route_deviation';

export interface Group {
  id: string;
  name: string;
  description?: string;
  color?: string;
  vehicleCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Geofence {
  id: string;
  name: string;
  description?: string;
  type: 'circle' | 'polygon';
  coordinates: GeofenceCoordinates;
  isActive: boolean;
  alertOnEnter: boolean;
  alertOnExit: boolean;
  vehicleIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GeofenceCoordinates {
  circle?: {
    center: { lat: number; lng: number };
    radius: number;
  };
  polygon?: {
    points: { lat: number; lng: number }[];
  };
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phone?: string;
  email?: string;
  avatar?: string;
  vehicleIds: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Route {
  id: string;
  vehicleId: string;
  startPosition: Position;
  endPosition: Position;
  waypoints: Position[];
  distance: number;
  duration: number;
  averageSpeed: number;
  maxSpeed: number;
  startTime: Date;
  endTime: Date;
  fuelConsumed?: number;
}

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  vehicleIds: string[];
  dateRange: {
    start: Date;
    end: Date;
  };
  parameters: Record<string, any>;
  data: any;
  generatedAt: Date;
  generatedBy: string;
  format: 'pdf' | 'excel' | 'csv';
  status: 'generating' | 'completed' | 'failed';
}

export type ReportType =
  | 'vehicle_activity'
  | 'driver_behavior'
  | 'fuel_consumption'
  | 'maintenance_schedule'
  | 'route_analysis'
  | 'alerts_summary'
  | 'distance_traveled'
  | 'idle_time'
  | 'speed_violations';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  alertId?: string;
  vehicleId?: string;
  timestamp: Date;
}

export interface Settings {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    alertTypes: AlertType[];
  };
  mapSettings: {
    defaultZoom: number;
    defaultCenter: { lat: number; lng: number };
    mapStyle: 'street' | 'satellite' | 'terrain';
    showTraffic: boolean;
    showRoutes: boolean;
  };
  dashboardLayout: {
    widgets: DashboardWidget[];
  };
}

export interface DashboardWidget {
  id: string;
  type: 'map' | 'stats' | 'alerts' | 'vehicles' | 'charts' | 'activity';
  position: { x: number; y: number; width: number; height: number };
  config: Record<string, any>;
  isVisible: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  status?: string;
  groupId?: string;
  vehicleId?: string;
  startDate?: string;
  endDate?: string;
}

// WebSocket events
export interface WebSocketEvent {
  type: string;
  data: any;
  timestamp: Date;
}

export interface VehicleUpdate extends WebSocketEvent {
  type: 'vehicle_update';
  data: {
    vehicleId: string;
    position: Position;
    status: Vehicle['status'];
    speed: number;
    isMoving: boolean;
  };
}

export interface AlertEvent extends WebSocketEvent {
  type: 'alert';
  data: Alert;
}

// UI State types
export interface MapState {
  center: { lat: number; lng: number };
  zoom: number;
  selectedVehicleId?: string;
  showTraffic: boolean;
  showGeofences: boolean;
  followMode: boolean;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, item: any) => React.ReactNode;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

export interface VehicleForm {
  name: string;
  plateNumber: string;
  model: string;
  year: number;
  deviceId: string;
  groupId?: string;
  driverId?: string;
  maxSpeed: number;
  color?: string;
  icon?: string;
}

export interface GeofenceForm {
  name: string;
  description?: string;
  type: 'circle' | 'polygon';
  alertOnEnter: boolean;
  alertOnExit: boolean;
  vehicleIds: string[];
}

// Chart data types
export interface ChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
}

export interface ChartDataset {
  label: string;
  data: ChartDataPoint[];
  color?: string;
  backgroundColor?: string;
}

// Real-time data types
export interface LiveData {
  vehicles: Vehicle[];
  alerts: Alert[];
  lastUpdate: Date;
}

// Command types for vehicle control
export interface VehicleCommand {
  id: string;
  vehicleId: string;
  type: CommandType;
  parameters?: Record<string, any>;
  status: 'pending' | 'sent' | 'confirmed' | 'failed';
  timestamp: Date;
  response?: any;
}

export type CommandType =
  | 'engine_stop'
  | 'engine_start'
  | 'lock_doors'
  | 'unlock_doors'
  | 'horn'
  | 'lights'
  | 'locate'
  | 'reset_device';

// Statistics types
export interface DashboardStats {
  totalVehicles: number;
  onlineVehicles: number;
  movingVehicles: number;
  totalDistance: number;
  activeAlerts: number;
  fuelConsumption: number;
  averageSpeed: number;
  uptime: number;
}

export interface VehicleStats {
  todayDistance: number;
  weekDistance: number;
  monthDistance: number;
  totalDistance: number;
  averageSpeed: number;
  maxSpeed: number;
  idleTime: number;
  engineHours: number;
  fuelEfficiency: number;
  maintenanceScore: number;
}