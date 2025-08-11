'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'destructive' | 'success';
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend = 'neutral',
  variant = 'default',
  className,
}: StatsCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600 dark:text-green-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'destructive':
        return 'border-red-200 dark:border-red-800';
      case 'success':
        return 'border-green-200 dark:border-green-800';
      default:
        return '';
    }
  };

  return (
    <Card className={cn('', getVariantStyles(), className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">{title}</h3>
          <Icon className={cn(
            'h-4 w-4',
            variant === 'destructive' ? 'text-red-500' :
            variant === 'success' ? 'text-green-500' :
            'text-muted-foreground'
          )} />
        </div>
        
        <div className="space-y-1">
          <div className="text-2xl font-bold">{value}</div>
          
          {description && (
            <div className="flex items-center gap-1">
              {getTrendIcon()}
              <p className={cn('text-xs', getTrendColor())}>
                {description}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}