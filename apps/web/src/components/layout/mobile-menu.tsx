'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
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
  X,
  CreditCard,
  Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Veículos',
    href: '/vehicles',
    icon: Car,
  },
  {
    name: 'Mapa',
    href: '/map',
    icon: Map,
  },
  {
    name: 'Alertas',
    href: '/alerts',
    icon: AlertTriangle,
  },
  {
    name: 'Análises',
    href: '/reports',
    icon: FileText,
  },
  {
    name: 'Monitoramento',
    href: '/monitoring',
    icon: Activity,
  },
  {
    name: 'Financeiro',
    href: '/financeiro',
    icon: CreditCard,
  },
  {
    name: 'Serviços',
    href: '/services',
    icon: Wrench,
  },
];

const adminItems = [
  {
    name: 'Usuários',
    href: '/users',
    icon: Users,
  },
  {
    name: 'Cercas Virtuais',
    href: '/geofences',
    icon: Shield,
  },
];

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleLinkClick = () => {
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-50 h-full w-64 border-r bg-card lg:hidden">
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Truck className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Vehicle Tracking</span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
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
                  onClick={handleLinkClick}
                  className={cn(
                    'group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground',
                    active 
                      ? 'bg-accent text-accent-foreground font-medium' 
                      : 'text-muted-foreground'
                  )}
                >
                  <Icon className={cn(
                    'h-5 w-5 flex-shrink-0',
                    active ? 'text-primary' : ''
                  )} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Admin Section */}
          {user?.role === 'admin' && (
            <div className="mt-6">
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Administração
                </h3>
              </div>
              
              <div className="space-y-1">
                {adminItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleLinkClick}
                      className={cn(
                        'group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground',
                        active 
                          ? 'bg-accent text-accent-foreground font-medium' 
                          : 'text-muted-foreground'
                      )}
                    >
                      <Icon className={cn(
                        'h-5 w-5 flex-shrink-0',
                        active ? 'text-primary' : ''
                      )} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* User Section */}
        <div className="border-t p-3">
          {user && (
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
              onClick={handleLinkClick}
              className={cn(
                'group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground text-muted-foreground',
                isActive('/settings') && 'bg-accent text-accent-foreground font-medium'
              )}
            >
              <Settings className="h-5 w-5 flex-shrink-0" />
              <span>Configurações</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-destructive hover:text-destructive-foreground text-muted-foreground"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}