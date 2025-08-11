/**
 * Settings Screen - SuperClaude Generated
 * Tela de configurações do aplicativo
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/authStore';
import { useUpdate } from '../hooks/useUpdate';

interface SettingItem {
  key: string;
  title: string;
  subtitle?: string;
  type: 'toggle' | 'button' | 'info';
  icon: string;
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

const SettingsScreen: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { 
    isUpdateAvailable, 
    updateInfo, 
    checkForUpdate, 
    downloadUpdate,
    isDownloading,
    downloadProgress 
  } = useUpdate();

  const [settings, setSettings] = useState({
    notifications: true,
    locationTracking: true,
    autoUpdate: true,
    soundAlerts: true,
    vibration: true,
    backgroundSync: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('@app_settings');
      if (savedSettings) {
        setSettings({ ...settings, ...JSON.parse(savedSettings) });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: typeof settings) => {
    try {
      await AsyncStorage.setItem('@app_settings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleToggle = (key: keyof typeof settings) => (value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair do aplicativo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: logout
        }
      ]
    );
  };

  const handleUpdateCheck = async () => {
    try {
      await checkForUpdate();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível verificar atualizações');
    }
  };

  const handleUpdateDownload = async () => {
    if (!isUpdateAvailable) return;
    
    try {
      await downloadUpdate();
      Alert.alert(
        'Atualização Baixada',
        'A atualização foi baixada e será aplicada quando você reiniciar o aplicativo.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível baixar a atualização');
    }
  };

  const openUrl = (url: string) => {
    Linking.openURL(url).catch(err => 
      console.error('Error opening URL:', err)
    );
  };

  const settingItems: SettingItem[] = [
    {
      key: 'profile',
      title: 'Perfil do Usuário',
      subtitle: user?.name || user?.email || 'Não identificado',
      type: 'info',
      icon: 'person',
    },
    {
      key: 'notifications',
      title: 'Notificações',
      subtitle: 'Receber alertas dos veículos',
      type: 'toggle',
      icon: 'notifications',
      value: settings.notifications,
      onToggle: handleToggle('notifications'),
    },
    {
      key: 'locationTracking',
      title: 'Rastreamento de Localização',
      subtitle: 'Permitir acesso à localização',
      type: 'toggle',
      icon: 'location-on',
      value: settings.locationTracking,
      onToggle: handleToggle('locationTracking'),
    },
    {
      key: 'soundAlerts',
      title: 'Alertas Sonoros',
      subtitle: 'Reproduzir sons para alertas',
      type: 'toggle',
      icon: 'volume-up',
      value: settings.soundAlerts,
      onToggle: handleToggle('soundAlerts'),
    },
    {
      key: 'vibration',
      title: 'Vibração',
      subtitle: 'Vibrar para alertas importantes',
      type: 'toggle',
      icon: 'vibration',
      value: settings.vibration,
      onToggle: handleToggle('vibration'),
    },
    {
      key: 'backgroundSync',
      title: 'Sincronização em Segundo Plano',
      subtitle: 'Atualizar dados em background',
      type: 'toggle',
      icon: 'sync',
      value: settings.backgroundSync,
      onToggle: handleToggle('backgroundSync'),
    },
    {
      key: 'autoUpdate',
      title: 'Atualizações Automáticas',
      subtitle: 'Baixar atualizações automaticamente',
      type: 'toggle',
      icon: 'system-update',
      value: settings.autoUpdate,
      onToggle: handleToggle('autoUpdate'),
    },
  ];

  const actionItems: SettingItem[] = [
    {
      key: 'checkUpdate',
      title: isUpdateAvailable ? 'Atualização Disponível' : 'Verificar Atualizações',
      subtitle: isUpdateAvailable 
        ? `Versão ${updateInfo?.version} disponível`
        : 'Última verificação: agora',
      type: 'button',
      icon: 'system-update',
      onPress: isUpdateAvailable ? handleUpdateDownload : handleUpdateCheck,
    },
    {
      key: 'support',
      title: 'Suporte',
      subtitle: 'Entre em contato conosco',
      type: 'button',
      icon: 'help',
      onPress: () => openUrl('mailto:support@vehicletracker.com'),
    },
    {
      key: 'privacy',
      title: 'Política de Privacidade',
      type: 'button',
      icon: 'privacy-tip',
      onPress: () => openUrl('https://vehicletracker.com/privacy'),
    },
    {
      key: 'terms',
      title: 'Termos de Uso',
      type: 'button',
      icon: 'description',
      onPress: () => openUrl('https://vehicletracker.com/terms'),
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.key}
      style={styles.settingItem}
      onPress={item.onPress}
      disabled={item.type !== 'button'}
      activeOpacity={item.type === 'button' ? 0.7 : 1}
    >
      <View style={styles.settingIcon}>
        <Icon name={item.icon} size={24} color="#2563eb" />
      </View>
      
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        {item.subtitle && (
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        )}
      </View>

      {item.type === 'toggle' && (
        <Switch
          value={item.value}
          onValueChange={item.onToggle}
          trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
          thumbColor={item.value ? '#ffffff' : '#f3f4f6'}
        />
      )}

      {item.type === 'button' && (
        <Icon name="chevron-right" size={24} color="#9ca3af" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>
          {settingItems.slice(0, 1).map(renderSettingItem)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificações</Text>
          {settingItems.slice(1, 5).map(renderSettingItem)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sincronização</Text>
          {settingItems.slice(5).map(renderSettingItem)}
        </View>

        {isDownloading && (
          <View style={styles.downloadProgress}>
            <Text style={styles.downloadText}>
              Baixando atualização: {Math.round(downloadProgress * 100)}%
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${downloadProgress * 100}%` }
                ]}
              />
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aplicativo</Text>
          {actionItems.map(renderSettingItem)}
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Icon name="logout" size={24} color="#ef4444" />
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            VehicleTracker SuperClaude v1.0.0
          </Text>
          <Text style={styles.footerSubtext}>
            Desenvolvido com React Native e Expo
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  downloadProgress: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  downloadText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default SettingsScreen;