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

export const UpdateProvider: React.FC<UpdateProviderProps> = ({ 
  children, 
  autoCheck = true,
  checkInterval = 30 * 60 * 1000 // 30 minutes
}) => {
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

    // Auto-check for updates if enabled
    if (autoCheck) {
      const interval = setInterval(async () => {
        await checkForUpdates();
      }, checkInterval);

      return () => {
        clearInterval(interval);
        unsubscribeUpdate();
        unsubscribeStatus();
      };
    }

    return () => {
      unsubscribeUpdate();
      unsubscribeStatus();
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