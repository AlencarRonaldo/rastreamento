'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      // Check for iOS
      const isIOSInstalled = window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      
      // Check for Android
      const isAndroidInstalled = window.matchMedia('(display-mode: standalone)').matches;
      
      setIsInstalled(isIOSInstalled || isAndroidInstalled);
    };

    checkIfInstalled();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      
      // Save the event so it can be triggered later
      setDeferredPrompt(e);
      setShowInstallButton(true);
      
      // Show a custom install notification
      showInstallNotification();
    };

    // Listen for app installation
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
      
      toast.success('App instalado com sucesso! 🎉');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const showInstallNotification = () => {
    // Don't show if already installed or if we've shown it recently
    const lastShown = localStorage.getItem('install-prompt-shown');
    const now = Date.now();
    
    if (lastShown && (now - parseInt(lastShown)) < 24 * 60 * 60 * 1000) {
      // Don't show more than once per day
      return;
    }

    toast((t) => (
      <div className="flex flex-col gap-2">
        <div className="font-medium">📱 Instalar App</div>
        <div className="text-sm text-gray-600">
          Adicione o Rastreador Veicular à sua tela inicial para acesso rápido!
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              handleInstallClick();
              toast.dismiss(t.id);
            }}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Instalar
          </button>
          <button
            onClick={() => {
              localStorage.setItem('install-prompt-shown', now.toString());
              toast.dismiss(t.id);
            }}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
          >
            Não agora
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
      position: 'bottom-center',
      id: 'install-pwa'
    });

    localStorage.setItem('install-prompt-shown', now.toString());
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // For iOS devices, show manual installation instructions
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        showIOSInstructions();
        return;
      }
      return;
    }

    try {
      // Show the install prompt
      await deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        toast.success('Instalando app...');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      // Clear the deferredPrompt
      setDeferredPrompt(null);
      setShowInstallButton(false);
    } catch (error) {
      console.error('Error installing PWA:', error);
      toast.error('Erro ao instalar o app');
    }
  };

  const showIOSInstructions = () => {
    toast((t) => (
      <div className="flex flex-col gap-2 max-w-sm">
        <div className="font-medium">📱 Instalar no iOS</div>
        <div className="text-sm text-gray-600">
          Para instalar este app:
        </div>
        <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
          <li>Toque no ícone de compartilhar <span className="font-mono">↗️</span></li>
          <li>Role para baixo e toque em "Adicionar à Tela de Início"</li>
          <li>Toque em "Adicionar"</li>
        </ol>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 self-start"
        >
          Entendi
        </button>
      </div>
    ), {
      duration: 15000,
      position: 'bottom-center',
      id: 'ios-instructions'
    });
  };

  // Don't render anything if already installed
  if (isInstalled) {
    return null;
  }

  // Render install button if available
  if (showInstallButton && deferredPrompt) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={handleInstallClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span>📱</span>
          <span>Instalar App</span>
        </button>
      </div>
    );
  }

  return null;
}

export default InstallPWA;