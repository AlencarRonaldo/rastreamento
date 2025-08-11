'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VehiclesList } from '@/components/dashboard/vehicles-list';
import { VehicleCard } from '@/components/vehicles/vehicle-card';
import { VehicleFilters } from '@/components/vehicles/vehicle-filters';
import { useVehiclesStore } from '@/store/vehicles';
import {
  Car,
  Plus,
  Search,
  Grid,
  List,
  Filter,
  SortAsc,
  SortDesc,
  Download,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'list' | 'grid';
type SortField = 'name' | 'status' | 'lastUpdate' | 'speed' | 'distance';
type SortOrder = 'asc' | 'desc';

interface FilterState {
  search: string;
  status: 'all' | 'online' | 'offline' | 'maintenance';
  group: string;
  isMoving: 'all' | 'moving' | 'stopped';
}

export default function VehiclesPage() {
  const router = useRouter();
  const { vehicles, isLoading } = useVehiclesStore();
  
  const [viewMode, setViewMode] = React.useState<ViewMode>('grid');
  const [selectedVehicleId, setSelectedVehicleId] = React.useState<string | null>(null);
  const [sortField, setSortField] = React.useState<SortField>('name');
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('asc');
  const [showFilters, setShowFilters] = React.useState(false);
  
  const [filters, setFilters] = React.useState<FilterState>({
    search: '',
    status: 'all',
    group: '',
    isMoving: 'all'
  });

  // Filter and sort vehicles
  const filteredVehicles = React.useMemo(() => {
    let filtered = vehicles;

    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(vehicle =>
        vehicle.name.toLowerCase().includes(search) ||
        vehicle.plateNumber.toLowerCase().includes(search) ||
        vehicle.model.toLowerCase().includes(search)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.status === filters.status);
    }

    // Movement filter
    if (filters.isMoving !== 'all') {
      filtered = filtered.filter(vehicle => 
        filters.isMoving === 'moving' ? vehicle.isMoving : !vehicle.isMoving
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'lastUpdate':
          aValue = a.lastUpdate.getTime();
          bValue = b.lastUpdate.getTime();
          break;
        case 'speed':
          aValue = a.speed;
          bValue = b.speed;
          break;
        case 'distance':
          aValue = a.totalDistance;
          bValue = b.totalDistance;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [vehicles, filters, sortField, sortOrder]);

  const handleVehicleClick = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    router.push(`/vehicles/${vehicleId}`);
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleRefresh = () => {
    // In a real app, this would refetch data
    console.log('Refreshing vehicles data...');
  };

  const handleExport = () => {
    // Export vehicles data to CSV
    const csvData = [
      ['Nome', 'Placa', 'Modelo', 'Status', 'Velocidade', 'Última Atualização'],
      ...filteredVehicles.map(vehicle => [
        vehicle.name,
        vehicle.plateNumber,
        vehicle.model,
        vehicle.status,
        vehicle.speed.toString(),
        vehicle.lastUpdate.toLocaleString('pt-BR')
      ])
    ];

    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `veiculos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Carregando veículos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Veículos</h1>
          <p className="text-muted-foreground">
            Gerencie e monitore todos os veículos da sua frota
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          
          <Button asChild>
            <Link href="/vehicles/new">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Veículo
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, placa ou modelo..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-9"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(showFilters && 'bg-accent')}
              >
                <Filter className="h-4 w-4" />
              </Button>

              <div className="flex border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'rounded-r-none',
                    viewMode === 'list' && 'bg-accent'
                  )}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'rounded-l-none border-l',
                    viewMode === 'grid' && 'bg-accent'
                  )}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <VehicleFilters
                filters={filters}
                onChange={setFilters}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Exibindo {filteredVehicles.length} de {vehicles.length} veículos
        </div>
        
        <div className="flex items-center gap-2">
          <span>Ordenar por:</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSort('name')}
            className={cn(sortField === 'name' && 'bg-accent')}
          >
            Nome
            {sortField === 'name' && (
              sortOrder === 'asc' ? <SortAsc className="ml-1 h-3 w-3" /> : <SortDesc className="ml-1 h-3 w-3" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSort('status')}
            className={cn(sortField === 'status' && 'bg-accent')}
          >
            Status
            {sortField === 'status' && (
              sortOrder === 'asc' ? <SortAsc className="ml-1 h-3 w-3" /> : <SortDesc className="ml-1 h-3 w-3" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSort('lastUpdate')}
            className={cn(sortField === 'lastUpdate' && 'bg-accent')}
          >
            Atualização
            {sortField === 'lastUpdate' && (
              sortOrder === 'asc' ? <SortAsc className="ml-1 h-3 w-3" /> : <SortDesc className="ml-1 h-3 w-3" />
            )}
          </Button>
        </div>
      </div>

      {/* Vehicles List/Grid */}
      {filteredVehicles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Car className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum veículo encontrado</h3>
            <p className="text-muted-foreground text-center mb-4">
              {filters.search || filters.status !== 'all' || filters.isMoving !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Adicione veículos para começar o monitoramento da sua frota'
              }
            </p>
            {(!filters.search && filters.status === 'all' && filters.isMoving === 'all') && (
              <Button asChild>
                <Link href="/vehicles/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Veículo
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onClick={() => handleVehicleClick(vehicle.id)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <VehiclesList
              vehicles={filteredVehicles}
              onVehicleClick={handleVehicleClick}
              selectedVehicleId={selectedVehicleId}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}