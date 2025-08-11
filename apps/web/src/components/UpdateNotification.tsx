'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  ArrowDownTrayIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import WebUpdateService, { UpdateInfo, UpdateStatus } from '@/lib/updateService';

interface UpdateNotificationProps {
  onDismiss?: () => void;
}

const UpdateNotification: React.FC<UpdateNotificationProps> = ({ onDismiss }) => {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [status, setStatus] = useState<UpdateStatus>({
    isChecking: false,
    isDownloading: false,
    isRestarting: false
  });
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Registrar para atualizações disponíveis
    const unsubscribeUpdate = WebUpdateService.onUpdateAvailable((update) => {
      setUpdateInfo(update);
      setVisible(true);
      setDismissed(false);
    });

    // Registrar para mudanças de status
    const unsubscribeStatus = WebUpdateService.onStatusChange(setStatus);

    return () => {
      unsubscribeUpdate();
      unsubscribeStatus();
    };
  }, []);

  const handleUpdate = async () => {
    if (updateInfo) {
      await WebUpdateService.applyUpdate();
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    onDismiss?.();
  };

  const getNotificationColor = () => {
    if (status.error) return 'bg-red-500';
    if (updateInfo?.isForced) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  const getIcon = () => {
    if (status.isDownloading || status.isRestarting) {
      return (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      );
    }
    if (status.error) return <ExclamationTriangleIcon className="h-5 w-5" />;
    if (updateInfo?.isForced) return <ExclamationTriangleIcon className="h-5 w-5" />;
    return <ArrowDownTrayIcon className="h-5 w-5" />;
  };

  const getTitle = () => {
    if (status.isDownloading) return 'Baixando atualização...';
    if (status.isRestarting) return 'Aplicando atualização...';
    if (status.error) return 'Erro na atualização';
    if (updateInfo?.isForced) return 'Atualização obrigatória';
    return `Nova versão ${updateInfo?.version} disponível`;
  };

  const getMessage = () => {
    if (status.error) return status.error;
    if (status.isDownloading) return `Progresso: ${status.progress || 0}%`;
    if (status.isRestarting) return 'Por favor, aguarde...';
    if (updateInfo?.changelog && updateInfo.changelog.length > 0) {
      return updateInfo.changelog.slice(0, 2).join(', ');
    }
    if (updateInfo?.features && updateInfo.features.length > 0) {
      return updateInfo.features.slice(0, 2).join(', ');
    }
    return 'Clique para atualizar agora';
  };

  const isLoading = status.isDownloading || status.isRestarting;
  const canDismiss = !updateInfo?.isForced && !isLoading;

  if (!visible || !updateInfo || dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className={`${getNotificationColor()} text-white shadow-lg`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Icon */}
              <div className="flex-shrink-0">
                {getIcon()}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 mx-4">
                <p className="text-sm font-medium truncate">
                  {getTitle()}
                </p>
                <p className="text-xs text-white/80 truncate">
                  {getMessage()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                {!isLoading && (
                  <button
                    onClick={handleUpdate}
                    disabled={isLoading}
                    className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {updateInfo.isForced ? 'Obrigatória' : 'Atualizar'}
                  </button>
                )}

                {canDismiss && (
                  <button
                    onClick={handleDismiss}
                    className="p-1 rounded-md hover:bg-white/20 transition-colors"
                    aria-label="Dispensar notificação"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Progress bar */}
            {status.progress !== undefined && status.isDownloading && (
              <div className="h-1 bg-white/20 overflow-hidden">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${status.progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpdateNotification;