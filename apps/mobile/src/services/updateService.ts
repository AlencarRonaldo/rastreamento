import * as Updates from 'expo-updates';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native';

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

class UpdateService {
  private static instance: UpdateService;
  private checkInterval: NodeJS.Timeout | null = null;
  private statusCallbacks: Set<(status: UpdateStatus) => void> = new Set();
  private currentStatus: UpdateStatus = { isChecking: false, isDownloading: false, isRestarting: false };

  static getInstance(): UpdateService {
    if (!UpdateService.instance) {
      UpdateService.instance = new UpdateService();
    }
    return UpdateService.instance;
  }

  /**
   * Inicializa o serviço de atualização
   */
  async initialize(): Promise<void> {
    try {
      // Configurar notificações para updates
      await this.setupNotifications();
      
      // Verificar se há uma atualização pendente para aplicar
      await this.checkPendingUpdate();
      
      // Iniciar verificação automática
      this.startAutoCheck();
      
      console.log('✅ UpdateService initialized');
    } catch (error) {
      console.error('❌ Error initializing UpdateService:', error);
    }
  }

  /**
   * Verifica se há atualizações disponíveis
   */
  async checkForUpdates(showDialog: boolean = false): Promise<UpdateInfo | null> {
    if (!Updates.isEnabled) {
      console.log('Updates are disabled in development');
      return null;
    }

    this.setStatus({ isChecking: true });

    try {
      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        const manifest = update.manifest;
        const updateInfo: UpdateInfo = {
          version: manifest?.extra?.version || '1.0.0',
          buildNumber: manifest?.extra?.buildNumber || 1,
          releaseDate: manifest?.createdAt || new Date().toISOString(),
          isAvailable: true,
          isForced: await this.isForceUpdate(manifest?.extra?.version),
          changelog: manifest?.extra?.changelog || [],
          downloadSize: manifest?.extra?.downloadSize
        };

        // Salvar informações da atualização
        await AsyncStorage.setItem('lastUpdateCheck', new Date().toISOString());
        await AsyncStorage.setItem('availableUpdate', JSON.stringify(updateInfo));

        if (showDialog) {
          this.showUpdateDialog(updateInfo);
        }

        this.setStatus({ isChecking: false });
        return updateInfo;
      } else {
        await AsyncStorage.setItem('lastUpdateCheck', new Date().toISOString());
        this.setStatus({ isChecking: false });
        
        if (showDialog) {
          Alert.alert(
            'Sem atualizações',
            'Você já está usando a versão mais recente do aplicativo.',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
      this.setStatus({ isChecking: false, error: error.message });
      
      if (showDialog) {
        Alert.alert(
          'Erro',
          'Não foi possível verificar atualizações. Tente novamente mais tarde.',
          [{ text: 'OK' }]
        );
      }
    }

    return null;
  }

  /**
   * Baixa e instala uma atualização
   */
  async downloadAndInstallUpdate(updateInfo: UpdateInfo): Promise<void> {
    if (!Updates.isEnabled) {
      throw new Error('Updates are disabled');
    }

    this.setStatus({ isDownloading: true, progress: 0 });

    try {
      // Download com progresso
      const result = await Updates.fetchUpdateAsync();
      
      this.setStatus({ isDownloading: false, progress: 100 });

      if (result.isNew) {
        // Salvar informações da atualização baixada
        await AsyncStorage.setItem('downloadedUpdate', JSON.stringify(updateInfo));
        
        // Mostrar diálogo para reiniciar
        this.showRestartDialog(updateInfo);
      }
    } catch (error) {
      console.error('Error downloading update:', error);
      this.setStatus({ 
        isDownloading: false, 
        error: 'Falha ao baixar atualização: ' + error.message 
      });
      
      Alert.alert(
        'Erro no Download',
        'Não foi possível baixar a atualização. Verifique sua conexão e tente novamente.',
        [{ text: 'OK' }]
      );
    }
  }

  /**
   * Reinicia o aplicativo para aplicar a atualização
   */
  async restartApp(): Promise<void> {
    this.setStatus({ isRestarting: true });
    
    try {
      await Updates.reloadAsync();
    } catch (error) {
      console.error('Error restarting app:', error);
      this.setStatus({ 
        isRestarting: false, 
        error: 'Falha ao reiniciar aplicativo: ' + error.message 
      });
    }
  }

  /**
   * Verifica se uma versão requer atualização forçada
   */
  private async isForceUpdate(version: string): Promise<boolean> {
    try {
      // Esta informação viria do servidor/VERSION.json
      const response = await fetch('https://your-api.com/version-check');
      const versionInfo = await response.json();
      return versionInfo.platforms.mobile.forceUpdateVersion === version;
    } catch (error) {
      console.error('Error checking force update:', error);
      return false;
    }
  }

  /**
   * Mostra diálogo de atualização disponível
   */
  private showUpdateDialog(updateInfo: UpdateInfo): void {
    const buttons = updateInfo.isForced 
      ? [{ text: 'Atualizar Agora', onPress: () => this.downloadAndInstallUpdate(updateInfo) }]
      : [
          { text: 'Mais Tarde', style: 'cancel' },
          { text: 'Atualizar', onPress: () => this.downloadAndInstallUpdate(updateInfo) }
        ];

    Alert.alert(
      updateInfo.isForced ? 'Atualização Obrigatória' : 'Atualização Disponível',
      this.formatUpdateMessage(updateInfo),
      buttons,
      { cancelable: !updateInfo.isForced }
    );
  }

  /**
   * Mostra diálogo para reiniciar após download
   */
  private showRestartDialog(updateInfo: UpdateInfo): void {
    Alert.alert(
      'Atualização Baixada',
      'A atualização foi baixada com sucesso. Reinicie o aplicativo para aplicar as mudanças.',
      [
        { text: 'Mais Tarde', style: 'cancel' },
        { text: 'Reiniciar Agora', onPress: () => this.restartApp() }
      ]
    );
  }

  /**
   * Formata a mensagem de atualização
   */
  private formatUpdateMessage(updateInfo: UpdateInfo): string {
    let message = `Nova versão ${updateInfo.version} disponível!\n\n`;
    
    if (updateInfo.changelog.length > 0) {
      message += 'Novidades:\n';
      updateInfo.changelog.slice(0, 3).forEach(change => {
        message += `• ${change}\n`;
      });
      
      if (updateInfo.changelog.length > 3) {
        message += `• ...e mais ${updateInfo.changelog.length - 3} melhorias\n`;
      }
    }
    
    if (updateInfo.downloadSize) {
      const sizeMB = (updateInfo.downloadSize / 1024 / 1024).toFixed(1);
      message += `\nTamanho do download: ${sizeMB}MB`;
    }

    if (updateInfo.isForced) {
      message += '\n\n⚠️ Esta é uma atualização obrigatória para continuar usando o aplicativo.';
    }

    return message;
  }

  /**
   * Configura notificações para updates
   */
  private async setupNotifications(): Promise<void> {
    try {
      await Notifications.setNotificationChannelAsync('updates', {
        name: 'Atualizações do App',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2563eb',
      });
    } catch (error) {
      console.error('Error setting up notifications:', error);
    }
  }

  /**
   * Verifica se há uma atualização pendente para aplicar
   */
  private async checkPendingUpdate(): Promise<void> {
    try {
      const downloadedUpdate = await AsyncStorage.getItem('downloadedUpdate');
      if (downloadedUpdate) {
        const updateInfo: UpdateInfo = JSON.parse(downloadedUpdate);
        
        // Verificar se o update foi aplicado comparando versões
        const currentVersion = await AsyncStorage.getItem('currentVersion');
        if (currentVersion !== updateInfo.version) {
          // Update foi aplicado, limpar storage e mostrar sucesso
          await AsyncStorage.removeItem('downloadedUpdate');
          await AsyncStorage.setItem('currentVersion', updateInfo.version);
          
          this.showUpdateSuccessNotification(updateInfo);
        }
      }
    } catch (error) {
      console.error('Error checking pending update:', error);
    }
  }

  /**
   * Mostra notificação de sucesso da atualização
   */
  private async showUpdateSuccessNotification(updateInfo: UpdateInfo): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✅ Atualização Concluída',
        body: `App atualizado para versão ${updateInfo.version}`,
        data: { updateInfo },
      },
      trigger: null,
    });
  }

  /**
   * Inicia verificação automática de atualizações
   */
  private startAutoCheck(): void {
    // Verificar a cada 1 hora
    this.checkInterval = setInterval(async () => {
      if (Platform.OS !== 'web') {
        await this.checkForUpdates(false);
      }
    }, 60 * 60 * 1000); // 1 hour
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
   * Registra callback para receber atualizações de status
   */
  onStatusChange(callback: (status: UpdateStatus) => void): () => void {
    this.statusCallbacks.add(callback);
    
    // Retorna função para remover o callback
    return () => {
      this.statusCallbacks.delete(callback);
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
   * Limpa o cache de updates
   */
  async clearUpdateCache(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        'lastUpdateCheck',
        'availableUpdate',
        'downloadedUpdate',
        'currentVersion'
      ]);
      console.log('✅ Update cache cleared');
    } catch (error) {
      console.error('Error clearing update cache:', error);
    }
  }

  /**
   * Obtém informações da versão atual
   */
  async getCurrentVersionInfo(): Promise<{ version: string; buildTime?: string }> {
    try {
      if (Updates.isEnabled) {
        const manifest = Updates.manifest;
        return {
          version: manifest?.extra?.version || '1.0.0',
          buildTime: manifest?.createdAt
        };
      }
      
      // Fallback para desenvolvimento
      const packageJson = require('../../package.json');
      return {
        version: packageJson.version,
        buildTime: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting version info:', error);
      return { version: '1.0.0' };
    }
  }

  /**
   * Rollback para versão anterior (se disponível)
   */
  async rollbackToPreviousVersion(): Promise<void> {
    try {
      // Esta funcionalidade requer configuração específica no servidor Expo
      console.log('Rollback feature requires server-side configuration');
      
      Alert.alert(
        'Rollback',
        'Para fazer rollback, desinstale e reinstale o aplicativo da loja.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error during rollback:', error);
    }
  }
}

export default UpdateService.getInstance();