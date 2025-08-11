export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
  vehicleLimit: number;
  alertsLimit: number;
  reportsAccess: boolean;
  apiAccess: boolean;
  supportLevel: 'basic' | 'priority' | 'dedicated';
}

export interface PaymentMethod {
  id: string;
  type: 'pix' | 'card' | 'boleto';
  name: string;
  icon: string;
  processingTime: string;
  fees?: number;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  method: PaymentMethod['type'];
  description: string;
  createdAt: string;
  completedAt?: string;
  reference?: string;
  planId?: string;
  planName?: string;
}

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issuedAt: string;
  dueAt: string;
  paidAt?: string;
  planId: string;
  planName: string;
  period: {
    start: string;
    end: string;
  };
  items: InvoiceItem[];
  customer: {
    name: string;
    email: string;
    document: string;
    address: string;
  };
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface BillingMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  churnRate: number;
  averageRevenuePerUser: number;
  pendingPayments: number;
  revenueGrowth: number;
}

export interface PaymentStats {
  total: number;
  successful: number;
  failed: number;
  pending: number;
  successRate: number;
}

export interface PIXPayment {
  id: string;
  amount: number;
  qrCode: string;
  qrCodeImage?: string;
  pixKey: string;
  expiresAt: string;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
}

export interface BillingAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CustomerData {
  name: string;
  email: string;
  phone: string;
  document: string; // CPF/CNPJ
  documentType: 'cpf' | 'cnpj';
  address: BillingAddress;
}

export interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  status: 'active' | 'paused' | 'cancelled' | 'past_due';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelledAt?: string;
  pausedAt?: string;
  resumedAt?: string;
  autoRenew: boolean;
  plan: SubscriptionPlan;
}

export interface WebhookEvent {
  id: string;
  type: string;
  data: any;
  createdAt: string;
  processed: boolean;
}