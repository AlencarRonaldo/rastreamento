'use client';

import * as React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Vehicle } from '@/types';
import { formatSpeed } from '@/lib/utils';

interface ActivityChartProps {
  vehicles: Vehicle[];
  timeRange?: '24h' | '7d' | '30d';
  className?: string;
}

// Mock data generator for activity chart
const generateMockData = (vehicles: Vehicle[], hours: number = 24) => {
  const data = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = time.getHours();
    
    // Simulate realistic vehicle activity patterns
    let activeVehicles = 0;
    let totalSpeed = 0;
    let totalDistance = 0;
    
    vehicles.forEach((vehicle, index) => {
      // Simulate activity based on time of day and vehicle characteristics
      const baseActivity = Math.sin((hour - 6) * Math.PI / 12); // Peak during day hours
      const randomFactor = Math.random() * 0.3 + 0.7; // Add some randomness
      const isActive = baseActivity * randomFactor > 0.2;
      
      if (isActive) {
        activeVehicles++;
        const speed = Math.random() * 60 + 20; // 20-80 km/h
        totalSpeed += speed;
        totalDistance += speed * 0.5; // Approximate distance in km
      }
    });
    
    const avgSpeed = activeVehicles > 0 ? totalSpeed / activeVehicles : 0;
    
    data.push({
      time: time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      hour: hour,
      activeVehicles,
      totalVehicles: vehicles.length,
      averageSpeed: Math.round(avgSpeed),
      distance: Math.round(totalDistance),
      timestamp: time,
    });
  }
  
  return data;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium text-sm mb-2">{`Horário: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.dataKey === 'activeVehicles' && `Veículos Ativos: ${entry.value}`}
            {entry.dataKey === 'averageSpeed' && `Velocidade Média: ${entry.value} km/h`}
            {entry.dataKey === 'distance' && `Distância: ${entry.value} km`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function ActivityChart({ vehicles, timeRange = '24h', className }: ActivityChartProps) {
  const [chartType, setChartType] = React.useState<'area' | 'line' | 'bar'>('area');
  
  const data = React.useMemo(() => {
    const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
    return generateMockData(vehicles, hours);
  }, [vehicles, timeRange]);

  const ChartComponent = chartType === 'area' ? AreaChart : 
                        chartType === 'line' ? LineChart : BarChart;

  return (
    <div className={className}>
      {/* Chart Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('area')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              chartType === 'area' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Área
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              chartType === 'line' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Linha
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              chartType === 'bar' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Barra
          </button>
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="time" 
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <YAxis className="text-xs" tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {chartType === 'area' && (
              <>
                <Area
                  type="monotone"
                  dataKey="activeVehicles"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  name="Veículos Ativos"
                />
                <Area
                  type="monotone"
                  dataKey="averageSpeed"
                  stackId="2"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="Velocidade Média (km/h)"
                />
              </>
            )}
            
            {chartType === 'line' && (
              <>
                <Line
                  type="monotone"
                  dataKey="activeVehicles"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 0, r: 3 }}
                  name="Veículos Ativos"
                />
                <Line
                  type="monotone"
                  dataKey="averageSpeed"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 0, r: 3 }}
                  name="Velocidade Média (km/h)"
                />
              </>
            )}
            
            {chartType === 'bar' && (
              <>
                <Bar
                  dataKey="activeVehicles"
                  fill="#3b82f6"
                  name="Veículos Ativos"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="averageSpeed"
                  fill="#10b981"
                  name="Velocidade Média (km/h)"
                  radius={[2, 2, 0, 0]}
                />
              </>
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.max(...data.map(d => d.activeVehicles))}
          </div>
          <div className="text-xs text-muted-foreground">Pico de Atividade</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {Math.round(data.reduce((sum, d) => sum + d.averageSpeed, 0) / data.length)}
          </div>
          <div className="text-xs text-muted-foreground">Vel. Média (km/h)</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {Math.round(data.reduce((sum, d) => sum + d.distance, 0))}
          </div>
          <div className="text-xs text-muted-foreground">Total (km)</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {Math.round((data.reduce((sum, d) => sum + d.activeVehicles, 0) / data.length) / vehicles.length * 100)}%
          </div>
          <div className="text-xs text-muted-foreground">Tempo Ativo</div>
        </div>
      </div>
    </div>
  );
}