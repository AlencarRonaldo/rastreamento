import { useState, useEffect, useCallback } from 'react';
import UpdateService, { UpdateInfo, UpdateStatus } from '../services/updateService';

interface UseUpdateReturn {
  updateInfo: UpdateInfo | null;
  status: UpdateStatus;
  checkForUpdates: (showDialog?: boolean) => Promise<UpdateInfo | null>;
  downloadAndInstall: () => Promise<void>;
  restartApp: () => Promise<void>;
  clearCache: () => Promise<void>;
  getCurrentVersion: () => Promise<{ version: string; buildTime?: string }>;
  isUpdateSupported: boolean;
}

export const useUpdate = (): UseUpdateReturn => {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [status, setStatus] = useState<UpdateStatus>({
    isChecking: false,
    isDownloading: false,
    isRestarting: false
  });

  useEffect(() => {
    // Initialize update service
    UpdateService.initialize();

    // Register for status updates
    const unsubscribe = UpdateService.onStatusChange(setStatus);

    return unsubscribe;
  }, []);

  const checkForUpdates = useCallback(async (showDialog: boolean = false): Promise<UpdateInfo | null> => {
    try {
      const update = await UpdateService.checkForUpdates(showDialog);
      setUpdateInfo(update);
      return update;
    } catch (error) {
      console.error('Error checking for updates:', error);
      return null;
    }
  }, []);

  const downloadAndInstall = useCallback(async (): Promise<void> => {
    try {
      if (updateInfo) {
        await UpdateService.downloadAndInstallUpdate(updateInfo);
      }
    } catch (error) {
      console.error('Error downloading and installing update:', error);
      throw error;
    }
  }, [updateInfo]);

  const restartApp = useCallback(async (): Promise<void> => {
    try {
      await UpdateService.restartApp();
    } catch (error) {
      console.error('Error restarting app:', error);
      throw error;
    }
  }, []);

  const clearCache = useCallback(async (): Promise<void> => {
    try {
      await UpdateService.clearUpdateCache();
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw error;
    }
  }, []);

  const getCurrentVersion = useCallback(async (): Promise<{ version: string; buildTime?: string }> => {
    try {
      return await UpdateService.getCurrentVersionInfo();
    } catch (error) {
      console.error('Error getting version info:', error);
      return { version: '1.0.0' };
    }
  }, []);

  return {
    updateInfo,
    status,
    checkForUpdates,
    downloadAndInstall,
    restartApp,
    clearCache,
    getCurrentVersion,
    isUpdateSupported: true // React Native/Expo sempre suporta
  };
};

export default useUpdate;