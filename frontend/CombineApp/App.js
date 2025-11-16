import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from './colors';

// Ekranlar
import LoginScreen from './screens/LoginScreen/LoginScreen';
import RegisterScreen from './screens/RegisterScreen/RegisterScreen';
import HomeScreen from './screens/HomeScreen/HomeScreen';
import WardrobeScreen from './screens/WardrobeScreen/WardrobeScreen';
import ProfileScreen from './screens/ProfileScreen/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen/SettingsScreen';
import EditProfileScreen from './screens/EditProfileScreen/EditProfileScreen';
import EditStyleScreen from './screens/EditStyleScreen/EditStyleScreen';
import EditDatesScreen from './screens/EditDatesScreen/EditDatesScreen';
import StatisticsScreen from './screens/StatisticsScreen/StatisticsScreen';
import AddClothingScreen from './screens/AddClothingScreen/AddClothingScreen';

// Navigatörler
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();
const WardrobeStack = createStackNavigator();

// --- BAŞLIK STİLLERİ GÜNCELLENDİ (SOLID/DÜZ RENK) ---
const darkScreenOptions = {
  // headerTransparent: true, // <-- KAPATILDI
  
  headerStyle: {
    // YENİ: Başlık arka planı, gradient'in başlangıç rengiyle aynı
    backgroundColor: COLORS.gradient[0], // ('#090040')
    shadowOpacity: 0, 
    elevation: 0,
    borderBottomWidth: 0, // Çizgi yok (gradient ile bütünleşsin)
  },
  headerTintColor: COLORS.textPrimary, // Başlık yazısı (Beyaz)
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 18, 
  },
  headerTitleAlign: 'center', 
};

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// Profile ve alt ekranları
function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={darkScreenOptions}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: 'Profile' }} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
      <ProfileStack.Screen name="EditStyle" component={EditStyleScreen} options={{ title: 'Styles & Colors' }} />
      <ProfileStack.Screen name="EditDates" component={EditDatesScreen} options={{ title: 'Important Dates' }} />
      <ProfileStack.Screen name="Statistics" component={StatisticsScreen} options={{ title: 'Statistics' }} />
    </ProfileStack.Navigator>
  );
}

// Wardrobe ve alt ekranı
function WardrobeNavigator() {
  return (
    <WardrobeStack.Navigator screenOptions={darkScreenOptions}>
      <WardrobeStack.Screen name="WardrobeMain" component={WardrobeScreen} options={{ title: 'My Wardrobe' }} />
      <WardrobeStack.Screen name="AddClothing" component={AddClothingScreen} options={{ title: 'Add New Item' }} />
    </WardrobeStack.Navigator>
  );
}

// Alt Sekme Çubuğu (Aynı, lila/siyah)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primaryText, // Siyah
        tabBarInactiveTintColor: COLORS.gray,       // Gri
        tabBarShowLabel: false, 
        tabBarStyle: {
          backgroundColor: COLORS.primary, // Açık lila arka plan
          borderTopWidth: 0,
          elevation: 0,
          //height: 60, önceki hali
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false, 
          tabBarIcon: ({ color }) => ( <Ionicons name="home" size={24} color={color} /> ),
        }}
      />
      <Tab.Screen
        name="Wardrobe"
        component={WardrobeNavigator}
        options={{
          headerShown: false, 
          tabBarIcon: ({ color }) => ( <Ionicons name="cut-outline" size={24} color={color} /> ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          headerShown: false, 
          tabBarIcon: ({ color }) => ( <Ionicons name="person-outline" size={24} color={color} /> ),
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { token, restoreToken } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      await restoreToken();
      setLoading(false);
    };

    bootstrapAsync();
  }, [restoreToken]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
