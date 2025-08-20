'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, FileText, BarChart3, Clock, AlertCircle, Shield, Car, Phone, Wrench, Truck, Key } from 'lucide-react';

// Import auth components
import PermissionGuard, { usePermissions } from '@/components/auth/PermissionGuard';

// Import financial components
import PlanSelector from '@/components/financial/PlanSelector';
import PaymentMethods from '@/components/financial/PaymentMethods';
import PIXPayment from '@/components/financial/PIXPayment';
import TransactionHistory from '@/components/financial/TransactionHistory';
import BillingDashboard from '@/components/financial/BillingDashboard';
import InvoiceViewer from '@/components/financial/InvoiceViewer';
import AdminFinancialDashboard from '@/components/financial/AdminFinancialDashboard';

// Import types
import type { SubscriptionPlan as Plan, Transaction, Invoice, BillingMetrics, PaymentStats, PIXPayment as PIXPaymentType } from '@/types/financial';

// Mock data for demonstration
const mockPlans: Plan[] = [
  {
    id: 'basic',
    name: 'Uber Básico',
    price: 24.90,
    currency: 'BRL',
    interval: 'monthly',
    features: [
      'Rastreamento em tempo real',
      'SOS e botão de pânico',
      'Histórico de 30 dias',
      'Guincho 24h incluso',
      'Chaveiro automotivo',
      'Suporte WhatsApp'
    ],
    popular: false,
    vehicleLimit: 1,
    alertsLimit: 50,
    reportsAccess: true,
    apiAccess: false,
    supportLevel: 'basic'
  },
  {
    id: 'premium',
    name: 'Uber Pro',
    price: 44.90,
    currency: 'BRL',
    interval: 'monthly',
    features: [
      'Rastreamento avançado',
      'SOS + Assistência médica',
      'Histórico ilimitado',
      'Guincho + Borracheiro',
      'Análises avançadas',
      'Controle de combustível',
      'Suporte telefônico'
    ],
    popular: true,
    vehicleLimit: 2,
    alertsLimit: 200,
    reportsAccess: true,
    apiAccess: true,
    supportLevel: 'priority'
  },
  {
    id: 'enterprise',
    name: 'Uber Business',
    price: 79.90,
    currency: 'BRL',
    interval: 'monthly',
    features: [
      'Múltiplos veículos',
      'Assistência 24h completa',
      'Histórico ilimitado',
      'Carro reserva emergencial',
      'Análises avançadas completas',
      'API completa',
      'Suporte dedicado VIP',
      'Hospedagem de emergência'
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
    amount: 44.90,
    currency: 'BRL',
    status: 'completed',
    method: 'pix',
    description: 'Assinatura Uber Pro - Dezembro 2024',
    planName: 'Uber Pro',
    createdAt: '2024-12-01T10:00:00Z',
    completedAt: '2024-12-01T10:05:00Z',
    reference: 'PIX123456'
  },
  {
    id: 'tx_002',
    amount: 44.90,
    currency: 'BRL',
    status: 'completed',
    method: 'card',
    description: 'Assinatura Uber Pro - Novembro 2024',
    planName: 'Uber Pro',
    createdAt: '2024-11-01T10:00:00Z',
    completedAt: '2024-11-01T10:02:00Z',
    reference: 'CARD789012'
  },
  {
    id: 'tx_003',
    amount: 44.90,
    currency: 'BRL',
    status: 'pending',
    method: 'boleto',
    description: 'Assinatura Uber Pro - Janeiro 2025',
    planName: 'Uber Pro',
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
    amount: 44.90,
    currency: 'BRL',
    issuedAt: '2024-12-01T00:00:00Z',
    dueAt: '2024-12-10T23:59:59Z',
    paidAt: '2024-12-01T10:05:00Z',
    planName: 'Uber Pro',
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
        description: 'Assinatura Uber Pro - Dezembro 2024',
        quantity: 1,
        unitPrice: 44.90,
        totalPrice: 44.90
      }
    ]
  },
  {
    id: 'inv_002',
    number: 'INV-2024-002',
    planId: 'premium',
    status: 'sent',
    amount: 44.90,
    currency: 'BRL',
    issuedAt: '2024-12-20T00:00:00Z',
    dueAt: '2025-01-10T23:59:59Z',
    planName: 'Uber Pro',
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
        description: 'Assinatura Uber Pro - Janeiro 2025',
        quantity: 1,
        unitPrice: 44.90,
        totalPrice: 44.90
      }
    ]
  }
];

const mockMetrics: BillingMetrics = {
  totalRevenue: 4990.00,
  monthlyRevenue: 449.00,
  activeSubscriptions: 95,
  averageRevenuePerUser: 47.26,
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
  { month: 'Jul', revenue: 3200, subscribers: 70 },
  { month: 'Ago', revenue: 3500, subscribers: 75 },
  { month: 'Set', revenue: 3800, subscribers: 80 },
  { month: 'Out', revenue: 4200, subscribers: 87 },
  { month: 'Nov', revenue: 4600, subscribers: 92 },
  { month: 'Dez', revenue: 4990, subscribers: 95 }
];

export default function FinanceiroPage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [pixPayment, setPixPayment] = useState<PIXPaymentType | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('plans');
  const { isAdmin } = usePermissions();

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
          pixKey: 'chave-pix-demo@usuario.com',
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

  // Se for admin, mostra dashboard administrativo
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        <div className="container mx-auto py-6 space-y-6">
          {/* Admin Header */}
          <div className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 rounded-xl p-8 text-white overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <BarChart3 className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Dashboard Financeiro Administrativo</h1>
                  <p className="text-purple-100 text-lg">
                    Visão geral das métricas financeiras e de assinaturas
                  </p>
                </div>
              </div>
            </div>
          </div>

          <PermissionGuard requiredRole="admin">
            <AdminFinancialDashboard />
          </PermissionGuard>
        </div>
      </div>
    );
  }

  // Interface padrão para usuários não-admin
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto py-6 space-y-6">
        {/* Professional Header with gradient */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 rounded-xl p-8 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Shield className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Planos Uber & Carros Antigos</h1>
                <p className="text-blue-100 text-lg">
                  Proteção completa e assistência 24h - 25% mais barato que seguros tradicionais
                </p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">15.000+</div>
                <div className="text-sm text-blue-100">Clientes ativos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">⭐ 4.9</div>
                <div className="text-sm text-blue-100">Avaliação média</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-blue-100">Assistência</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">25%</div>
                <div className="text-sm text-blue-100">Mais barato</div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Services Highlight */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-lg p-3 text-center hover:shadow-lg transition-all hover:scale-105">
            <Truck className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <div className="text-xs font-semibold text-gray-800">Guincho</div>
            <div className="text-xs text-gray-600 mb-1">Reboque 24 horas</div>
            <div className="text-xs text-blue-600">⏱️ 30-45 min</div>
            <div className="text-xs text-green-600">✅ Disponível</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-lg p-3 text-center hover:shadow-lg transition-all hover:scale-105">
            <Wrench className="h-6 w-6 text-orange-600 mx-auto mb-1" />
            <div className="text-xs font-semibold text-gray-800">Mecânico</div>
            <div className="text-xs text-gray-600 mb-1">Reparo no local</div>
            <div className="text-xs text-blue-600">⏱️ 45-60 min</div>
            <div className="text-xs text-green-600">✅ Disponível</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-lg p-3 text-center hover:shadow-lg transition-all hover:scale-105">
            <div className="h-6 w-6 mx-auto mb-1 flex items-center justify-center">
              <span className="text-lg">🔋</span>
            </div>
            <div className="text-xs font-semibold text-gray-800">Bateria</div>
            <div className="text-xs text-gray-600 mb-1">Carga/troca de bateria</div>
            <div className="text-xs text-blue-600">⏱️ 20-30 min</div>
            <div className="text-xs text-green-600">✅ Disponível</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-lg p-3 text-center hover:shadow-lg transition-all hover:scale-105">
            <div className="h-6 w-6 mx-auto mb-1 flex items-center justify-center">
              <span className="text-lg">⚫</span>
            </div>
            <div className="text-xs font-semibold text-gray-800">Pneu</div>
            <div className="text-xs text-gray-600 mb-1">Troca de pneu</div>
            <div className="text-xs text-blue-600">⏱️ 15-25 min</div>
            <div className="text-xs text-green-600">✅ Disponível</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-lg p-3 text-center hover:shadow-lg transition-all hover:scale-105">
            <Key className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <div className="text-xs font-semibold text-gray-800">Chaveiro</div>
            <div className="text-xs text-gray-600 mb-1">Abertura veicular</div>
            <div className="text-xs text-blue-600">⏱️ 25-35 min</div>
            <div className="text-xs text-green-600">✅ Disponível</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-lg p-3 text-center hover:shadow-lg transition-all hover:scale-105">
            <div className="h-6 w-6 mx-auto mb-1 flex items-center justify-center">
              <span className="text-lg">⛽</span>
            </div>
            <div className="text-xs font-semibold text-gray-800">Combustível</div>
            <div className="text-xs text-gray-600 mb-1">Entrega de combustível</div>
            <div className="text-xs text-blue-600">⏱️ 20-40 min</div>
            <div className="text-xs text-green-600">✅ Disponível</div>
          </div>
        </div>

        {/* Alert for demo */}
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Este é um ambiente de demonstração. Os pagamentos são simulados e não geram cobranças reais.
          </AlertDescription>
        </Alert>

        {/* Main Tabs with enhanced styling */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl p-1">
            <TabsTrigger value="plans" className="rounded-lg transition-all data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Shield className="h-4 w-4 mr-2" />
              Planos
            </TabsTrigger>
            <TabsTrigger value="payment" disabled={!selectedPlan} className="rounded-lg transition-all data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <CreditCard className="h-4 w-4 mr-2" />
              Pagamento
            </TabsTrigger>
            <TabsTrigger value="transactions" className="rounded-lg transition-all data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Clock className="h-4 w-4 mr-2" />
              Transações
            </TabsTrigger>
            <TabsTrigger value="invoices" className="rounded-lg transition-all data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Faturas
            </TabsTrigger>
          </TabsList>

          {/* Plans Tab */}
          <TabsContent value="plans" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <span>Escolha seu Plano de Proteção</span>
                </CardTitle>
                <CardDescription>
                  Proteção completa para motoristas Uber e carros sem seguro - preços 25% menores que a concorrência
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
                <Card className="bg-white/60 backdrop-blur-sm border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle>Plano Selecionado</CardTitle>
                    <CardDescription>{selectedPlan.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
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
                  if (status === 'paid') {
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

        </Tabs>
      </div>
    </div>
  );
}