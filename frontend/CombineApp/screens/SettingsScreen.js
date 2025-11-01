import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
// import { useHeaderHeight } from '@react-navigation/elements'; // <-- SİLİNDİ

// Menü butonu bileşeni (Aynı)
const SettingsMenuItem = ({ title, iconName, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemContent}>
      <Ionicons name={iconName} size={22} color={COLORS.primary} />
      <Text style={styles.menuItemText}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward-outline" size={22} color={COLORS.gray} />
  </TouchableOpacity>
);

const SettingsScreen = ({ navigation }) => {
  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", onPress: () => console.log("Çıkış yapıldı!"), style: "destructive" },
    ]);
  };
  
  // const headerHeight = useHeaderHeight(); // <-- SİLİNDİ

  return (
    <LinearGradient
      colors={COLORS.gradient} 
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        {/* 'paddingTop: headerHeight' kaldırıldı */}
        <View> 
          <View style={styles.menuContainer}>
            <SettingsMenuItem 
              title="Edit Profile" 
              iconName="person-outline"
              onPress={() => navigation.navigate('EditProfile')}
            />
            <SettingsMenuItem 
              title="Edit Styles & Colors" 
              iconName="color-palette-outline"
              onPress={() => navigation.navigate('EditStyle')}
            />
            <SettingsMenuItem 
              title="Edit Important Dates" 
              iconName="calendar-outline"
              onPress={() => navigation.navigate('EditDates')}
            />
          </View>
          <View style={styles.logoutButtonContainer}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={22} color={'#E74C3C'} />
              <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { 
    flex: 1,
  },
  menuContainer: {
    // YENİ: Başlığın 'solid' olduğunu varsayarak 10px boşluk
    marginTop: 10, 
    marginHorizontal: 10,
    backgroundColor: COLORS.card,
    borderRadius: 10,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 18,
    color: COLORS.textPrimary,
    marginLeft: 15,
  },
  logoutButtonContainer: {
    marginHorizontal: 10,
    marginTop: 30,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 15,
  },
  logoutButtonText: {
    fontSize: 18,
    color: '#E74C3C',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default SettingsScreen;