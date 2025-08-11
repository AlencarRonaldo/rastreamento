'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import WebUpdateService, { UpdateInfo, UpdateStatus } from '@/lib/updateService';
import UpdateNotification from './UpdateNotification';

interface UpdateContextType {
  updateInfo: UpdateInfo | null;
  status: UpdateStatus;
  checkForUpdates: () => Promise<void>;
  applyUpdate: () => Promise<void>;
  dismissUpdate: () => void;
}

const UpdateContext = createContext<UpdateContextType | null>(null);

interface UpdateProviderProps {
  children: ReactNode;
  autoCheck?: boolean;
  checkInterval?: number;
}

export const UpdateProvider = ({ 
  children, 
  autoCheck = true,
  checkInterval = 30 * 60 * 1000 // 30 minutes
}: UpdateProviderProps) => {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [status, setStatus] = useState<UpdateStatus>({
    isChecking: false,
    isDownloading: false,
    isRestarting: false
  });
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Initialize update service
    WebUpdateService.initialize();

    // Register for update notifications
    const unsubscribeUpdate = WebUpdateService.onUpdateAvailable((update) => {
      setUpdateInfo(update);
      setDismissed(false);
    });

    // Register for status changes
    const unsubscribeStatus = WebUpdateService.onStatusChange(setStatus);

    // Listen for Service Worker update messages
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data.type === 'FORCE_UPDATE_REQUEST') {
        // Service Worker is requesting an update
        setUpdateInfo({
          version: event.data.data?.version || 'unknown',
          releaseDate: new Date().toISOString(),
          features: ['Atualização do Service Worker disponível'],
          fixes: [],
          size: 0,
          mandatory: false,
          downloadUrl: ''
        });
        setDismissed(false);
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }

    // Auto-check for updates if enabled
    let interval: NodeJS.Timeout | undefined;
    if (autoCheck) {
      interval = setInterval(async () => {
        await checkForUpdates();
      }, checkInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
      unsubscribeUpdate();
      unsubscribeStatus();
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      }
    };
  }, [autoCheck, checkInterval]);

  const checkForUpdates = async (): Promise<void> => {
    try {
      const update = await WebUpdateService.checkForUpdates(false);
      setUpdateInfo(update);
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  };

  const applyUpdate = async (): Promise<void> => {
    try {
      if (updateInfo) {
        await WebUpdateService.applyUpdate();
      }
    } catch (error) {
      console.error('Error applying update:', error);
    }
  };

  const dismissUpdate = (): void => {
    setDismissed(true);
    setUpdateInfo(null);
  };

  const contextValue: UpdateContextType = {
    updateInfo,
    status,
    checkForUpdates,
    applyUpdate,
    dismissUpdate
  };

  return (
    <UpdateContext.Provider value={contextValue}>
      {children}
      {updateInfo && !dismissed && (
        <UpdateNotification onDismiss={dismissUpdate} />
      )}
    </UpdateContext.Provider>
  );
};

export const useUpdate = (): UpdateContextType => {
  const context = useContext(UpdateContext);
  if (!context) {
    throw new Error('useUpdate must be used within an UpdateProvider');
  }
  return context;
};

export default UpdateProvider;