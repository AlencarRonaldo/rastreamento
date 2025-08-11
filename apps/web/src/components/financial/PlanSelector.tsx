'use client';

import React from 'react';
import { Check, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SubscriptionPlan } from '@/types/financial';
import { cn } from '@/lib/utils';

interface PlanSelectorProps {
  plans: SubscriptionPlan[];
  currentPlanId?: string;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  loading?: boolean;
}

export default function PlanSelector({ plans, currentPlanId, onSelectPlan, loading = false }: PlanSelectorProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(price);
  };

  const getIntervalText = (interval: string) => {
    switch (interval) {
      case 'monthly':
        return '/mês';
      case 'yearly':
        return '/ano';
      default:
        return '';
    }
  };

  const getSupportLevelText = (level: string) => {
    switch (level) {
      case 'basic':
        return 'Suporte Básico';
      case 'priority':
        return 'Suporte Prioritário';
      case 'dedicated':
        return 'Suporte Dedicado';
      default:
        return 'Suporte';
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <Card 
          key={plan.id} 
          className={cn(
            'relative transition-all duration-200 hover:shadow-lg',
            plan.popular && 'ring-2 ring-primary shadow-lg',
            currentPlanId === plan.id && 'border-primary bg-primary/5'
          )}
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground px-3 py-1">
                <Star className="mr-1 h-3 w-3" />
                Mais Popular
              </Badge>
            </div>
          )}
          
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <CardDescription>
              <span className="text-3xl font-bold text-foreground">
                {formatPrice(plan.price, plan.currency)}
              </span>
              <span className="text-muted-foreground">
                {getIntervalText(plan.interval)}
              </span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Recursos inclusos:</div>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 text-green-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Veículos:</span>
                <div className="font-semibold">
                  {plan.vehicleLimit === -1 ? 'Ilimitado' : plan.vehicleLimit}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Alertas:</span>
                <div className="font-semibold">
                  {plan.alertsLimit === -1 ? 'Ilimitados' : plan.alertsLimit}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Relatórios:</span>
                <div className="font-semibold">
                  {plan.reportsAccess ? 'Sim' : 'Não'}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">API:</span>
                <div className="font-semibold">
                  {plan.apiAccess ? 'Sim' : 'Não'}
                </div>
              </div>
            </div>

            <div className="text-sm">
              <span className="text-muted-foreground">Suporte:</span>
              <div className="font-semibold">{getSupportLevelText(plan.supportLevel)}</div>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              className="w-full"
              variant={currentPlanId === plan.id ? 'outline' : 'default'}
              disabled={loading || currentPlanId === plan.id}
              onClick={() => onSelectPlan(plan)}
            >
              {loading && 'Carregando...'}
              {!loading && currentPlanId === plan.id && 'Plano Atual'}
              {!loading && currentPlanId !== plan.id && 'Selecionar Plano'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}