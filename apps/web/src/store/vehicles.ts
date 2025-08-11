import { create } from 'zustand';
import { Vehicle, Position, Alert, DashboardStats } from '@/types';

interface VehiclesState {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  positions: Record<string, Position[]>;
  alerts: Alert[];
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setVehicles: (vehicles: Vehicle[]) => void;
  updateVehicle: (vehicleId: string, updates: Partial<Vehicle>) => void;
  addVehicle: (vehicle: Vehicle) => void;
  removeVehicle: (vehicleId: string) => void;
  setSelectedVehicle: (vehicleId: string | null) => void;
  updateVehiclePosition: (vehicleId: string, position: Position) => void;
  addAlert: (alert: Alert) => void;
  updateAlert: (alertId: string, updates: Partial<Alert>) => void;
  removeAlert: (alertId: string) => void;
  setStats: (stats: DashboardStats) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Getters
  getVehicleById: (id: string) => Vehicle | undefined;
  getOnlineVehicles: () => Vehicle[];
  getMovingVehicles: () => Vehicle[];
  getActiveAlerts: () => Alert[];
  getVehiclePositions: (vehicleId: string) => Position[];
}

// Mock data
const mockVehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Caminhão A001',
    plateNumber: 'ABC-1234',
    model: 'Volvo FH',
    year: 2020,
    deviceId: 'DEV001',
    status: 'online',
    isMoving: true,
    position: {
      id: 'pos1',
      vehicleId: '1',
      latitude: -23.5505,
      longitude: -46.6333,
      altitude: 750,
      heading: 45,
      speed: 65,
      timestamp: new Date(),
      address: 'Av. Paulista, São Paulo - SP',
      engineStatus: true,
      ignitionStatus: true,
      batteryLevel: 85,
    },
    lastUpdate: new Date(),
    totalDistance: 125000,
    batteryLevel: 85,
    engineStatus: true,
    speed: 65,
    maxSpeed: 90,
    averageSpeed: 45,
    ignitionStatus: true,
    color: '#3b82f6',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Van B002',
    plateNumber: 'DEF-5678',
    model: 'Mercedes Sprinter',
    year: 2019,
    deviceId: 'DEV002',
    status: 'offline',
    isMoving: false,
    position: {
      id: 'pos2',
      vehicleId: '2',
      latitude: -23.5525,
      longitude: -46.6350,
      altitude: 740,
      heading: 0,
      speed: 0,
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      address: 'Rua Augusta, São Paulo - SP',
      engineStatus: false,
      ignitionStatus: false,
      batteryLevel: 75,
    },
    lastUpdate: new Date(Date.now() - 30 * 60 * 1000),
    totalDistance: 87500,
    batteryLevel: 75,
    engineStatus: false,
    speed: 0,
    maxSpeed: 80,
    averageSpeed: 35,
    ignitionStatus: false,
    color: '#ef4444',
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Carro C003',
    plateNumber: 'GHI-9012',
    model: 'Toyota Corolla',
    year: 2021,
    deviceId: 'DEV003',
    status: 'online',
    isMoving: false,
    position: {
      id: 'pos3',
      vehicleId: '3',
      latitude: -23.5495,
      longitude: -46.6310,
      altitude: 760,
      heading: 180,
      speed: 0,
      timestamp: new Date(),
      address: 'Av. Faria Lima, São Paulo - SP',
      engineStatus: true,
      ignitionStatus: true,
      batteryLevel: 92,
    },
    lastUpdate: new Date(),
    totalDistance: 45000,
    batteryLevel: 92,
    engineStatus: true,
    speed: 0,
    maxSpeed: 80,
    averageSpeed: 40,
    ignitionStatus: true,
    color: '#22c55e',
    createdAt: new Date('2023-03-01'),
    updatedAt: new Date(),
  },
];

const mockAlerts: Alert[] = [
  {
    id: '1',
    vehicleId: '1',
    type: 'speed_limit',
    severity: 'high',
    title: 'Excesso de velocidade',
    message: 'Veículo Caminhão A001 excedeu o limite de velocidade (65 km/h em zona de 50 km/h)',
    status: 'pending',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    position: mockVehicles[0].position,
  },
  {
    id: '2',
    vehicleId: '2',
    type: 'device_offline',
    severity: 'medium',
    title: 'Dispositivo offline',
    message: 'Van B002 está offline há mais de 30 minutos',
    status: 'acknowledged',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    acknowledgedAt: new Date(Date.now() - 25 * 60 * 1000),
    acknowledgedBy: 'admin@tracking.com',
  },
];

const mockStats: DashboardStats = {
  totalVehicles: 3,
  onlineVehicles: 2,
  movingVehicles: 1,
  totalDistance: 257500,
  activeAlerts: 1,
  fuelConsumption: 150.5,
  averageSpeed: 40,
  uptime: 98.5,
};

export const useVehiclesStore = create<VehiclesState>()((set, get) => ({
  vehicles: mockVehicles,
  selectedVehicleId: null,
  positions: {},
  alerts: mockAlerts,
  stats: mockStats,
  isLoading: false,
  error: null,

  setVehicles: (vehicles: Vehicle[]) => {
    set({ vehicles });
  },

  updateVehicle: (vehicleId: string, updates: Partial<Vehicle>) => {
    set((state) => ({
      vehicles: state.vehicles.map((vehicle) =>
        vehicle.id === vehicleId ? { ...vehicle, ...updates } : vehicle
      ),
    }));
  },

  addVehicle: (vehicle: Vehicle) => {
    set((state) => ({
      vehicles: [...state.vehicles, vehicle],
    }));
  },

  removeVehicle: (vehicleId: string) => {
    set((state) => ({
      vehicles: state.vehicles.filter((vehicle) => vehicle.id !== vehicleId),
    }));
  },

  setSelectedVehicle: (vehicleId: string | null) => {
    set({ selectedVehicleId: vehicleId });
  },

  updateVehiclePosition: (vehicleId: string, position: Position) => {
    set((state) => {
      // Update vehicle position
      const updatedVehicles = state.vehicles.map((vehicle) => {
        if (vehicle.id === vehicleId) {
          return {
            ...vehicle,
            position,
            speed: position.speed,
            lastUpdate: position.timestamp,
            isMoving: position.speed > 5, // Consider moving if speed > 5 km/h
            engineStatus: position.engineStatus,
            ignitionStatus: position.ignitionStatus,
            batteryLevel: position.batteryLevel || vehicle.batteryLevel,
          };
        }
        return vehicle;
      });

      // Add to position history
      const updatedPositions = {
        ...state.positions,
        [vehicleId]: [
          ...(state.positions[vehicleId] || []).slice(-99), // Keep last 100 positions
          position,
        ],
      };

      return {
        vehicles: updatedVehicles,
        positions: updatedPositions,
      };
    });
  },

  addAlert: (alert: Alert) => {
    set((state) => ({
      alerts: [alert, ...state.alerts],
    }));
  },

  updateAlert: (alertId: string, updates: Partial<Alert>) => {
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === alertId ? { ...alert, ...updates } : alert
      ),
    }));
  },

  removeAlert: (alertId: string) => {
    set((state) => ({
      alerts: state.alerts.filter((alert) => alert.id !== alertId),
    }));
  },

  setStats: (stats: DashboardStats) => {
    set({ stats });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  // Getters
  getVehicleById: (id: string) => {
    return get().vehicles.find((vehicle) => vehicle.id === id);
  },

  getOnlineVehicles: () => {
    return get().vehicles.filter((vehicle) => vehicle.status === 'online');
  },

  getMovingVehicles: () => {
    return get().vehicles.filter((vehicle) => vehicle.isMoving);
  },

  getActiveAlerts: () => {
    return get().alerts.filter((alert) => alert.status === 'pending');
  },

  getVehiclePositions: (vehicleId: string) => {
    return get().positions[vehicleId] || [];
  },
}));