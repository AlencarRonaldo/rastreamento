# Sistema Financeiro - Vehicle Tracking

Sistema completo de gerenciamento financeiro com planos de assinatura, processamento de pagamentos PIX, histórico de transações e dashboard com métricas.

## 🚀 Funcionalidades

### 1. Planos de Assinatura
- **Básico (R$ 29,90/mês)**: Até 5 veículos, alertas básicos
- **Premium (R$ 59,90/mês)**: Até 15 veículos, relatórios, API
- **Enterprise (R$ 149,90/mês)**: Veículos ilimitados, recursos avançados

### 2. Métodos de Pagamento
- **PIX**: Aprovação instantânea, sem taxas
- **Cartão de Crédito**: Taxa de 3,99%, processamento em 1-2 dias
- **Boleto Bancário**: Taxa de R$ 2,50, processamento em 1-3 dias

### 3. Pagamento PIX
- Geração de QR Code automática
- Código PIX para cópia manual
- Tempo de expiração de 30 minutos
- Status em tempo real
- Instruções passo a passo

### 4. Dashboard Financeiro
- Métricas de receita e crescimento
- Estatísticas de assinantes ativos
- Taxa de sucesso de pagamentos
- Gráficos interativos com Recharts
- Análise por método de pagamento

### 5. Histórico de Transações
- Filtros por status e método
- Busca por descrição ou referência
- Exportação de dados
- Detalhes completos das transações

### 6. Faturas e Recibos
- Visualização de faturas detalhadas
- Download em PDF (simulado)
- Status de pagamento
- Informações do cliente

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 14** com App Router
- **React Hook Form** para formulários
- **Recharts** para gráficos
- **shadcn/ui** para componentes
- **Tailwind CSS** para estilização
- **Date-fns** para manipulação de datas
- **QRCode** para geração de códigos PIX
- **React Query** para gerenciamento de estado
- **Axios** para requisições HTTP

### Backend
- **Fastify** como servidor web
- **TypeScript** para tipagem
- Simulação de pagamentos PIX
- API RESTful completa
- Sistema de webhooks

## 📁 Estrutura de Arquivos

```
apps/web/src/
├── components/financial/
│   ├── BillingDashboard.tsx      # Dashboard com métricas
│   ├── InvoiceViewer.tsx         # Visualizador de faturas
│   ├── PaymentMethods.tsx        # Seleção de métodos de pagamento
│   ├── PIXPayment.tsx           # Interface de pagamento PIX
│   ├── PlanSelector.tsx         # Seleção de planos
│   └── TransactionHistory.tsx   # Histórico de transações
├── services/
│   └── financial.api.ts         # Cliente API
├── types/
│   └── financial.ts             # Tipos TypeScript
└── app/(auth)/financeiro/
    └── page.tsx                 # Página principal

apps/backend/src/
├── services/
│   └── financial.service.ts     # Lógica de negócios
├── routes/
│   └── financial.routes.ts      # Rotas da API
└── types/
    └── financial.ts             # Tipos do backend
```

## 🔧 API Endpoints

### Planos
- `GET /api/financial/plans` - Lista todos os planos
- `GET /api/financial/plans/:id` - Detalhes de um plano

### Transações
- `GET /api/financial/transactions` - Lista transações (paginado)
- `GET /api/financial/transactions/:id` - Detalhes da transação

### PIX
- `POST /api/financial/pix/create` - Criar pagamento PIX
- `GET /api/financial/pix/:id/status` - Status do pagamento
- `POST /api/financial/pix/:id/simulate-confirmation` - Simular confirmação (teste)

### Métricas
- `GET /api/financial/metrics/billing` - Métricas de faturamento
- `GET /api/financial/metrics/payments` - Estatísticas de pagamento
- `GET /api/financial/metrics/revenue` - Dados de receita

### Webhooks
- `POST /api/financial/webhook` - Processar webhooks de pagamento

## 🎨 Componentes

### PlanSelector
```tsx
<PlanSelector
  plans={plans}
  currentPlanId="premium"
  onSelectPlan={handlePlanSelect}
  loading={false}
/>
```

### PaymentMethods
```tsx
<PaymentMethods
  selectedPlan={plan}
  onPaymentMethodSelect={handleMethodSelect}
/>
```

### PIXPayment
```tsx
<PIXPayment
  pixPayment={pixPayment}
  onRefresh={handleRefresh}
  onStatusUpdate={handleStatusUpdate}
/>
```

### BillingDashboard
```tsx
<BillingDashboard
  metrics={billingMetrics}
  paymentStats={paymentStats}
  revenueData={revenueData}
/>
```

## 📊 Exemplos de Uso

### Criar Pagamento PIX
```typescript
const pixPayment = await financialApi.createPixPayment(59.90, 'Assinatura Premium');
```

### Buscar Transações
```typescript
const { transactions } = await financialApi.getTransactions({
  page: 1,
  limit: 10,
  status: 'completed'
});
```

### Obter Métricas
```typescript
const metrics = await financialApi.getBillingMetrics('30d');
```

## 🔄 Fluxo de Pagamento PIX

1. **Seleção do Plano**: Usuário escolhe o plano desejado
2. **Método de Pagamento**: Seleciona PIX como forma de pagamento
3. **Geração do Código**: Sistema gera QR Code e código PIX
4. **Pagamento**: Usuário paga via app bancário
5. **Confirmação**: Webhook confirma o pagamento
6. **Ativação**: Serviço é ativado automaticamente

## 🧪 Simulação e Testes

### Teste de PIX (Backend)
```bash
# Criar pagamento PIX
curl -X POST http://localhost:3001/api/financial/pix/create \
  -H "Content-Type: application/json" \
  -d '{"amount": 59.90, "description": "Test PIX"}'

# Simular confirmação
curl -X POST http://localhost:3001/api/financial/pix/:id/simulate-confirmation
```

### Dados de Exemplo
- O sistema inclui dados de exemplo para demonstração
- Métricas simuladas com valores realistas
- Transações de teste com diferentes status

## 🌐 Acesso

- **Frontend**: http://localhost:4000/financeiro
- **Backend**: http://localhost:3001/api/financial
- **Health Check**: http://localhost:3001/api/financial/health

## 🔒 Segurança

- Validação de entrada em todos os endpoints
- Tipos TypeScript para type safety
- Sanitização de dados de pagamento
- Logs estruturados para auditoria

## 📱 Responsividade

- Design mobile-first
- Interface adaptável para tablets
- Componentes otimizados para touch
- Layouts responsivos com Tailwind CSS

## 🚀 Próximos Passos

1. **Integração Real**: Conectar com provedor PIX (PagSeguro, Mercado Pago)
2. **Banco de Dados**: Implementar persistência com Prisma/PostgreSQL
3. **Autenticação**: Integrar com sistema de auth existente
4. **Notificações**: Sistema de emails para confirmações
5. **Relatórios**: Exportação de dados em Excel/CSV
6. **Assinaturas**: Cobrança recorrente automática

## 🐛 Troubleshooting

### Erro de Compilação React
- Verificar imports dos componentes shadcn/ui
- Validar props dos componentes Recharts
- Confirmar tipagem TypeScript

### Erro de API
- Verificar se backend está rodando na porta 3001
- Validar headers de CORS
- Confirmar formato JSON das requisições

### PIX não Gera QR Code
- Verificar biblioteca qrcode instalada
- Validar formato do código PIX
- Confirmar dados do pagamento