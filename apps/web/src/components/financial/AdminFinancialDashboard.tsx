'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  AlertTriangle,
  Calendar,
  Download,
  Eye,
  UserCheck,
  Target,
  BarChart3,
  PieChart
} from 'lucide-react';

interface AdminMetrics {
  revenue: {
    total: number;
    monthly: number;
    growth: number;
    target: number;
  };
  subscribers: {
    total: number;
    active: number;
    new: number;
    churn: number;
  };
  payments: {
    successful: number;
    pending: number;
    failed: number;
    successRate: number;
  };
  arpu: number; // Average Revenue Per User
  ltv: number; // Lifetime Value
}

interface AdminFinancialDashboardProps {
  metrics: AdminMetrics;
  revenueData: Array<{
    month: string;
    revenue: number;
    subscribers: number;
    churn: number;
  }>;
  planDistribution: Array<{
    plan: string;
    subscribers: number;
    revenue: number;
  }>;
  loading?: boolean;
}

// Mock data para demonstração
const mockAdminMetrics: AdminMetrics = {
  revenue: {
    total: 127450.00,
    monthly: 18920.00,
    growth: 15.5,
    target: 150000.00
  },
  subscribers: {
    total: 1547,
    active: 1432,
    new: 87,
    churn: 3.2
  },
  payments: {
    successful: 1389,
    pending: 23,
    failed: 35,
    successRate: 97.5
  },
  arpu: 52.30,
  ltv: 890.00
};

const mockRevenueData = [
  { month: 'Jul', revenue: 12500, subscribers: 1205, churn: 2.8 },
  { month: 'Ago', revenue: 14200, subscribers: 1298, churn: 3.1 },
  { month: 'Set', revenue: 15800, subscribers: 1367, churn: 2.9 },
  { month: 'Out', revenue: 16900, subscribers: 1421, churn: 3.5 },
  { month: 'Nov', revenue: 17650, subscribers: 1489, churn: 2.7 },
  { month: 'Dez', revenue: 18920, subscribers: 1547, churn: 3.2 }
];

const mockPlanDistribution = [
  { plan: 'Uber Básico', subscribers: 672, revenue: 16732.80 },
  { plan: 'Uber Pro', subscribers: 758, revenue: 34034.20 },
  { plan: 'Uber Business', subscribers: 117, revenue: 9348.30 }
];

export default function AdminFinancialDashboard({ 
  metrics = mockAdminMetrics,
  revenueData = mockRevenueData, 
  planDistribution = mockPlanDistribution,
  loading = false 
}: AdminFinancialDashboardProps) {
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h2>
          <p className="text-gray-600">Visão geral das métricas financeiras e assinaturas</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Período
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Receita Total */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Receita Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {formatCurrency(metrics.revenue.total)}
            </div>
            <div className="flex items-center text-xs text-green-700">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{formatPercent(metrics.revenue.growth)} vs mês anterior
            </div>
            <div className="text-xs text-green-600 mt-1">
              Meta: {formatCurrency(metrics.revenue.target)}
            </div>
          </CardContent>
        </Card>

        {/* Receita Mensal */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Receita Mensal
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {formatCurrency(metrics.revenue.monthly)}
            </div>
            <div className="text-xs text-blue-600">
              Dezembro 2024
            </div>
            <div className="text-xs text-blue-700 mt-1">
              ARPU: {formatCurrency(metrics.arpu)}
            </div>
          </CardContent>
        </Card>

        {/* Total de Assinantes */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              Assinantes Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {metrics.subscribers.active.toLocaleString()}
            </div>
            <div className="text-xs text-purple-600">
              de {metrics.subscribers.total.toLocaleString()} total
            </div>
            <div className="flex items-center text-xs text-purple-700 mt-1">
              <UserCheck className="h-3 w-3 mr-1" />
              +{metrics.subscribers.new} novos este mês
            </div>
          </CardContent>
        </Card>

        {/* Taxa de Churn */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">
              Taxa de Churn
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {formatPercent(metrics.subscribers.churn)}
            </div>
            <div className="text-xs text-orange-600">
              LTV: {formatCurrency(metrics.ltv)}
            </div>
            <div className="text-xs text-orange-700 mt-1">
              Meta: &lt;5%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de Pagamento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos Bem-sucedidos</CardTitle>
            <CreditCard className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metrics.payments.successful}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercent(metrics.payments.successRate)} taxa de sucesso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Eye className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {metrics.payments.pending}
            </div>
            <p className="text-xs text-muted-foreground">
              Aguardando confirmação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Falharam</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {metrics.payments.failed}
            </div>
            <p className="text-xs text-muted-foreground">
              Necessitam atenção
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meta Mensal</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatPercent((metrics.revenue.monthly / metrics.revenue.target) * 100)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(metrics.revenue.target)} meta
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos e Tabelas */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">
            <BarChart3 className="h-4 w-4 mr-2" />
            Receita
          </TabsTrigger>
          <TabsTrigger value="plans">
            <PieChart className="h-4 w-4 mr-2" />
            Planos
          </TabsTrigger>
          <TabsTrigger value="subscribers">
            <Users className="h-4 w-4 mr-2" />
            Assinantes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evolução da Receita</CardTitle>
              <CardDescription>
                Receita mensal e crescimento de assinantes nos últimos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueData.map((data, index) => (
                  <div key={data.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="font-medium">{data.month}</div>
                      <div className="text-sm text-gray-600">
                        {data.subscribers} assinantes
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="font-bold text-green-600">
                        {formatCurrency(data.revenue)}
                      </div>
                      <div className="text-sm text-red-600">
                        Churn: {formatPercent(data.churn)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Planos</CardTitle>
              <CardDescription>
                Número de assinantes e receita por plano
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {planDistribution.map((plan, index) => {
                  const percentage = (plan.subscribers / metrics.subscribers.total) * 100;
                  return (
                    <div key={plan.plan} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{plan.plan}</span>
                        <span className="text-sm text-gray-600">
                          {plan.subscribers} assinantes ({formatPercent(percentage)})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="ml-4 font-semibold text-green-600">
                          {formatCurrency(plan.revenue)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscribers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Assinantes</CardTitle>
              <CardDescription>
                Análise detalhada do comportamento de assinantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {metrics.subscribers.total}
                  </div>
                  <div className="text-sm text-blue-800">Total de Usuários</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {metrics.subscribers.active}
                  </div>
                  <div className="text-sm text-green-800">Ativos</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {metrics.subscribers.new}
                  </div>
                  <div className="text-sm text-purple-800">Novos (mês)</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {formatPercent(metrics.subscribers.churn)}
                  </div>
                  <div className="text-sm text-orange-800">Taxa de Churn</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}