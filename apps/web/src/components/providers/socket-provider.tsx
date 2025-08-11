'use client';

import * as React from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth';
import { useVehiclesStore } from '@/store/vehicles';
import { VehicleUpdate, AlertEvent } from '@/types';
import toast from 'react-hot-toast';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = React.createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  const context = React.useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const { isAuthenticated, token } = useAuthStore();
  const { updateVehiclePosition, addAlert } = useVehiclesStore();

  React.useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Create socket connection
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      auth: {
        token,
      },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection events
    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      setIsConnected(true);
      toast.success('Conectado ao servidor em tempo real');
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        socketInstance.connect();
      }
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
      toast.error('Erro na conexão em tempo real');
    });

    // Vehicle updates
    socketInstance.on('vehicle_update', (data: VehicleUpdate['data']) => {
      updateVehiclePosition(data.vehicleId, data.position);
    });

    // Alert events
    socketInstance.on('alert', (data: AlertEvent['data']) => {
      addAlert(data);
      
      // Show toast notification for critical alerts
      if (data.severity === 'critical' || data.severity === 'high') {
        toast.error(`${data.title}: ${data.message}`, {
          duration: 8000,
        });
      } else {
        toast(`${data.title}: ${data.message}`, {
          duration: 5000,
        });
      }
    });

    // Heartbeat to keep connection alive
    const heartbeat = setInterval(() => {
      if (socketInstance.connected) {
        socketInstance.emit('ping');
      }
    }, 30000); // 30 seconds

    setSocket(socketInstance);

    return () => {
      clearInterval(heartbeat);
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [isAuthenticated, token, updateVehiclePosition, addAlert]);

  const value = React.useMemo(
    () => ({
      socket,
      isConnected,
    }),
    [socket, isConnected]
  );

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}