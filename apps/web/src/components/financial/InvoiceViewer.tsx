'use client';

import React, { useState } from 'react';
import { 
  Download, 
  Eye, 
  Calendar, 
  User, 
  MapPin, 
  FileText, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  XCircle 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Invoice } from '@/types/financial';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface InvoiceViewerProps {
  invoices: Invoice[];
  loading?: boolean;
  onDownloadInvoice?: (invoiceId: string) => void;
  onViewDetails?: (invoice: Invoice) => void;
}

const statusConfig = {
  draft: { icon: FileText, label: 'Rascunho', color: 'text-gray-600 bg-gray-100' },
  sent: { icon: Clock, label: 'Enviada', color: 'text-blue-600 bg-blue-100' },
  paid: { icon: CheckCircle, label: 'Paga', color: 'text-green-600 bg-green-100' },
  overdue: { icon: AlertTriangle, label: 'Vencida', color: 'text-red-600 bg-red-100' },
  cancelled: { icon: XCircle, label: 'Cancelada', color: 'text-gray-600 bg-gray-100' },
};

export default function InvoiceViewer({ 
  invoices, 
  loading = false, 
  onDownloadInvoice,
  onViewDetails 
}: InvoiceViewerProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };


  const isOverdue = (invoice: Invoice) => {
    return invoice.status === 'sent' && new Date(invoice.dueAt) < new Date();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Carregando faturas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Faturas e Recibos</CardTitle>
          <CardDescription>
            Visualize e faça o download das suas faturas
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Invoices List */}
      <div className="space-y-4">
        {invoices.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground space-y-2">
                <FileText className="w-12 h-12 mx-auto opacity-50" />
                <p>Nenhuma fatura encontrada</p>
                <p className="text-sm">Suas faturas aparecerão aqui conforme forem geradas</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          invoices.map((invoice) => (
            <Card 
              key={invoice.id}
              className={cn(
                'transition-all duration-200 hover:shadow-md',
                isOverdue(invoice) && 'border-red-200 bg-red-50'
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="font-semibold text-lg">#{invoice.number}</div>
                      <StatusBadge status={invoice.status} />
                      <div className="font-semibold text-lg">
                        {formatPrice(invoice.amount, invoice.currency)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="text-muted-foreground">Emissão</div>
                          <div>{formatDate(invoice.issuedAt)}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="text-muted-foreground">Vencimento</div>
                          <div className={cn(
                            isOverdue(invoice) && 'text-red-600 font-semibold'
                          )}>
                            {formatDate(invoice.dueAt)}
                          </div>
                        </div>
                      </div>
                      
                      {invoice.paidAt && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <div>
                            <div className="text-muted-foreground">Pagamento</div>
                            <div className="text-green-600">{formatDate(invoice.paidAt)}</div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="font-medium">{invoice.planName}</div>
                      <div className="text-sm text-muted-foreground">
                        Período: {formatDate(invoice.period.start)} - {formatDate(invoice.period.end)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedInvoice(invoice)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </DialogTrigger>
                      
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Fatura #{selectedInvoice?.number}</DialogTitle>
                          <DialogDescription>
                            Detalhes completos da fatura
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedInvoice && (
                          <InvoiceDetails 
                            invoice={selectedInvoice}
                            onDownload={() => onDownloadInvoice?.(selectedInvoice.id)}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    {onDownloadInvoice && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onDownloadInvoice(invoice.id)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: Invoice['status'] }) {
  const config = statusConfig[status];
  if (!config) return null;
  
  const IconComponent = config.icon;
  
  return (
    <Badge variant="outline" className={cn('font-medium', config.color)}>
      <IconComponent className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}

// Invoice Details Component
function InvoiceDetails({ invoice, onDownload }: { invoice: Invoice; onDownload?: () => void }) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Fatura #{invoice.number}</h2>
          <p className="text-muted-foreground">
            {formatDate(invoice.issuedAt)}
          </p>
        </div>
        
        {onDownload && (
          <Button onClick={onDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        )}
      </div>

      {/* Status and Dates */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="mt-1">
                {statusConfig[invoice.status] && (
                  <StatusBadge status={invoice.status} />
                )}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">Data de Vencimento</div>
              <div className="font-semibold">{formatDate(invoice.dueAt)}</div>
            </div>
            
            {invoice.paidAt && (
              <div>
                <div className="text-sm text-muted-foreground">Data de Pagamento</div>
                <div className="font-semibold text-green-600">{formatDate(invoice.paidAt)}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações do Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div><strong>Nome:</strong> {invoice.customer.name}</div>
          <div><strong>Email:</strong> {invoice.customer.email}</div>
          <div><strong>Documento:</strong> {invoice.customer.document}</div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
            <div>{invoice.customer.address}</div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Information */}
      <Card>
        <CardHeader>
          <CardTitle>Plano Contratado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div><strong>Plano:</strong> {invoice.planName}</div>
          <div>
            <strong>Período:</strong> {formatDate(invoice.period.start)} até {formatDate(invoice.period.end)}
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Itens da Fatura</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoice.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <div className="flex-1">
                  <div className="font-medium">{item.description}</div>
                  <div className="text-sm text-muted-foreground">
                    Qtd: {item.quantity} × {formatPrice(item.unitPrice, invoice.currency)}
                  </div>
                </div>
                <div className="font-semibold">
                  {formatPrice(item.totalPrice, invoice.currency)}
                </div>
              </div>
            ))}
            
            <div className="flex justify-between items-center pt-3 border-t font-bold text-lg">
              <span>Total</span>
              <span>{formatPrice(invoice.amount, invoice.currency)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}