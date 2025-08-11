'use client';

import React, { useState } from 'react';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  AlertCircle,
  Activity,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { BillingMetrics, PaymentStats } from '@/types/financial';
import { cn } from '@/lib/utils';

interface BillingDashboardProps {
  metrics: BillingMetrics;
  paymentStats: PaymentStats;
  revenueData: any[];
  loading?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function BillingDashboard({ 
  metrics, 
  paymentStats, 
  revenueData, 
  loading = false 
}: BillingDashboardProps) {
  const [period, setPeriod] = useState<string>('30d');

  const formatPrice = (price: number, compact = false) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: compact ? 'compact' : 'standard',
      maximumFractionDigits: compact ? 1 : 2,
    }).format(price);
  };

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
  };

  // Sample chart data - in real app, this would come from props
  const chartData = revenueData.length > 0 ? revenueData : [
    { month: 'Jan', revenue: 12000, subscribers: 45 },
    { month: 'Fev', revenue: 15000, subscribers: 52 },
    { month: 'Mar', revenue: 18000, subscribers: 68 },
    { month: 'Abr', revenue: 22000, subscribers: 75 },
    { month: 'Mai', revenue: 25000, subscribers: 89 },
    { month: 'Jun', revenue: 28000, subscribers: 95 },
  ];

  const paymentMethodData = [
    { name: 'PIX', value: paymentStats.successful * 0.6, color: '#8884D8' },
    { name: 'Cartão', value: paymentStats.successful * 0.3, color: '#00C49F' },
    { name: 'Boleto', value: paymentStats.successful * 0.1, color: '#FFBB28' },
  ];

  const subscriptionPlansData = [
    { name: 'Básico', subscribers: 35, revenue: 8750, color: '#0088FE' },
    { name: 'Premium', subscribers: 45, revenue: 22500, color: '#00C49F' },
    { name: 'Enterprise', subscribers: 15, revenue: 15000, color: '#FFBB28' },
  ];

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Carregando dashboard...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    trend = 'neutral',
    format = 'currency' 
  }: {
    title: string;
    value: number;
    change?: number;
    icon: any;
    trend?: 'up' | 'down' | 'neutral';
    format?: 'currency' | 'number' | 'percent';
  }) => {
    const formatValue = () => {
      switch (format) {
        case 'currency':
          return formatPrice(value, true);
        case 'percent':
          return formatPercent(value);
        default:
          return value.toLocaleString('pt-BR');
      }
    };

    const getTrendColor = () => {
      switch (trend) {
        case 'up':
          return 'text-green-600';
        case 'down':
          return 'text-red-600';
        default:
          return 'text-muted-foreground';
      }
    };

    const getTrendIcon = () => {
      switch (trend) {
        case 'up':
          return <TrendingUp className="w-4 h-4" />;
        case 'down':
          return <TrendingDown className="w-4 h-4" />;
        default:
          return null;
      }
    };

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatValue()}</div>
          {change !== undefined && (
            <div className={cn('flex items-center text-xs', getTrendColor())}>
              {getTrendIcon()}
              <span className="ml-1">
                {change > 0 ? '+' : ''}{formatPercent(change)} em relação ao período anterior
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Financeiro</h2>
          <p className="text-muted-foreground">
            Visão geral das métricas financeiras e de assinaturas
          </p>
        </div>
        
        <select 
          value={period} 
          onChange={(e) => setPeriod(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="7d">Últimos 7 dias</option>
          <option value="30d">Últimos 30 dias</option>
          <option value="90d">Últimos 90 dias</option>
          <option value="1y">Último ano</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Receita Total"
          value={metrics.totalRevenue}
          change={metrics.revenueGrowth}
          icon={DollarSign}
          trend={metrics.revenueGrowth > 0 ? 'up' : metrics.revenueGrowth < 0 ? 'down' : 'neutral'}
        />
        
        <StatCard
          title="Receita Mensal"
          value={metrics.monthlyRevenue}
          icon={Calendar}
        />
        
        <StatCard
          title="Assinaturas Ativas"
          value={metrics.activeSubscriptions}
          icon={Users}
          format="number"
        />
        
        <StatCard
          title="Taxa de Sucesso"
          value={paymentStats.successRate}
          icon={Activity}
          format="percent"
          trend={paymentStats.successRate > 95 ? 'up' : paymentStats.successRate < 85 ? 'down' : 'neutral'}
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Receita Média por Usuário"
          value={metrics.averageRevenuePerUser}
          icon={TrendingUp}
        />
        
        <StatCard
          title="Taxa de Churn"
          value={metrics.churnRate}
          icon={TrendingDown}
          format="percent"
          trend={metrics.churnRate < 5 ? 'up' : metrics.churnRate > 10 ? 'down' : 'neutral'}
        />
        
        <StatCard
          title="Pagamentos Pendentes"
          value={metrics.pendingPayments}
          icon={AlertCircle}
          format="number"
          trend={metrics.pendingPayments > 10 ? 'down' : 'neutral'}
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Receita</TabsTrigger>
          <TabsTrigger value="payments">Pagamentos</TabsTrigger>
          <TabsTrigger value="plans">Planos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Evolução da Receita</CardTitle>
                <CardDescription>Receita ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => formatPrice(value, true)} />
                    <Tooltip 
                      formatter={(value: number) => [formatPrice(value), 'Receita']}
                      labelFormatter={(label) => `Mês: ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#8884d8" 
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Subscribers Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Crescimento de Assinaturas</CardTitle>
                <CardDescription>Número de assinantes ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [value, 'Assinantes']}
                      labelFormatter={(label) => `Mês: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="subscribers" 
                      stroke="#00C49F" 
                      strokeWidth={2}
                      dot={{ fill: '#00C49F' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Payment Methods Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pagamento</CardTitle>
                <CardDescription>Distribuição por método de pagamento</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [value.toLocaleString('pt-BR'), 'Transações']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Payment Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status dos Pagamentos</CardTitle>
                <CardDescription>Distribuição por status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Bem-sucedidos</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{paymentStats.successful}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatPercent(paymentStats.successRate)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium">Pendentes</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{paymentStats.pending}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatPercent((paymentStats.pending / paymentStats.total) * 100)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium">Falharam</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{paymentStats.failed}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatPercent(((paymentStats.total - paymentStats.successful - paymentStats.pending) / paymentStats.total) * 100)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          {/* Subscription Plans Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performance dos Planos</CardTitle>
              <CardDescription>Assinantes e receita por plano</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subscriptionPlansData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => formatPrice(value, true)} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name === 'subscribers' ? value : formatPrice(value),
                      name === 'subscribers' ? 'Assinantes' : 'Receita'
                    ]}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="subscribers" fill="#8884d8" name="Assinantes" />
                  <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Receita" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}