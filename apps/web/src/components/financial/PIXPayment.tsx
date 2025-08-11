'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, QrCode, Clock, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PIXPayment as PIXPaymentType } from '@/types/financial';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import QRCodeLib from 'qrcode';

interface PIXPaymentProps {
  pixPayment: PIXPaymentType;
  onStatusUpdate?: (status: PIXPaymentType['status']) => void;
  onRefresh?: () => void;
}

export default function PIXPayment({ pixPayment, onStatusUpdate, onRefresh }: PIXPaymentProps) {
  const [copied, setCopied] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Generate QR Code image
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrCodeDataURL = await QRCodeLib.toDataURL(pixPayment.qrCode, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeImage(qrCodeDataURL);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCode();
  }, [pixPayment.qrCode]);

  // Calculate time left until expiration
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expirationTime = new Date(pixPayment.expiresAt).getTime();
      const difference = expirationTime - now;
      
      if (difference > 0) {
        setTimeLeft(Math.floor(difference / 1000)); // in seconds
      } else {
        setTimeLeft(0);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [pixPayment.expiresAt]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pixPayment.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getStatusBadge = () => {
    switch (pixPayment.status) {
      case 'paid':
        return <Badge className="bg-green-500 text-white">Pago</Badge>;
      case 'pending':
        return <Badge variant="outline">Aguardando Pagamento</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expirado</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Cancelado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  if (pixPayment.status === 'paid') {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-green-800">Pagamento Confirmado!</CardTitle>
          <CardDescription className="text-green-600">
            Seu pagamento PIX foi processado com sucesso.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-2">
            <div className="font-semibold text-lg text-green-800">
              {formatPrice(pixPayment.amount)}
            </div>
            <div className="text-sm text-green-600">
              ID da transação: {pixPayment.id}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (pixPayment.status === 'expired') {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="text-center">
          <CardTitle className="text-red-800">PIX Expirado</CardTitle>
          <CardDescription className="text-red-600">
            Este código PIX expirou. Gere um novo código para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={onRefresh} variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
            <RefreshCw className="w-4 h-4 mr-2" />
            Gerar Novo PIX
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status and Timer */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Pagamento PIX</CardTitle>
              <CardDescription>
                {formatPrice(pixPayment.amount)}
              </CardDescription>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        
        {timeLeft > 0 && (
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Expira em: </span>
              <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold font-mono">
                {formatTime(timeLeft)}
              </span>
            </div>
          </CardContent>
        )}
      </Card>

      {/* QR Code */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-lg flex items-center justify-center gap-2">
            <QrCode className="w-5 h-5" />
            Código QR
          </CardTitle>
          <CardDescription>
            Escaneie com o aplicativo do seu banco
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {qrCodeImage ? (
            <div className="inline-block p-4 bg-white border rounded-lg shadow-sm">
              <img 
                src={qrCodeImage} 
                alt="QR Code PIX" 
                className="mx-auto"
                style={{ maxWidth: 300, height: 'auto' }}
              />
            </div>
          ) : (
            <div className="w-[300px] h-[300px] mx-auto bg-muted rounded-lg flex items-center justify-center">
              <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Copy PIX Code */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Código PIX</CardTitle>
          <CardDescription>
            Ou copie e cole no seu app bancário
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-muted rounded-lg font-mono text-sm break-all">
            {pixPayment.qrCode}
          </div>
          
          <Button 
            onClick={copyToClipboard}
            className="w-full"
            variant="outline"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copiar Código PIX
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800">Como pagar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-blue-700">
          <div className="space-y-2 text-sm">
            <p className="flex items-start gap-2">
              <span className="font-semibold bg-blue-200 w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
              Abra o app do seu banco ou carteira digital
            </p>
            <p className="flex items-start gap-2">
              <span className="font-semibold bg-blue-200 w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
              Acesse a opção PIX e escolha "Ler QR Code"
            </p>
            <p className="flex items-start gap-2">
              <span className="font-semibold bg-blue-200 w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
              Escaneie o código QR ou copie e cole o código
            </p>
            <p className="flex items-start gap-2">
              <span className="font-semibold bg-blue-200 w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">4</span>
              Confirme os dados e finalize o pagamento
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Refresh Button */}
      {onRefresh && (
        <div className="text-center">
          <Button onClick={onRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Verificar Status
          </Button>
        </div>
      )}
    </div>
  );
}