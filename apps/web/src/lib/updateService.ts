'use client';

export interface UpdateInfo {
  version: string;
  buildNumber: number;
  releaseDate: string;
  isAvailable: boolean;
  isForced: boolean;
  changelog: string[];
  downloadSize?: number;
}

export interface UpdateStatus {
  isChecking: boolean;
  isDownloading: boolean;
  isRestarting: boolean;
  progress?: number;
  error?: string;
}

class WebUpdateService {
  private static instance: WebUpdateService;
  private serviceWorker: ServiceWorker | null = null;
  private statusCallbacks: Set<(status: UpdateStatus) => void> = new Set();
  private updateCallbacks: Set<(update: UpdateInfo) => void> = new Set();
  private currentStatus: UpdateStatus = { 
    isChecking: false, 
    isDownloading: false, 
    isRestarting: false 
  };
  private checkInterval: NodeJS.Timeout | null = null;

  static getInstance(): WebUpdateService {
    if (!WebUpdateService.instance) {
      WebUpdateService.instance = new WebUpdateService();
    }
    return WebUpdateService.instance;
  }

  /**
   * Inicializa o serviço de atualização
   */
  async initialize(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        // Registrar service worker
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none' // Always check for updates
        });

        console.log('✅ Service Worker registered successfully');

        // Configurar listeners
        this.setupServiceWorkerListeners(registration);
        
        // Verificar por atualizações na inicialização
        await this.checkForUpdates(false);
        
        // Iniciar verificação automática
        this.startAutoCheck();
        
        console.log('✅ WebUpdateService initialized');
      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
      }
    } else {
      console.warn('Service Workers not supported');
    }
  }

  /**
   * Configura listeners do service worker
   */
  private setupServiceWorkerListeners(registration: ServiceWorkerRegistration): void {
    // Listener para novo service worker disponível
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Nova versão disponível
            this.handleUpdateAvailable(registration);
          }
        });
      }
    });

    // Listener para controle de service worker
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // Service worker foi atualizado
      console.log('Service Worker updated, reloading...');
      window.location.reload();
    });

    // Listener para mensagens do service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      this.handleServiceWorkerMessage(event.data);
    });

    // Verificar se há um service worker esperando
    if (registration.waiting) {
      this.handleUpdateAvailable(registration);
    }
  }

  /**
   * Manipula mensagens do service worker
   */
  private handleServiceWorkerMessage(data: any): void {
    const { type, payload } = data;

    switch (type) {
      case 'VERSION_INFO':
        console.log('Service Worker version:', payload);
        break;
        
      case 'CACHE_CLEARED':
        console.log('Cache cleared successfully');
        break;
        
      case 'ROUTES_PREFETCHED':
        console.log('Routes prefetched successfully');
        break;
        
      case 'FORCE_UPDATE_REQUEST':
        this.handleForceUpdateRequest();
        break;
    }
  }

  /**
   * Manipula atualização disponível
   */
  private async handleUpdateAvailable(registration: ServiceWorkerRegistration): Promise<void> {
    try {
      // Buscar informações da nova versão
      const versionInfo = await this.fetchVersionInfo();
      
      const updateInfo: UpdateInfo = {
        version: versionInfo.version || '1.0.0',
        buildNumber: versionInfo.buildNumber || 1,
        releaseDate: versionInfo.releaseDate || new Date().toISOString(),
        isAvailable: true,
        isForced: versionInfo.isForced || false,
        changelog: versionInfo.changelog || []
      };

      // Notificar callbacks
      this.updateCallbacks.forEach(callback => callback(updateInfo));

      // Se for atualização forçada, aplicar automaticamente
      if (updateInfo.isForced) {
        await this.applyUpdate();
      }
    } catch (error) {
      console.error('Error handling update available:', error);
    }
  }

  /**
   * Busca informações da versão do servidor
   */
  private async fetchVersionInfo(): Promise<any> {
    try {
      const response = await fetch('/api/version?t=' + Date.now());
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching version info:', error);
    }

    // Fallback para VERSION.json local
    try {
      const response = await fetch('/VERSION.json?t=' + Date.now());
      if (response.ok) {
        const versionData = await response.json();
        return {
          version: versionData.platforms.web.version,
          buildNumber: versionData.platforms.web.buildNumber,
          releaseDate: versionData.platforms.web.lastUpdate,
          isForced: versionData.platforms.web.forceUpdateVersion !== null,
          changelog: versionData.changelog[versionData.version]?.changes || []
        };
      }
    } catch (error) {
      console.error('Error fetching VERSION.json:', error);
    }

    return {};
  }

  /**
   * Verifica se há atualizações disponíveis
   */
  async checkForUpdates(showDialog: boolean = false): Promise<UpdateInfo | null> {
    this.setStatus({ isChecking: true });

    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        
        if (registration) {
          // Forçar verificação de atualização
          await registration.update();
          
          // Aguardar um pouco para o service worker processar
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Verificar se há worker esperando
          if (registration.waiting) {
            const versionInfo = await this.fetchVersionInfo();
            
            const updateInfo: UpdateInfo = {
              version: versionInfo.version || '1.0.0',
              buildNumber: versionInfo.buildNumber || 1,
              releaseDate: versionInfo.releaseDate || new Date().toISOString(),
              isAvailable: true,
              isForced: versionInfo.isForced || false,
              changelog: versionInfo.changelog || []
            };

            this.setStatus({ isChecking: false });
            return updateInfo;
          }
        }
      }

      this.setStatus({ isChecking: false });
      return null;
    } catch (error) {
      console.error('Error checking for updates:', error);
      this.setStatus({ isChecking: false, error: error.message });
      return null;
    }
  }

  /**
   * Aplica a atualização disponível
   */
  async applyUpdate(): Promise<void> {
    this.setStatus({ isDownloading: true });

    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        
        if (registration?.waiting) {
          // Instruir o service worker a assumir o controle
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          
          // Aguardar um pouco e recarregar
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error applying update:', error);
      this.setStatus({ 
        isDownloading: false, 
        error: 'Falha ao aplicar atualização: ' + error.message 
      });
    }
  }

  /**
   * Força a recarga da página
   */
  async forceReload(): Promise<void> {
    this.setStatus({ isRestarting: true });
    
    try {
      // Limpar caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }

      // Recarregar página
      window.location.reload();
    } catch (error) {
      console.error('Error during force reload:', error);
      window.location.reload(); // Fallback
    }
  }

  /**
   * Manipula solicitação de atualização forçada
   */
  private handleForceUpdateRequest(): void {
    const confirmed = window.confirm(
      'Uma nova versão do aplicativo está disponível. Deseja atualizar agora?'
    );
    
    if (confirmed) {
      this.applyUpdate();
    }
  }

  /**
   * Inicia verificação automática
   */
  private startAutoCheck(): void {
    // Verificar a cada 30 minutos
    this.checkInterval = setInterval(async () => {
      await this.checkForUpdates(false);
    }, 30 * 60 * 1000); // 30 minutes
  }

  /**
   * Para verificação automática
   */
  stopAutoCheck(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Registra callback para atualizações de status
   */
  onStatusChange(callback: (status: UpdateStatus) => void): () => void {
    this.statusCallbacks.add(callback);
    
    return () => {
      this.statusCallbacks.delete(callback);
    };
  }

  /**
   * Registra callback para atualizações disponíveis
   */
  onUpdateAvailable(callback: (update: UpdateInfo) => void): () => void {
    this.updateCallbacks.add(callback);
    
    return () => {
      this.updateCallbacks.delete(callback);
    };
  }

  /**
   * Obtém o status atual
   */
  getStatus(): UpdateStatus {
    return { ...this.currentStatus };
  }

  /**
   * Define o status atual e notifica callbacks
   */
  private setStatus(status: Partial<UpdateStatus>): void {
    this.currentStatus = { ...this.currentStatus, ...status };
    this.statusCallbacks.forEach(callback => callback(this.currentStatus));
  }

  /**
   * Limpa o cache da aplicação
   */
  async clearCache(): Promise<void> {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }

      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration?.active) {
          registration.active.postMessage({ type: 'CLEAR_CACHE' });
        }
      }

      console.log('✅ Cache cleared successfully');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  /**
   * Pré-carrega rotas importantes
   */
  async prefetchRoutes(routes: string[]): Promise<void> {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration?.active) {
          registration.active.postMessage({
            type: 'PREFETCH_ROUTES',
            payload: { routes }
          });
        }
      }
    } catch (error) {
      console.error('Error prefetching routes:', error);
    }
  }

  /**
   * Obtém informações da versão atual
   */
  async getCurrentVersionInfo(): Promise<{ version: string; buildTime?: string }> {
    try {
      // Buscar do package.json ou API
      const response = await fetch('/api/version');
      if (response.ok) {
        const data = await response.json();
        return {
          version: data.version,
          buildTime: data.buildTime
        };
      }
    } catch (error) {
      console.error('Error getting version info:', error);
    }

    return { version: '1.0.0' };
  }

  /**
   * Verifica se o browser suporta atualizações
   */
  isUpdateSupported(): boolean {
    return 'serviceWorker' in navigator;
  }

  /**
   * Verifica se está offline
   */
  isOffline(): boolean {
    return !navigator.onLine;
  }
}

export default WebUpdateService.getInstance();