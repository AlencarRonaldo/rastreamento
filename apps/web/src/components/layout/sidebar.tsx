'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';
import {
  LayoutDashboard,
  Car,
  AlertTriangle,
  FileText,
  Settings,
  Users,
  Shield,
  Map,
  Activity,
  Truck,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Visão geral do sistema',
  },
  {
    name: 'Veículos',
    href: '/vehicles',
    icon: Car,
    description: 'Gerenciar frota',
  },
  {
    name: 'Mapa',
    href: '/map',
    icon: Map,
    description: 'Visualização em tempo real',
  },
  {
    name: 'Alertas',
    href: '/alerts',
    icon: AlertTriangle,
    description: 'Notificações e avisos',
  },
  {
    name: 'Relatórios',
    href: '/reports',
    icon: FileText,
    description: 'Análises e estatísticas',
  },
  {
    name: 'Monitoramento',
    href: '/monitoring',
    icon: Activity,
    description: 'Status em tempo real',
  },
];

const adminItems = [
  {
    name: 'Usuários',
    href: '/users',
    icon: Users,
    description: 'Gerenciar usuários',
  },
  {
    name: 'Cercas Virtuais',
    href: '/geofences',
    icon: Shield,
    description: 'Configurar áreas',
  },
];

interface SidebarProps {
  className?: string;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ className, collapsed = false, onCollapsedChange }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [localCollapsed, setLocalCollapsed] = React.useState(collapsed);

  const handleCollapse = () => {
    const newCollapsed = !localCollapsed;
    setLocalCollapsed(newCollapsed);
    onCollapsedChange?.(newCollapsed);
  };

  const handleLogout = () => {
    logout();
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className={cn(
      'fixed left-0 top-0 z-50 flex h-full flex-col border-r bg-card transition-all duration-300',
      localCollapsed ? 'w-16' : 'w-64',
      className
    )}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!localCollapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Truck className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Vehicle Tracking</span>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCollapse}
          className={cn(
            'h-8 w-8',
            localCollapsed && 'mx-auto'
          )}
        >
          {localCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground',
                  active 
                    ? 'bg-accent text-accent-foreground font-medium' 
                    : 'text-muted-foreground',
                  localCollapsed && 'justify-center px-2'
                )}
                title={localCollapsed ? item.name : undefined}
              >
                <Icon className={cn(
                  'h-5 w-5 flex-shrink-0',
                  active ? 'text-primary' : ''
                )} />
                {!localCollapsed && (
                  <div className="flex-1 truncate">
                    <div className="truncate">{item.name}</div>
                    {!active && (
                      <div className="text-xs text-muted-foreground/70 truncate">
                        {item.description}
                      </div>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Admin Section */}
        {user?.role === 'admin' && (
          <div className="mt-6">
            {!localCollapsed && (
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Administração
                </h3>
              </div>
            )}
            
            <div className="space-y-1">
              {adminItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground',
                      active 
                        ? 'bg-accent text-accent-foreground font-medium' 
                        : 'text-muted-foreground',
                      localCollapsed && 'justify-center px-2'
                    )}
                    title={localCollapsed ? item.name : undefined}
                  >
                    <Icon className={cn(
                      'h-5 w-5 flex-shrink-0',
                      active ? 'text-primary' : ''
                    )} />
                    {!localCollapsed && (
                      <div className="flex-1 truncate">
                        <div className="truncate">{item.name}</div>
                        {!active && (
                          <div className="text-xs text-muted-foreground/70 truncate">
                            {item.description}
                          </div>
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* User Section */}
      <div className="border-t p-3">
        {!localCollapsed && user && (
          <div className="mb-3 px-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user.name}</div>
                <div className="text-xs text-muted-foreground truncate capitalize">
                  {user.role}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-1">
          <Link
            href="/settings"
            className={cn(
              'group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground text-muted-foreground',
              isActive('/settings') && 'bg-accent text-accent-foreground font-medium',
              localCollapsed && 'justify-center px-2'
            )}
            title={localCollapsed ? 'Configurações' : undefined}
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            {!localCollapsed && <span>Configurações</span>}
          </Link>
          
          <button
            onClick={handleLogout}
            className={cn(
              'group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-destructive hover:text-destructive-foreground text-muted-foreground',
              localCollapsed && 'justify-center px-2'
            )}
            title={localCollapsed ? 'Sair' : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!localCollapsed && <span>Sair</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}