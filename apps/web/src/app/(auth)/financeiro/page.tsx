'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, FileText, BarChart3, Clock, AlertCircle } from 'lucide-react';

// Import financial components
import PlanSelector from '@/components/financial/PlanSelector';
import PaymentMethods from '@/components/financial/PaymentMethods';
import PIXPayment from '@/components/financial/PIXPayment';
import TransactionHistory from '@/components/financial/TransactionHistory';
import BillingDashboard from '@/components/financial/BillingDashboard';
import InvoiceViewer from '@/components/financial/InvoiceViewer';

// Import types
import type { SubscriptionPlan as Plan, Transaction, Invoice, BillingMetrics, PaymentStats, PIXPayment as PIXPaymentType } from '@/types/financial';

// Mock data for demonstration
const mockPlans: Plan[] = [
  {
    id: 'basic',
    name: 'Básico',
    price: 29.90,
    currency: 'BRL',
    interval: 'monthly',
    features: [
      'Até 5 veículos',
      'Rastreamento em tempo real',
      'Histórico de 30 dias',
      'Alertas básicos',
      'Suporte por email'
    ],
    popular: false,
    vehicleLimit: 5,
    alertsLimit: 50,
    reportsAccess: true,
    apiAccess: false,
    supportLevel: 'basic'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 59.90,
    currency: 'BRL',
    interval: 'monthly',
    features: [
      'Até 15 veículos',
      'Rastreamento em tempo real',
      'Histórico ilimitado',
      'Alertas avançados',
      'Relatórios personalizados',
      'API de integração',
      'Suporte prioritário'
    ],
    popular: true,
    vehicleLimit: 15,
    alertsLimit: 200,
    reportsAccess: true,
    apiAccess: true,
    supportLevel: 'priority'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 149.90,
    currency: 'BRL',
    interval: 'monthly',
    features: [
      'Veículos ilimitados',
      'Rastreamento em tempo real',
      'Histórico ilimitado',
      'Todos os alertas',
      'Relatórios avançados',
      'API completa',
      'Suporte dedicado 24/7',
      'Personalização completa'
    ],
    popular: false,
    vehicleLimit: 99999,
    alertsLimit: 10000,
    reportsAccess: true,
    apiAccess: true,
    supportLevel: 'dedicated'
  }
];

const mockTransactions: Transaction[] = [
  {
    id: 'tx_001',
    amount: 59.90,
    currency: 'BRL',
    status: 'completed',
    method: 'pix',
    description: 'Assinatura Premium - Dezembro 2024',
    planName: 'Premium',
    createdAt: '2024-12-01T10:00:00Z',
    completedAt: '2024-12-01T10:05:00Z',
    reference: 'PIX123456'
  },
  {
    id: 'tx_002',
    amount: 59.90,
    currency: 'BRL',
    status: 'completed',
    method: 'card',
    description: 'Assinatura Premium - Novembro 2024',
    planName: 'Premium',
    createdAt: '2024-11-01T10:00:00Z',
    completedAt: '2024-11-01T10:02:00Z',
    reference: 'CARD789012'
  },
  {
    id: 'tx_003',
    amount: 59.90,
    currency: 'BRL',
    status: 'pending',
    method: 'boleto',
    description: 'Assinatura Premium - Janeiro 2025',
    planName: 'Premium',
    createdAt: '2024-12-20T10:00:00Z',
    reference: 'BOL345678'
  }
];

const mockInvoices: Invoice[] = [
  {
    id: 'inv_001',
    number: 'INV-2024-001',
    planId: 'premium',
    status: 'paid',
    amount: 59.90,
    currency: 'BRL',
    issuedAt: '2024-12-01T00:00:00Z',
    dueAt: '2024-12-10T23:59:59Z',
    paidAt: '2024-12-01T10:05:00Z',
    planName: 'Premium',
    period: {
      start: '2024-12-01T00:00:00Z',
      end: '2024-12-31T23:59:59Z'
    },
    customer: {
      name: 'João Silva',
      email: 'joao@example.com',
      document: '123.456.789-00',
      address: 'Rua Example, 123 - São Paulo, SP'
    },
    items: [
      {
        id: 'item_001',
        description: 'Assinatura Premium - Dezembro 2024',
        quantity: 1,
        unitPrice: 59.90,
        totalPrice: 59.90
      }
    ]
  },
  {
    id: 'inv_002',
    number: 'INV-2024-002',
    planId: 'premium',
    status: 'sent',
    amount: 59.90,
    currency: 'BRL',
    issuedAt: '2024-12-20T00:00:00Z',
    dueAt: '2025-01-10T23:59:59Z',
    planName: 'Premium',
    period: {
      start: '2025-01-01T00:00:00Z',
      end: '2025-01-31T23:59:59Z'
    },
    customer: {
      name: 'João Silva',
      email: 'joao@example.com',
      document: '123.456.789-00',
      address: 'Rua Example, 123 - São Paulo, SP'
    },
    items: [
      {
        id: 'item_002',
        description: 'Assinatura Premium - Janeiro 2025',
        quantity: 1,
        unitPrice: 59.90,
        totalPrice: 59.90
      }
    ]
  }
];

const mockMetrics: BillingMetrics = {
  totalRevenue: 5990.00,
  monthlyRevenue: 599.00,
  activeSubscriptions: 95,
  averageRevenuePerUser: 63.05,
  churnRate: 2.5,
  pendingPayments: 3,
  revenueGrowth: 15.5
};

const mockPaymentStats: PaymentStats = {
  total: 120,
  successful: 108,
  pending: 5,
  failed: 7,
  successRate: 90.0
};

const mockRevenueData = [
  { month: 'Jul', revenue: 4200, subscribers: 70 },
  { month: 'Ago', revenue: 4500, subscribers: 75 },
  { month: 'Set', revenue: 4800, subscribers: 80 },
  { month: 'Out', revenue: 5200, subscribers: 87 },
  { month: 'Nov', revenue: 5600, subscribers: 92 },
  { month: 'Dez', revenue: 5990, subscribers: 95 }
];

export default function FinanceiroPage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [pixPayment, setPixPayment] = useState<PIXPaymentType | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('plans');

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setActiveTab('payment');
  };

  const handlePaymentMethodSelect = async (method: string) => {
    if (method === 'pix' && selectedPlan) {
      setLoading(true);
      // Simulate PIX payment creation
      setTimeout(() => {
        setPixPayment({
          id: 'pix_' + Date.now(),
          amount: selectedPlan.price,
          status: 'pending',
          qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          pixKey: 'chave-pix-demo@empresa.com',
          expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        });
        setLoading(false);
        setActiveTab('payment-pix');
      }, 1500);
    }
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log('Downloading invoice:', invoiceId);
    // Implement download logic
  };

  const handleExportTransactions = () => {
    console.log('Exporting transactions...');
    // Implement export logic
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Sistema Financeiro</h1>
        <p className="text-muted-foreground">
          Gerencie seus planos, pagamentos e faturas
        </p>
      </div>

      {/* Alert for demo */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Este é um ambiente de demonstração. Os pagamentos são simulados e não geram cobranças reais.
        </AlertDescription>
      </Alert>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="plans">Planos</TabsTrigger>
          <TabsTrigger value="payment" disabled={!selectedPlan}>
            Pagamento
          </TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="invoices">Faturas</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Escolha seu Plano</CardTitle>
              <CardDescription>
                Selecione o plano ideal para sua frota
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlanSelector
                plans={mockPlans}
                currentPlanId="premium"
                onSelectPlan={handlePlanSelect}
                loading={loading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment" className="space-y-6">
          {selectedPlan && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Plano Selecionado</CardTitle>
                  <CardDescription>{selectedPlan.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {selectedPlan.price.toFixed(2)}/mês
                  </div>
                </CardContent>
              </Card>

              <PaymentMethods
                selectedPlan={selectedPlan}
                onPaymentMethodSelect={handlePaymentMethodSelect}
              />
            </>
          )}
        </TabsContent>

        {/* PIX Payment Tab (hidden from main tabs) */}
        {activeTab === 'payment-pix' && pixPayment && (
          <TabsContent value="payment-pix" className="space-y-6">
            <PIXPayment
              pixPayment={pixPayment}
              onRefresh={() => console.log('Refreshing PIX status...')}
              onStatusUpdate={(status) => {
                setPixPayment({ ...pixPayment, status });
                if (status === 'completed') {
                  setTimeout(() => {
                    setActiveTab('transactions');
                    setPixPayment(null);
                    setSelectedPlan(null);
                  }, 2000);
                }
              }}
            />
          </TabsContent>
        )}

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <TransactionHistory
            transactions={mockTransactions}
            loading={loading}
            onTransactionClick={(transaction) => console.log('Transaction clicked:', transaction)}
            onExport={handleExportTransactions}
          />
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <InvoiceViewer
            invoices={mockInvoices}
            loading={loading}
            onDownloadInvoice={handleDownloadInvoice}
          />
        </TabsContent>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <BillingDashboard
            metrics={mockMetrics}
            paymentStats={mockPaymentStats}
            revenueData={mockRevenueData}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}