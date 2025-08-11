import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { financialService } from '../services/financial.service';

// Request interfaces
interface CreatePixPaymentRequest {
  Body: {
    amount: number;
    description: string;
  };
}

interface GetTransactionsRequest {
  Querystring: {
    page?: number;
    limit?: number;
    status?: string;
    method?: string;
  };
}

interface GetMetricsRequest {
  Querystring: {
    period?: string;
  };
}

interface PixPaymentParams {
  pixPaymentId: string;
}

interface TransactionParams {
  transactionId: string;
}

interface PlanParams {
  planId: string;
}

export async function financialRoutes(app: FastifyInstance) {
  // Plans endpoints
  app.get('/financial/plans', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const plans = await financialService.getPlans();
      return { success: true, data: plans };
    } catch (error) {
      reply.status(500);
      return { success: false, error: 'Failed to fetch plans' };
    }
  });

  app.get<{ Params: PlanParams }>('/financial/plans/:planId', async (request, reply) => {
    try {
      const { planId } = request.params;
      const plan = await financialService.getPlan(planId);
      
      if (!plan) {
        reply.status(404);
        return { success: false, error: 'Plan not found' };
      }
      
      return { success: true, data: plan };
    } catch (error) {
      reply.status(500);
      return { success: false, error: 'Failed to fetch plan' };
    }
  });

  // Transactions endpoints
  app.get<GetTransactionsRequest>('/financial/transactions', async (request, reply) => {
    try {
      const result = await financialService.getTransactions(request.query);
      return { success: true, data: result };
    } catch (error) {
      reply.status(500);
      return { success: false, error: 'Failed to fetch transactions' };
    }
  });

  app.get<{ Params: TransactionParams }>('/financial/transactions/:transactionId', async (request, reply) => {
    try {
      const { transactionId } = request.params;
      const transaction = await financialService.getTransaction(transactionId);
      
      if (!transaction) {
        reply.status(404);
        return { success: false, error: 'Transaction not found' };
      }
      
      return { success: true, data: transaction };
    } catch (error) {
      reply.status(500);
      return { success: false, error: 'Failed to fetch transaction' };
    }
  });

  // PIX Payment endpoints
  app.post<CreatePixPaymentRequest>('/financial/pix/create', async (request, reply) => {
    try {
      const { amount, description } = request.body;
      
      if (!amount || amount <= 0) {
        reply.status(400);
        return { success: false, error: 'Invalid amount' };
      }
      
      const pixPayment = await financialService.createPixPayment(amount, description);
      return { success: true, data: pixPayment };
    } catch (error) {
      reply.status(500);
      return { success: false, error: 'Failed to create PIX payment' };
    }
  });

  app.get<{ Params: PixPaymentParams }>('/financial/pix/:pixPaymentId/status', async (request, reply) => {
    try {
      const { pixPaymentId } = request.params;
      const pixPayment = await financialService.getPixPayment(pixPaymentId);
      
      if (!pixPayment) {
        reply.status(404);
        return { success: false, error: 'PIX payment not found' };
      }
      
      return { success: true, data: pixPayment };
    } catch (error) {
      reply.status(500);
      return { success: false, error: 'Failed to fetch PIX payment status' };
    }
  });

  // Simulate PIX payment confirmation (for testing)
  app.post<{ Params: PixPaymentParams }>('/financial/pix/:pixPaymentId/simulate-confirmation', async (request, reply) => {
    try {
      const { pixPaymentId } = request.params;
      const success = await financialService.simulatePaymentConfirmation(pixPaymentId);
      
      if (!success) {
        reply.status(404);
        return { success: false, error: 'PIX payment not found or could not be confirmed' };
      }
      
      return { success: true, message: 'PIX payment confirmed successfully' };
    } catch (error) {
      reply.status(500);
      return { success: false, error: 'Failed to simulate PIX confirmation' };
    }
  });

  // Metrics endpoints
  app.get<GetMetricsRequest>('/financial/metrics/billing', async (request, reply) => {
    try {
      const metrics = await financialService.getBillingMetrics(request.query.period);
      return { success: true, data: metrics };
    } catch (error) {
      reply.status(500);
      return { success: false, error: 'Failed to fetch billing metrics' };
    }
  });

  app.get<GetMetricsRequest>('/financial/metrics/payments', async (request, reply) => {
    try {
      const stats = await financialService.getPaymentStats(request.query.period);
      return { success: true, data: stats };
    } catch (error) {
      reply.status(500);
      return { success: false, error: 'Failed to fetch payment stats' };
    }
  });

  app.get<GetMetricsRequest>('/financial/metrics/revenue', async (request, reply) => {
    try {
      const revenueData = await financialService.getRevenueData(request.query.period);
      return { success: true, data: revenueData };
    } catch (error) {
      reply.status(500);
      return { success: false, error: 'Failed to fetch revenue data' };
    }
  });

  // Webhook endpoint for payment confirmations
  app.post('/financial/webhook', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { type, data } = request.body as { type: string; data: any };
      
      if (!type || !data) {
        reply.status(400);
        return { success: false, error: 'Invalid webhook payload' };
      }
      
      await financialService.processWebhook(type, data);
      return { success: true, message: 'Webhook processed successfully' };
    } catch (error) {
      reply.status(500);
      return { success: false, error: 'Failed to process webhook' };
    }
  });

  // Health check for financial service
  app.get('/financial/health', async (request: FastifyRequest, reply: FastifyReply) => {
    return {
      service: 'financial',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  });
}