import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UpdateInfo, UpdateStatus } from '../services/updateService';
import { useUpdate } from '../hooks/useUpdate';

interface UpdateModalProps {
  visible: boolean;
  updateInfo: UpdateInfo;
  onClose: () => void;
  onUpdate: () => void;
}

const { width, height } = Dimensions.get('window');

const UpdateModal: React.FC<UpdateModalProps> = ({ 
  visible, 
  updateInfo, 
  onClose, 
  onUpdate 
}) => {
  const { status, downloadAndInstall, restartApp } = useUpdate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Preparando atualização...',
    'Baixando nova versão...',
    'Instalando atualização...',
    'Finalizando...'
  ];

  useEffect(() => {
    if (status.isDownloading && status.progress) {
      if (status.progress < 25) setCurrentStep(1);
      else if (status.progress < 75) setCurrentStep(2);
      else if (status.progress < 100) setCurrentStep(3);
    }
  }, [status.isDownloading, status.progress]);

  const handleUpdate = async () => {
    try {
      await downloadAndInstall();
      // Modal será fechado automaticamente quando o app reiniciar
    } catch (error) {
      Alert.alert(
        'Erro na Atualização',
        'Não foi possível baixar a atualização. Tente novamente mais tarde.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleClose = () => {
    if (!updateInfo.isForced && !status.isDownloading && !status.isRestarting) {
      onClose();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getButtonColor = () => {
    if (updateInfo.isForced) return '#dc2626'; // red
    return '#2563eb'; // blue
  };

  const isLoading = status.isDownloading || status.isRestarting;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, updateInfo.isForced && styles.forcedModal]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              {updateInfo.isForced ? (
                <Ionicons name="warning" size={32} color="#dc2626" />
              ) : (
                <Ionicons name="download" size={32} color="#2563eb" />
              )}
            </View>
            
            <Text style={styles.title}>
              {updateInfo.isForced ? 'Atualização Obrigatória' : 'Nova Versão Disponível'}
            </Text>
            
            <Text style={styles.version}>
              Versão {updateInfo.version}
            </Text>

            {!updateInfo.isForced && !isLoading && (
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handleClose}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            )}
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {updateInfo.isForced && (
              <View style={styles.warningBox}>
                <Ionicons name="warning" size={20} color="#dc2626" />
                <Text style={styles.warningText}>
                  Esta atualização é obrigatória para continuar usando o aplicativo.
                </Text>
              </View>
            )}

            {/* Release Info */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Informações da Versão</Text>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Versão:</Text>
                <Text style={styles.infoValue}>{updateInfo.version}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Data de lançamento:</Text>
                <Text style={styles.infoValue}>
                  {new Date(updateInfo.releaseDate).toLocaleDateString('pt-BR')}
                </Text>
              </View>
              
              {updateInfo.downloadSize && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Tamanho:</Text>
                  <Text style={styles.infoValue}>
                    {formatFileSize(updateInfo.downloadSize)}
                  </Text>
                </View>
              )}
            </View>

            {/* Changelog */}
            {updateInfo.changelog.length > 0 && (
              <View style={styles.changelogSection}>
                <Text style={styles.sectionTitle}>Novidades</Text>
                {updateInfo.changelog.map((change, index) => (
                  <View key={index} style={styles.changelogItem}>
                    <Text style={styles.changelogBullet}>•</Text>
                    <Text style={styles.changelogText}>{change}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Progress */}
            {isLoading && (
              <View style={styles.progressSection}>
                <Text style={styles.progressTitle}>
                  {steps[currentStep]}
                </Text>
                
                <View style={styles.progressContainer}>
                  <View 
                    style={[
                      styles.progressBar,
                      { width: `${status.progress || 0}%` }
                    ]} 
                  />
                </View>
                
                <Text style={styles.progressText}>
                  {status.progress || 0}%
                </Text>
              </View>
            )}

            {/* Error */}
            {status.error && (
              <View style={styles.errorSection}>
                <Ionicons name="alert-circle" size={20} color="#dc2626" />
                <Text style={styles.errorText}>{status.error}</Text>
              </View>
            )}
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            {!isLoading && (
              <>
                {!updateInfo.isForced && (
                  <TouchableOpacity
                    style={styles.laterButton}
                    onPress={handleClose}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.laterButtonText}>Mais Tarde</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  style={[
                    styles.updateButton,
                    { backgroundColor: getButtonColor() },
                    updateInfo.isForced && styles.fullWidth
                  ]}
                  onPress={onUpdate || handleUpdate}
                  activeOpacity={0.8}
                >
                  <Text style={styles.updateButtonText}>
                    {updateInfo.isForced ? 'Atualizar Obrigatoriamente' : 'Atualizar Agora'}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#2563eb" />
                <Text style={styles.loadingText}>
                  {status.isRestarting ? 'Reiniciando aplicativo...' : 'Baixando atualização...'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 16,
    maxWidth: width * 0.9,
    maxHeight: height * 0.8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  forcedModal: {
    borderWidth: 2,
    borderColor: '#dc2626',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    position: 'relative',
  },
  iconContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  version: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  warningText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '500',
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  changelogSection: {
    marginBottom: 24,
  },
  changelogItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  changelogBullet: {
    fontSize: 16,
    color: '#2563eb',
    marginRight: 8,
    marginTop: 2,
  },
  changelogText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  progressSection: {
    marginBottom: 24,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  errorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#dc2626',
  },
  actions: {
    flexDirection: 'row',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  laterButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  laterButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  updateButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  fullWidth: {
    flex: 2,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
});

export default UpdateModal;