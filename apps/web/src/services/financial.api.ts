import axios from 'axios';
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
} from '@/types/financial';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const financialApi = {
  // Plans
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await api.get('/financial/plans');
    return response.data;
  },

  getPlan: async (planId: string): Promise<SubscriptionPlan> => {
    const response = await api.get(`/financial/plans/${planId}`);
    return response.data;
  },

  // Subscriptions
  getSubscriptions: async (): Promise<Subscription[]> => {
    const response = await api.get('/financial/subscriptions');
    return response.data;
  },

  createSubscription: async (planId: string, paymentMethodId: string): Promise<Subscription> => {
    const response = await api.post('/financial/subscriptions', {
      planId,
      paymentMethodId,
    });
    return response.data;
  },

  cancelSubscription: async (subscriptionId: string): Promise<void> => {
    await api.patch(`/financial/subscriptions/${subscriptionId}/cancel`);
  },

  pauseSubscription: async (subscriptionId: string): Promise<void> => {
    await api.patch(`/financial/subscriptions/${subscriptionId}/pause`);
  },

  resumeSubscription: async (subscriptionId: string): Promise<void> => {
    await api.patch(`/financial/subscriptions/${subscriptionId}/resume`);
  },

  // Transactions
  getTransactions: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    method?: string;
  }): Promise<{ transactions: Transaction[]; total: number; pages: number }> => {
    const response = await api.get('/financial/transactions', { params });
    return response.data;
  },

  getTransaction: async (transactionId: string): Promise<Transaction> => {
    const response = await api.get(`/financial/transactions/${transactionId}`);
    return response.data;
  },

  // PIX Payments
  createPixPayment: async (amount: number, description: string): Promise<PIXPayment> => {
    const response = await api.post('/financial/pix/create', {
      amount,
      description,
    });
    return response.data;
  },

  checkPixPayment: async (pixPaymentId: string): Promise<PIXPayment> => {
    const response = await api.get(`/financial/pix/${pixPaymentId}/status`);
    return response.data;
  },

  // Invoices
  getInvoices: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ invoices: Invoice[]; total: number; pages: number }> => {
    const response = await api.get('/financial/invoices', { params });
    return response.data;
  },

  getInvoice: async (invoiceId: string): Promise<Invoice> => {
    const response = await api.get(`/financial/invoices/${invoiceId}`);
    return response.data;
  },

  downloadInvoicePDF: async (invoiceId: string): Promise<Blob> => {
    const response = await api.get(`/financial/invoices/${invoiceId}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Metrics
  getBillingMetrics: async (period?: string): Promise<BillingMetrics> => {
    const response = await api.get('/financial/metrics/billing', {
      params: { period },
    });
    return response.data;
  },

  getPaymentStats: async (period?: string): Promise<PaymentStats> => {
    const response = await api.get('/financial/metrics/payments', {
      params: { period },
    });
    return response.data;
  },

  getRevenueData: async (period?: string): Promise<any[]> => {
    const response = await api.get('/financial/metrics/revenue', {
      params: { period },
    });
    return response.data;
  },

  // Customer Data
  updateCustomerData: async (data: CustomerData): Promise<CustomerData> => {
    const response = await api.put('/financial/customer', data);
    return response.data;
  },

  getCustomerData: async (): Promise<CustomerData> => {
    const response = await api.get('/financial/customer');
    return response.data;
  },

  // Webhooks
  getWebhookEvents: async (): Promise<WebhookEvent[]> => {
    const response = await api.get('/financial/webhooks');
    return response.data;
  },

  processWebhook: async (eventId: string): Promise<void> => {
    await api.post(`/financial/webhooks/${eventId}/process`);
  },
};

export default financialApi;