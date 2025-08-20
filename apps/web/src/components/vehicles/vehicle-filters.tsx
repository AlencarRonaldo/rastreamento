'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterState {
  search: string;
  status: 'all' | 'online' | 'offline' | 'maintenance';
  group: string;
  isMoving: 'all' | 'moving' | 'stopped';
}

interface VehicleFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  className?: string;
}

// Mock groups data - in real app, this would come from API
const mockGroups = [
  { id: '1', name: 'Veículos Pessoais' },
  { id: '2', name: 'Veículos Leves' },
  { id: '3', name: 'Caminhões' },
  { id: '4', name: 'Emergência' },
];

export function VehicleFilters({ filters, onChange, className }: VehicleFiltersProps) {
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const clearAllFilters = () => {
    onChange({
      search: '',
      status: 'all',
      group: '',
      isMoving: 'all',
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status !== 'all') count++;
    if (filters.group) count++;
    if (filters.isMoving !== 'all') count++;
    return count;
  };

  const removeFilter = (key: keyof FilterState) => {
    const value = key === 'status' || key === 'isMoving' ? 'all' : '';
    handleFilterChange(key, value);
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="maintenance">Manutenção</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Group Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Grupo</label>
          <Select
            value={filters.group}
            onValueChange={(value) => handleFilterChange('group', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os grupos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os grupos</SelectItem>
              {mockGroups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Movement Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Movimento</label>
          <Select
            value={filters.isMoving}
            onValueChange={(value) => handleFilterChange('isMoving', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="moving">Em movimento</SelectItem>
              <SelectItem value="stopped">Parados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        <div className="space-y-2">
          <label className="text-sm font-medium opacity-0">Ações</label>
          <Button
            variant="outline"
            onClick={clearAllFilters}
            disabled={activeFiltersCount === 0}
            className="w-full"
          >
            Limpar Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">Filtros ativos:</span>
            
            {filters.search && (
              <Badge variant="secondary" className="gap-1">
                Busca: "{filters.search}"
                <button
                  onClick={() => removeFilter('search')}
                  className="ml-1 hover:bg-destructive/20 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {filters.status !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                Status: {filters.status === 'online' ? 'Online' : 
                        filters.status === 'offline' ? 'Offline' : 'Manutenção'}
                <button
                  onClick={() => removeFilter('status')}
                  className="ml-1 hover:bg-destructive/20 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {filters.group && (
              <Badge variant="secondary" className="gap-1">
                Grupo: {mockGroups.find(g => g.id === filters.group)?.name}
                <button
                  onClick={() => removeFilter('group')}
                  className="ml-1 hover:bg-destructive/20 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {filters.isMoving !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {filters.isMoving === 'moving' ? 'Em movimento' : 'Parados'}
                <button
                  onClick={() => removeFilter('isMoving')}
                  className="ml-1 hover:bg-destructive/20 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

