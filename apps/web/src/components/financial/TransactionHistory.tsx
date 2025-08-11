'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  QrCode, 
  CreditCard, 
  FileText, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/types/financial';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TransactionHistoryProps {
  transactions: Transaction[];
  loading?: boolean;
  onTransactionClick?: (transaction: Transaction) => void;
  onExport?: () => void;
}

const statusConfig = {
  pending: { icon: Clock, label: 'Pendente', color: 'text-yellow-600 bg-yellow-100' },
  processing: { icon: AlertCircle, label: 'Processando', color: 'text-blue-600 bg-blue-100' },
  completed: { icon: CheckCircle, label: 'Concluído', color: 'text-green-600 bg-green-100' },
  failed: { icon: XCircle, label: 'Falhou', color: 'text-red-600 bg-red-100' },
  cancelled: { icon: XCircle, label: 'Cancelado', color: 'text-gray-600 bg-gray-100' },
};

const methodConfig = {
  pix: { icon: QrCode, label: 'PIX', color: 'bg-purple-100 text-purple-700' },
  card: { icon: CreditCard, label: 'Cartão', color: 'bg-blue-100 text-blue-700' },
  boleto: { icon: FileText, label: 'Boleto', color: 'bg-orange-100 text-orange-700' },
};

export default function TransactionHistory({ 
  transactions, 
  loading = false, 
  onTransactionClick,
  onExport 
}: TransactionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchTerm === '' || 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || transaction.method === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getStatusBadge = (status: Transaction['status']) => {
    const config = statusConfig[status];
    const IconComponent = config.icon;
    
    return (
      <Badge variant="outline" className={cn('font-medium', config.color)}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getMethodBadge = (method: Transaction['method']) => {
    const config = methodConfig[method];
    const IconComponent = config.icon;
    
    return (
      <Badge variant="outline" className={cn('font-medium', config.color)}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Carregando transações...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <CardTitle>Histórico de Transações</CardTitle>
              <CardDescription>
                Visualize todas as suas transações financeiras
              </CardDescription>
            </div>
            
            {onExport && (
              <Button onClick={onExport} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar transações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendente</option>
              <option value="processing">Processando</option>
              <option value="completed">Concluído</option>
              <option value="failed">Falhou</option>
              <option value="cancelled">Cancelado</option>
            </select>
            
            <select 
              value={methodFilter} 
              onChange={(e) => setMethodFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="all">Todos os Métodos</option>
              <option value="pix">PIX</option>
              <option value="card">Cartão</option>
              <option value="boleto">Boleto</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground space-y-2">
                <Filter className="w-12 h-12 mx-auto opacity-50" />
                <p>Nenhuma transação encontrada</p>
                <p className="text-sm">Tente ajustar os filtros de busca</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredTransactions.map((transaction) => (
            <Card 
              key={transaction.id}
              className={cn(
                'transition-all duration-200 hover:shadow-md',
                onTransactionClick && 'cursor-pointer hover:bg-muted/50'
              )}
              onClick={() => onTransactionClick?.(transaction)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(transaction.status)}
                        {getMethodBadge(transaction.method)}
                      </div>
                      
                      <div className="font-semibold">
                        {formatPrice(transaction.amount, transaction.currency)}
                      </div>
                    </div>
                    
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      {transaction.planName && (
                        <p className="text-sm text-muted-foreground">
                          Plano: {transaction.planName}
                        </p>
                      )}
                      {transaction.reference && (
                        <p className="text-sm text-muted-foreground">
                          Ref: {transaction.reference}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <div className="text-sm text-muted-foreground">
                      {formatDate(transaction.createdAt)}
                    </div>
                    {transaction.completedAt && transaction.status === 'completed' && (
                      <div className="text-xs text-green-600">
                        Concluído em {formatDate(transaction.completedAt)}
                      </div>
                    )}
                    {onTransactionClick && (
                      <div className="flex justify-end">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary */}
      {filteredTransactions.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">
                  {filteredTransactions.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Transações
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {filteredTransactions.filter(t => t.status === 'completed').length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Concluídas
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {filteredTransactions.filter(t => t.status === 'pending' || t.status === 'processing').length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Pendentes
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold">
                  {formatPrice(
                    filteredTransactions
                      .filter(t => t.status === 'completed')
                      .reduce((sum, t) => sum + t.amount, 0),
                    'BRL'
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Pago
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}