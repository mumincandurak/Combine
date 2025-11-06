import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert // Giriş simülasyonu için
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Eklendi
import { LinearGradient } from 'expo-linear-gradient'; // Eklendi
import { COLORS } from '../colors';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Giriş yap butonuna basıldığında
  const handleLogin = () => {
    console.log('Login Tıklandı:', { email, password });
    
    // --- SİMÜLASYON ---
    // Normalde burada backend'e istek atılır.
    // Biz burada 'userIsLoggedIn'i değiştiremiyoruz (o App.js'de).
    // O yüzden şimdilik sadece bir uyarı verip, 
    // App.js'deki 'userIsLoggedIn = true' sayesinde zaten 
    // ana ekranda olduğumuzu varsayıyoruz.
    // Bu kısmı en son "Context" ile düzelteceğiz.
    Alert.alert('Giriş Başarılı (Simülasyon)', 'Ana ekrana yönlendiriliyorsunuz...');
  };

  return (
    <LinearGradient
      colors={COLORS.gradient}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.innerContainer}>
            <Text style={styles.title}>Combine</Text>
            <Text style={styles.subtitle}>Welcome Back!</Text>

            {/* Mail Giriş Kutusu */}
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={COLORS.gray}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Şifre Giriş Kutusu */}
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={COLORS.gray}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />

            {/* Giriş Yap Butonu */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            {/* Kayıt Ol Linki */}
            <View style={styles.registerLinkContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <Text 
                style={styles.link} 
                onPress={() => navigation.navigate('Register')}
              >
                Sign Up
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

// --- STİLLER GÜNCELLENDİ (KOYU TEMA) ---
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20, 
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.textPrimary, // Beyaz yazı
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'sans-serif-condensed', 
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary, // Gri yazı
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.card, // Kart rengi
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.secondary, // Mor çerçeve
    color: COLORS.textPrimary, // Beyaz yazı
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.primary, // Açık lila buton
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.primaryText, // Siyah yazı
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerLinkContainer: {
    flexDirection: 'row', 
    marginTop: 20,
  },
  registerText: {
    color: COLORS.textSecondary, // Gri yazı
    fontSize: 16,
  },
  link: {
    color: COLORS.primary, // Açık lila link
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default LoginScreen;
