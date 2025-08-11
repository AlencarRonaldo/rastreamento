import {
  SubscriptionPlan,
  Transaction,
  Invoice,
  PIXPayment,
  BillingMetrics,
  PaymentStats,
  CustomerData,
  Subscription,
  WebhookEvent
} from '../types/financial';

export class FinancialService {
  // Sample data - in production, this would connect to a database
  private plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Básico',
      price: 29.90,
      currency: 'BRL',
      interval: 'monthly',
      features: [
        'Até 5 veículos',
        'Rastreamento em tempo real',
        'Alertas básicos',
        'Histórico de 30 dias',
        'Suporte por email'
      ],
      vehicleLimit: 5,
      alertsLimit: 50,
      reportsAccess: false,
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
        'Rastreamento avançado',
        'Alertas ilimitados',
        'Relatórios detalhados',
        'Histórico de 1 ano',
        'Suporte prioritário',
        'Acesso à API'
      ],
      popular: true,
      vehicleLimit: 15,
      alertsLimit: -1,
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
        'Recursos avançados',
        'Alertas personalizados',
        'Relatórios customizados',
        'Histórico completo',
        'Suporte dedicado',
        'API completa',
        'Integração personalizada'
      ],
      vehicleLimit: -1,
      alertsLimit: -1,
      reportsAccess: true,
      apiAccess: true,
      supportLevel: 'dedicated'
    }
  ];

  private transactions: Transaction[] = [
    {
      id: 'txn_1',
      amount: 59.90,
      currency: 'BRL',
      status: 'completed',
      method: 'pix',
      description: 'Assinatura Premium - Janeiro 2024',
      createdAt: '2024-01-15T10:30:00Z',
      completedAt: '2024-01-15T10:31:00Z',
      planId: 'premium',
      planName: 'Premium',
      reference: 'REF001'
    },
    {
      id: 'txn_2',
      amount: 59.90,
      currency: 'BRL',
      status: 'pending',
      method: 'card',
      description: 'Assinatura Premium - Fevereiro 2024',
      createdAt: '2024-02-15T10:30:00Z',
      planId: 'premium',
      planName: 'Premium',
      reference: 'REF002'
    }
  ];

  private pixPayments: Map<string, PIXPayment> = new Map();

  // Plans
  async getPlans(): Promise<SubscriptionPlan[]> {
    return this.plans;
  }

  async getPlan(planId: string): Promise<SubscriptionPlan | null> {
    return this.plans.find(p => p.id === planId) || null;
  }

  // Transactions
  async getTransactions(params?: {
    page?: number;
    limit?: number;
    status?: string;
    method?: string;
  }): Promise<{ transactions: Transaction[]; total: number; pages: number }> {
    let filtered = [...this.transactions];

    if (params?.status && params.status !== 'all') {
      filtered = filtered.filter(t => t.status === params.status);
    }

    if (params?.method && params.method !== 'all') {
      filtered = filtered.filter(t => t.method === params.method);
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = (page - 1) * limit;

    const paginatedTransactions = filtered.slice(offset, offset + limit);
    const total = filtered.length;
    const pages = Math.ceil(total / limit);

    return {
      transactions: paginatedTransactions,
      total,
      pages
    };
  }

  async getTransaction(transactionId: string): Promise<Transaction | null> {
    return this.transactions.find(t => t.id === transactionId) || null;
  }

  // PIX Payments
  async createPixPayment(amount: number, description: string): Promise<PIXPayment> {
    const pixId = 'pix_' + Date.now();
    const qrCode = this.generatePixQRCode(amount, description);
    
    const pixPayment: PIXPayment = {
      id: pixId,
      amount,
      qrCode,
      pixKey: 'empresa@rastreamento.com',
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
      status: 'pending'
    };

    this.pixPayments.set(pixId, pixPayment);
    return pixPayment;
  }

  async getPixPayment(pixPaymentId: string): Promise<PIXPayment | null> {
    const pixPayment = this.pixPayments.get(pixPaymentId);
    if (!pixPayment) return null;

    // Check if expired
    if (new Date(pixPayment.expiresAt) < new Date() && pixPayment.status === 'pending') {
      pixPayment.status = 'expired';
      this.pixPayments.set(pixPaymentId, pixPayment);
    }

    return pixPayment;
  }

  // Metrics
  async getBillingMetrics(period?: string): Promise<BillingMetrics> {
    // Mock data - in production, calculate from real data
    return {
      totalRevenue: 125000,
      monthlyRevenue: 28000,
      activeSubscriptions: 95,
      churnRate: 3.2,
      averageRevenuePerUser: 89.50,
      pendingPayments: 8,
      revenueGrowth: 15.3
    };
  }

  async getPaymentStats(period?: string): Promise<PaymentStats> {
    const total = this.transactions.length;
    const successful = this.transactions.filter(t => t.status === 'completed').length;
    const failed = this.transactions.filter(t => t.status === 'failed').length;
    const pending = this.transactions.filter(t => t.status === 'pending').length;
    
    return {
      total,
      successful,
      failed,
      pending,
      successRate: total > 0 ? (successful / total) * 100 : 0
    };
  }

  async getRevenueData(period?: string): Promise<any[]> {
    // Mock revenue data
    return [
      { month: 'Jan', revenue: 12000, subscribers: 45 },
      { month: 'Fev', revenue: 15000, subscribers: 52 },
      { month: 'Mar', revenue: 18000, subscribers: 68 },
      { month: 'Abr', revenue: 22000, subscribers: 75 },
      { month: 'Mai', revenue: 25000, subscribers: 89 },
      { month: 'Jun', revenue: 28000, subscribers: 95 },
    ];
  }

  // Webhook simulation
  async processWebhook(eventType: string, data: any): Promise<void> {
    console.log('Processing webhook:', eventType, data);
    
    // Simulate PIX payment confirmation
    if (eventType === 'pix.payment.confirmed' && data.pixPaymentId) {
      const pixPayment = this.pixPayments.get(data.pixPaymentId);
      if (pixPayment) {
        pixPayment.status = 'paid';
        this.pixPayments.set(data.pixPaymentId, pixPayment);
        
        // Create transaction record
        const transaction: Transaction = {
          id: 'txn_' + Date.now(),
          amount: pixPayment.amount,
          currency: 'BRL',
          status: 'completed',
          method: 'pix',
          description: data.description || 'Pagamento PIX',
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          reference: pixPayment.id
        };
        
        this.transactions.push(transaction);
      }
    }
  }

  // Helper methods
  private generatePixQRCode(amount: number, description: string): string {
    // Generate a mock PIX QR code string
    // In production, integrate with a PIX provider like PagSeguro, Mercado Pago, etc.
    const timestamp = Date.now();
    return `00020126580014br.gov.bcb.pix0136${timestamp}15204${amount.toFixed(2).replace('.', '')}5802BR5925RASTREAMENTO VEICULAR6008SAO PAULO62070503***6304${timestamp.toString().slice(-4)}`;
  }

  // Simulate payment processing
  async simulatePaymentConfirmation(pixPaymentId: string): Promise<boolean> {
    const pixPayment = this.pixPayments.get(pixPaymentId);
    if (!pixPayment) return false;

    // Simulate random success/failure
    const success = Math.random() > 0.2; // 80% success rate
    
    if (success) {
      pixPayment.status = 'paid';
      await this.processWebhook('pix.payment.confirmed', {
        pixPaymentId,
        description: `Pagamento PIX - ${pixPayment.amount}`
      });
    }

    return success;
  }
}

export const financialService = new FinancialService();