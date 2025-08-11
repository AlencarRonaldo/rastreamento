import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, format: 'short' | 'long' | 'time' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'time') {
    return d.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  if (format === 'long') {
    return d.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  
  const km = meters / 1000;
  return `${km.toFixed(1)}km`;
}

export function formatSpeed(kmh: number): string {
  return `${Math.round(kmh)} km/h`;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  if (minutes > 0) {
    return `${minutes}m ${Math.round(remainingSeconds)}s`;
  }
  
  return `${Math.round(remainingSeconds)}s`;
}

export function formatFuel(liters: number): string {
  return `${liters.toFixed(1)}L`;
}

export function formatBattery(percentage: number): string {
  return `${Math.round(percentage)}%`;
}

export function getVehicleStatusColor(status: string): string {
  switch (status) {
    case 'online':
      return 'text-green-500';
    case 'offline':
      return 'text-gray-500';
    case 'maintenance':
      return 'text-yellow-500';
    default:
      return 'text-gray-500';
  }
}

export function getAlertSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'text-red-500 bg-red-50 border-red-200';
    case 'high':
      return 'text-orange-500 bg-orange-50 border-orange-200';
    case 'medium':
      return 'text-yellow-500 bg-yellow-50 border-yellow-200';
    case 'low':
      return 'text-blue-500 bg-blue-50 border-blue-200';
    default:
      return 'text-gray-500 bg-gray-50 border-gray-200';
  }
}

export function getRelativeTime(date: Date | string): string {
  const now = new Date();
  const target = typeof date === 'string' ? new Date(date) : date;
  const diff = now.getTime() - target.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} dia${days > 1 ? 's' : ''} atrás`;
  }
  
  if (hours > 0) {
    return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
  }
  
  if (minutes > 0) {
    return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`;
  }
  
  return 'Agora mesmo';
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Return distance in meters
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

export function generateVehicleColor(vehicleId: string): string {
  const colors = [
    '#ef4444', // red-500
    '#f97316', // orange-500
    '#eab308', // yellow-500
    '#22c55e', // green-500
    '#06b6d4', // cyan-500
    '#3b82f6', // blue-500
    '#6366f1', // indigo-500
    '#8b5cf6', // violet-500
    '#d946ef', // fuchsia-500
    '#ec4899', // pink-500
  ];
  
  let hash = 0;
  for (let i = 0; i < vehicleId.length; i++) {
    hash = vehicleId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function downloadBlob(data: Blob, filename: string): void {
  const url = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePlateNumber(plate: string): boolean {
  // Brazilian plate format: ABC-1234 or ABC1D23 (new format)
  const oldFormat = /^[A-Z]{3}-?\d{4}$/;
  const newFormat = /^[A-Z]{3}\d[A-Z]\d{2}$/;
  const cleaned = plate.replace(/[^A-Z0-9]/g, '').toUpperCase();
  
  return oldFormat.test(cleaned) || newFormat.test(cleaned);
}

export function formatPlateNumber(plate: string): string {
  const cleaned = plate.replace(/[^A-Z0-9]/g, '').toUpperCase();
  
  // New format: ABC1D23
  if (/^[A-Z]{3}\d[A-Z]\d{2}$/.test(cleaned)) {
    return cleaned;
  }
  
  // Old format: ABC1234 -> ABC-1234
  if (/^[A-Z]{3}\d{4}$/.test(cleaned)) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }
  
  return plate;
}

export function isPointInCircle(
  point: { lat: number; lng: number },
  center: { lat: number; lng: number },
  radius: number
): boolean {
  const distance = calculateDistance(point.lat, point.lng, center.lat, center.lng);
  return distance <= radius;
}

export function isPointInPolygon(
  point: { lat: number; lng: number },
  polygon: { lat: number; lng: number }[]
): boolean {
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;
    const xj = polygon[j].lng;
    const yj = polygon[j].lat;
    
    if (
      yi > point.lat !== yj > point.lat &&
      point.lng < ((xj - xi) * (point.lat - yi)) / (yj - yi) + xi
    ) {
      inside = !inside;
    }
  }
  
  return inside;
}

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns: { key: keyof T; label: string }[]
): void {
  const headers = columns.map(col => col.label);
  const csvData = [
    headers.join(','),
    ...data.map(row =>
      columns
        .map(col => {
          const value = row[col.key];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value?.toString() || '';
        })
        .join(',')
    ),
  ];
  
  const blob = new Blob([csvData.join('\n')], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename}.csv`);
}