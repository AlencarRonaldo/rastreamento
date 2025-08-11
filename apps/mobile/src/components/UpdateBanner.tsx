import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UpdateService, { UpdateInfo, UpdateStatus } from '../services/updateService';

interface UpdateBannerProps {
  onDismiss?: () => void;
}

const { width } = Dimensions.get('window');

export const UpdateBanner: React.FC<UpdateBannerProps> = ({ onDismiss }) => {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [status, setStatus] = useState<UpdateStatus>({ 
    isChecking: false, 
    isDownloading: false, 
    isRestarting: false 
  });
  const [visible, setVisible] = useState(false);
  const slideAnim = new Animated.Value(-100);

  useEffect(() => {
    // Registrar para atualizações de status
    const unsubscribe = UpdateService.onStatusChange(setStatus);

    // Verificar se há atualização disponível
    checkForUpdate();

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (updateInfo && !updateInfo.isForced) {
      showBanner();
    }
  }, [updateInfo]);

  const checkForUpdate = async () => {
    try {
      const update = await UpdateService.checkForUpdates(false);
      setUpdateInfo(update);
    } catch (error) {
      console.error('Error checking for updates in banner:', error);
    }
  };

  const showBanner = () => {
    setVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideBanner = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      onDismiss?.();
    });
  };

  const handleUpdatePress = async () => {
    if (updateInfo) {
      await UpdateService.downloadAndInstallUpdate(updateInfo);
    }
  };

  const getBannerColor = () => {
    if (status.error) return '#ef4444';
    if (updateInfo?.isForced) return '#dc2626';
    return '#2563eb';
  };

  const getBannerText = () => {
    if (status.isChecking) return 'Verificando atualizações...';
    if (status.isDownloading) return `Baixando atualização... ${status.progress || 0}%`;
    if (status.isRestarting) return 'Reiniciando aplicativo...';
    if (status.error) return 'Erro na atualização';
    if (updateInfo) return `Nova versão ${updateInfo.version} disponível`;
    return '';
  };

  const getIcon = () => {
    if (status.isChecking || status.isDownloading || status.isRestarting) {
      return <ActivityIndicator size="small" color="white" />;
    }
    if (status.error) return 'alert-circle';
    if (updateInfo?.isForced) return 'warning';
    return 'download';
  };

  const isLoading = status.isChecking || status.isDownloading || status.isRestarting;

  if (!visible || !updateInfo) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        { 
          backgroundColor: getBannerColor(),
          transform: [{ translateY: slideAnim }] 
        }
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {typeof getIcon() === 'string' ? (
            <Ionicons name={getIcon() as any} size={20} color="white" />
          ) : (
            getIcon()
          )}
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{getBannerText()}</Text>
          {updateInfo.changelog.length > 0 && !isLoading && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {updateInfo.changelog[0]}
            </Text>
          )}
        </View>

        {!isLoading && (
          <View style={styles.actions}>
            {!updateInfo.isForced && (
              <TouchableOpacity
                style={styles.dismissButton}
                onPress={hideBanner}
                accessibilityLabel="Dispensar atualização"
              >
                <Ionicons name="close" size={18} color="white" />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[
                styles.updateButton,
                updateInfo.isForced && styles.forcedUpdate
              ]}
              onPress={handleUpdatePress}
              disabled={isLoading}
              accessibilityLabel="Baixar atualização"
            >
              <Text style={styles.updateButtonText}>
                {updateInfo.isForced ? 'Obrigatória' : 'Atualizar'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {status.progress !== undefined && status.isDownloading && (
        <View style={styles.progressContainer}>
          <View 
            style={[
              styles.progressBar,
              { width: `${status.progress}%` }
            ]} 
          />
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: 44, // Status bar height
    paddingHorizontal: 16,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dismissButton: {
    padding: 4,
    marginRight: 8,
  },
  updateButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  forcedUpdate: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  updateButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginTop: 8,
    borderRadius: 1,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 1,
  },
});

export default UpdateBanner;