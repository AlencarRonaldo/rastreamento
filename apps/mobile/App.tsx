/**
 * Vehicle Tracking App - SuperClaude Generated
 * App principal com navegação e configuração global
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import MapScreen from './src/screens/MapScreen';
import { VehicleListScreen } from './src/screens/VehicleListScreen';
import { VehicleDetailsScreen } from './src/screens/VehicleDetailsScreen';
import RoutesHistoryScreen from './src/screens/RoutesHistoryScreen';
import AlertsScreen from './src/screens/AlertsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Services
import { initializeNotifications } from './src/services/notifications';
import { initializeSocket } from './src/services/socket';
import { useAuthStore } from './src/store/authStore';

// Types
import { RootStackParamList, MainTabParamList } from './src/types/navigation';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Configurar notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Map':
              iconName = 'map';
              break;
            case 'Vehicles':
              iconName = 'directions-car';
              break;
            case 'Routes':
              iconName = 'route';
              break;
            case 'Alerts':
              iconName = 'notifications';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#2563eb',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Map" 
        component={MapScreen} 
        options={{ 
          title: 'Mapa',
          headerShown: false // MapScreen tem seu próprio header
        }} 
      />
      <Tab.Screen 
        name="Vehicles" 
        component={VehicleListScreen} 
        options={{ title: 'Veículos' }} 
      />
      <Tab.Screen 
        name="Routes" 
        component={RoutesHistoryScreen} 
        options={{ title: 'Rotas' }} 
      />
      <Tab.Screen 
        name="Alerts" 
        component={AlertsScreen} 
        options={{ title: 'Alertas' }} 
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Configurações' }} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const { isAuthenticated, initializeAuth } = useAuthStore();

  useEffect(() => {
    // Inicializar autenticação
    initializeAuth();

    // Configurar notificações se autenticado
    if (isAuthenticated) {
      initializeNotifications();
      initializeSocket();
    }

    // Registrar para notificações push
    registerForPushNotificationsAsync();
  }, [isAuthenticated]);

  const registerForPushNotificationsAsync = async () => {
    if (!Device.isDevice) {
      console.log('Push notifications only work on physical devices');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }

    try {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Push token:', token);
      
      // Enviar token para o backend
      // await api.updatePushToken(token);
    } catch (error) {
      console.error('Error getting push token:', error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="light" backgroundColor="#2563eb" />
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: '#2563eb',
              },
              headerTintColor: '#ffffff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            {!isAuthenticated ? (
              <Stack.Screen 
                name="Login" 
                component={LoginScreen}
                options={{ 
                  headerShown: false,
                  animationTypeForReplace: 'push'
                }}
              />
            ) : (
              <>
                <Stack.Screen 
                  name="Main" 
                  component={MainTabs}
                  options={{ headerShown: false }}
                />
                <Stack.Screen 
                  name="VehicleDetails" 
                  component={VehicleDetailsScreen}
                  options={{ 
                    title: 'Detalhes do Veículo',
                    presentation: 'modal'
                  }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}