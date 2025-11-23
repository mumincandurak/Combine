import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../colors';
import apiClient from '../../api/client'; // API istekleri için

const RegisterScreen = ({ navigation }) => {
  // --- FORM STATE'LERİ ---
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false); // İşlem sırasında butonu kilitlemek için

  // --- KAYIT OLMA MANTIĞI ---
  const handleRegister = async () => {
    // 1. Şifreler eşleşiyor mu kontrolü
    if (password !== confirmPassword) {
      Alert.alert("Hata", "Şifreler eşleşmiyor!");
      return;
    }
    
    // 2. Boş alan kontrolü
    if (!username || !email || !password) {
      Alert.alert("Eksik Bilgi", "Lütfen tüm alanları doldurun.");
      return;
    }

    setLoading(true); // Yükleniyor başlat
    try {
      // 3. Backend'e kayıt isteği gönder
      const response = await apiClient.post('/auth/register', {
        username,
        email,
        password,
      });

      // 4. Başarılı ise Login ekranına yönlendir
      if (response.data) {
        Alert.alert('Kayıt Başarılı!', 'Lütfen giriş yapın.');
        navigation.navigate('Login');
      }
    } catch (error) {
      // Hata mesajını yakala ve kullanıcıya göster
      const errorMessage = error.response?.data?.message || 'Beklenmedik bir hata oluştu.';
      Alert.alert('Kayıt Başarısız', errorMessage);
    } finally {
      setLoading(false); // Yükleniyor bitir
    }
  };

  return (
    <LinearGradient colors={COLORS.gradient} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.innerContainer}>
            <Text style={styles.title}>Hesap Oluştur</Text>
            <Text style={styles.subtitle}>Hadi başlayalım!</Text>

            {/* Form Alanları */}
            <TextInput
              style={styles.input}
              placeholder="Kullanıcı Adı"
              placeholderTextColor={COLORS.gray}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            
            <TextInput
              style={styles.input}
              placeholder="E-posta"
              placeholderTextColor={COLORS.gray}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Şifre"
              placeholderTextColor={COLORS.gray}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Şifreyi Onayla"
              placeholderTextColor={COLORS.gray}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
            />

            {/* Kayıt Butonu (Loading durumunda dönen ikon gösterir) */}
            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={COLORS.primaryText} />
              ) : (
                <Text style={styles.buttonText}>Kayıt Ol</Text>
              )}
            </TouchableOpacity>

            {/* Giriş Yap Yönlendirmesi */}
            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginText}>Zaten hesabın var mı? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}>Giriş Yap</Text>
              </TouchableOpacity>
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
    fontSize: 32, 
    fontWeight: 'bold',
    color: COLORS.textPrimary, // Beyaz yazı
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary, // Gri yazı
    marginBottom: 30, 
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
  loginLinkContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  loginText: {
    color: COLORS.textSecondary, // Gri yazı
    fontSize: 16,
  },
  link: {
    color: COLORS.primary, // Açık lila link
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default RegisterScreen;