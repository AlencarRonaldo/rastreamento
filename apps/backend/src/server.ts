import Fastify from 'fastify';
import cors from '@fastify/cors';
import { financialRoutes } from './routes/financial.routes';

async function buildApp() {
  const app = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty'
      }
    }
  });

  // Register CORS
  await app.register(cors, {
    origin: true,
    credentials: true
  });

  // Register financial routes
  await app.register(financialRoutes, { prefix: '/api' });

  // Routes
  app.get('/', async (request, reply) => {
    return {
      name: 'Vehicle Tracking System API',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        health: '/health',
        status: '/api/status',
        vehicles: '/api/vehicles',
        financial: '/api/financial'
      },
      documentation: 'Sistema de rastreamento veicular'
    };
  });

  app.get('/health', async (request, reply) => {
    return {
      status: 'ok',
      service: 'vehicle-tracking-backend',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  });

  app.get('/api/status', async (request, reply) => {
    return {
      status: 'running',
      service: 'vehicle-tracking-backend',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    };
  });

  app.get('/api/vehicles', async (request, reply) => {
    return {
      vehicles: [
        {
          id: 'test-001',
          name: 'Veículo Teste',
          status: 'active',
          location: {
            lat: -23.5505,
            lng: -46.6333
          }
        }
      ]
    };
  });

  return app;
}

async function start() {
  try {
    const app = await buildApp();
    const port = Number(process.env.PORT) || 3001;
    const host = '0.0.0.0';
    
    await app.listen({ port, host });
    console.log(`🚀 Server running on http://${host}:${port}`);
    console.log(`📋 Health: http://${host}:${port}/health`);
    console.log(`📊 Status: http://${host}:${port}/api/status`);
    
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

start();