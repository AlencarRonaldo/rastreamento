'use client';

import React, { useState } from 'react';
import { CreditCard, QrCode, FileText, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PaymentMethod, SubscriptionPlan } from '@/types/financial';
import { cn } from '@/lib/utils';

interface PaymentMethodsProps {
  selectedPlan: SubscriptionPlan;
  onPaymentMethodSelect: (method: PaymentMethod['type']) => void;
  loading?: boolean;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'pix',
    type: 'pix',
    name: 'PIX',
    icon: 'QrCode',
    processingTime: 'Aprovação instantânea',
    fees: 0,
  },
  {
    id: 'card',
    type: 'card',
    name: 'Cartão de Crédito',
    icon: 'CreditCard',
    processingTime: '1-2 dias úteis',
    fees: 3.99,
  },
  {
    id: 'boleto',
    type: 'boleto',
    name: 'Boleto Bancário',
    icon: 'FileText',
    processingTime: '1-3 dias úteis',
    fees: 2.50,
  },
];

const IconComponent = {
  QrCode: QrCode,
  CreditCard: CreditCard,
  FileText: FileText,
};

export default function PaymentMethods({ selectedPlan, onPaymentMethodSelect, loading = false }: PaymentMethodsProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod['type'] | null>(null);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(price);
  };

  const calculateTotalWithFees = (basePrice: number, fees: number) => {
    return basePrice + fees;
  };

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method.type);
    onPaymentMethodSelect(method.type);
  };

  return (
    <div className="space-y-6">
      {/* Selected Plan Summary */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Plano Selecionado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold">{selectedPlan.name}</span>
            <Badge variant="secondary">{selectedPlan.interval === 'monthly' ? 'Mensal' : 'Anual'}</Badge>
          </div>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Valor base</span>
            <span>{formatPrice(selectedPlan.price, selectedPlan.currency)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Escolha a forma de pagamento</h3>
        
        <div className="grid gap-4">
          {paymentMethods.map((method) => {
            const Icon = IconComponent[method.icon as keyof typeof IconComponent];
            const isSelected = selectedMethod === method.type;
            const totalPrice = calculateTotalWithFees(selectedPlan.price, method.fees || 0);
            
            return (
              <Card 
                key={method.id}
                className={cn(
                  'cursor-pointer transition-all duration-200 hover:shadow-md',
                  isSelected && 'ring-2 ring-primary border-primary bg-primary/5'
                )}
                onClick={() => handleMethodSelect(method)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'p-2 rounded-lg',
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      
                      <div>
                        <div className="font-semibold">{method.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {method.processingTime}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatPrice(totalPrice, selectedPlan.currency)}
                      </div>
                      {method.fees && method.fees > 0 ? (
                        <div className="text-sm text-muted-foreground">
                          + {formatPrice(method.fees, selectedPlan.currency)} taxa
                        </div>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Sem taxa
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Payment Summary */}
      {selectedMethod && (
        <Card className="border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Resumo do Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Plano {selectedPlan.name}</span>
              <span>{formatPrice(selectedPlan.price, selectedPlan.currency)}</span>
            </div>
            
            {paymentMethods.find(m => m.type === selectedMethod)?.fees && 
             paymentMethods.find(m => m.type === selectedMethod)!.fees! > 0 && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Taxa de processamento</span>
                <span>+ {formatPrice(paymentMethods.find(m => m.type === selectedMethod)!.fees!, selectedPlan.currency)}</span>
              </div>
            )}
            
            <hr className="border-dashed" />
            
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>
                {formatPrice(
                  calculateTotalWithFees(
                    selectedPlan.price,
                    paymentMethods.find(m => m.type === selectedMethod)?.fees || 0
                  ),
                  selectedPlan.currency
                )}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}