'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface ServiceWorkerInfo {
  registration: ServiceWorkerRegistration | null;
  updateAvailable: boolean;
  isOffline: boolean;
}

export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  const [swInfo, setSwInfo] = useState<ServiceWorkerInfo>({
    registration: null,
    updateAvailable: false,
    isOffline: false
  });

  useEffect(() => {
    // Desabilitar Service Worker em desenvolvimento para evitar problemas
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      registerServiceWorker();
    } else if (process.env.NODE_ENV !== 'production') {
      console.log('Service Worker disabled in development mode');
    }

    // Listen for online/offline events
    const handleOnline = () => setSwInfo(prev => ({ ...prev, isOffline: false }));
    const handleOffline = () => setSwInfo(prev => ({ ...prev, isOffline: true }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial online status
    setSwInfo(prev => ({ ...prev, isOffline: !navigator.onLine }));

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      setSwInfo(prev => ({ ...prev, registration }));

      // Check for updates on initial registration
      if (registration.waiting) {
        setSwInfo(prev => ({ ...prev, updateAvailable: true }));
        showUpdateNotification();
      }

      // Listen for new service worker installation
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New update available
                setSwInfo(prev => ({ ...prev, updateAvailable: true }));
                showUpdateNotification();
              }
            }
          });
        }
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);

      // Check for updates every 30 seconds when app is active
      const updateCheckInterval = setInterval(() => {
        if (document.visibilityState === 'visible' && registration) {
          try {
            registration.update().catch((error) => {
              console.warn('Service Worker update check failed:', error);
            });
          } catch (error) {
            console.warn('Service Worker update error:', error);
          }
        }
      }, 30000);

      // Clean up interval when component unmounts
      return () => clearInterval(updateCheckInterval);

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  };

  const handleServiceWorkerMessage = (event: MessageEvent) => {
    const { type, data } = event.data;
    
    switch (type) {
      case 'FORCE_UPDATE_REQUEST':
        handleForceUpdate();
        break;
      case 'VERSION_INFO':
        console.log('Service Worker version:', data);
        break;
      case 'CACHE_CLEARED':
        toast.success('Cache limpo com sucesso!');
        break;
      case 'ROUTES_PREFETCHED':
        console.log('Routes prefetched successfully');
        break;
    }
  };

  const showUpdateNotification = () => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <div className="font-medium">Nova versão disponível!</div>
        <div className="text-sm text-gray-600">
          Uma atualização está disponível para o aplicativo.
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              handleForceUpdate();
              toast.dismiss(t.id);
            }}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Atualizar
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
          >
            Depois
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
      position: 'top-center',
      id: 'sw-update'
    });
  };

  const handleForceUpdate = async () => {
    if (swInfo.registration?.waiting) {
      // Send message to waiting service worker to skip waiting
      swInfo.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Listen for controlling change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  };

  const clearCache = async () => {
    if (swInfo.registration) {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        if (event.data.type === 'CACHE_CLEARED') {
          toast.success('Cache limpo! A página será recarregada.');
          setTimeout(() => window.location.reload(), 1000);
        }
      };

      swInfo.registration.active?.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      );
    }
  };

  const prefetchRoutes = (routes: string[]) => {
    if (swInfo.registration) {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        if (event.data.type === 'ROUTES_PREFETCHED') {
          console.log('Routes prefetched successfully');
        }
      };

      swInfo.registration.active?.postMessage(
        { type: 'PREFETCH_ROUTES', payload: { routes } },
        [messageChannel.port2]
      );
    }
  };

  // Provide service worker context to children if needed
  const contextValue = {
    ...swInfo,
    clearCache,
    prefetchRoutes,
    forceUpdate: handleForceUpdate
  };

  return (
    <>
      {swInfo.isOffline && (
        <div className="fixed top-0 left-0 right-0 bg-orange-500 text-white px-4 py-2 text-center text-sm z-50">
          🔌 Você está offline. Algumas funcionalidades podem estar limitadas.
        </div>
      )}
      {children}
    </>
  );
}

export type { ServiceWorkerInfo };