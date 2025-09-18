import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  Alert,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
  Text,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

// Screens
import NewTradeScreen from './src/screens/NewTradeScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import TradesHistoryScreen from './src/screens/TradesHistoryScreen';
import AdvancedAnalyticsScreen from './src/screens/AdvancedAnalyticsScreen';
import FundamentalScreen from './src/screens/FundamentalScreen';
import PerformanceScreen from './src/screens/PerformanceScreen';

// Context
import { TradeProvider } from './src/context/TradeContext';

// Utils
import { requestStoragePermission } from './src/utils/permissions';

const Tab = createBottomTabNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Request permissions
      if (Platform.OS === 'android') {
        await requestStoragePermission();
      }

      // Check if first time user
      const firstTime = await AsyncStorage.getItem('firstTime');
      if (!firstTime) {
        await showWelcomeMessage();
        await AsyncStorage.setItem('firstTime', 'false');
      }

      setIsLoading(false);
    } catch (error) {
      console.error('App initialization error:', error);
      setIsLoading(false);
    }
  };

  const showWelcomeMessage = async () => {
    return new Promise((resolve) => {
      Alert.alert(
        '🚀 Welcome to Professional Trading Journal!',
        'Track your trades with advanced analytics and multi-timeframe analysis.\n\nFeatures:\n📊 Real-time performance metrics\n📈 Multi-timeframe analysis\n🔍 Advanced pattern recognition\n📱 Export & backup capabilities',
        [
          {
            text: 'Get Started',
            onPress: resolve,
          },
        ],
        { cancelable: false }
      );
    });
  };

  const CustomTabBar = ({ state, descriptors, navigation }) => {
    return (
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          flexDirection: 'row',
          height: 80,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 10,
        }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel || route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isFocused ? 1 : 0.7,
                transform: [{ scale: isFocused ? 1.1 : 1 }],
              }}>
              {options.tabBarIcon({ focused: isFocused })}
              <Text
                style={{
                  color: 'white',
                  fontSize: 10,
                  fontWeight: isFocused ? 'bold' : 'normal',
                  marginTop: 2,
                }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2a5298' }}>
        <Icon name="trending-up" size={60} color="white" />
        <Text style={{ color: 'white', fontSize: 18, marginTop: 20, fontWeight: 'bold' }}>
          Professional Trading Journal
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 5 }}>
          Loading...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#2a5298" />
      <TradeProvider>
        <NavigationContainer>
          <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: '#ffffff',
              tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
            }}>
            <Tab.Screen
              name="NewTrade"
              component={NewTradeScreen}
              options={{
                tabBarLabel: 'New Trade',
                tabBarIcon: ({ focused }) => (
                  <Icon 
                    name="add-circle" 
                    size={24} 
                    color={focused ? '#ffffff' : 'rgba(255,255,255,0.6)'} 
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{
                tabBarLabel: 'Dashboard',
                tabBarIcon: ({ focused }) => (
                  <Icon 
                    name="dashboard" 
                    size={24} 
                    color={focused ? '#ffffff' : 'rgba(255,255,255,0.6)'} 
                  />
                ),
              }}
            />
            <Tab.Screen
              name="History"
              component={TradesHistoryScreen}
              options={{
                tabBarLabel: 'History',
                tabBarIcon: ({ focused }) => (
                  <Icon 
                    name="history" 
                    size={24} 
                    color={focused ? '#ffffff' : 'rgba(255,255,255,0.6)'} 
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Analytics"
              component={AdvancedAnalyticsScreen}
              options={{
                tabBarLabel: 'Analytics',
                tabBarIcon: ({ focused }) => (
                  <Icon 
                    name="analytics" 
                    size={24} 
                    color={focused ? '#ffffff' : 'rgba(255,255,255,0.6)'} 
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Fundamental"
              component={FundamentalScreen}
              options={{
                tabBarLabel: 'News',
                tabBarIcon: ({ focused }) => (
                  <Icon 
                    name="public" 
                    size={24} 
                    color={focused ? '#ffffff' : 'rgba(255,255,255,0.6)'} 
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Performance"
              component={PerformanceScreen}
              options={{
                tabBarLabel: 'Goals',
                tabBarIcon: ({ focused }) => (
                  <Icon 
                    name="flag" 
                    size={24} 
                    color={focused ? '#ffffff' : 'rgba(255,255,255,0.6)'} 
                  />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </TradeProvider>
    </SafeAreaProvider>
  );
};

export default App;