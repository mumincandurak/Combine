import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../colors';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  // --- STATE YÖNETİMİ ---
  const [email, setEmail] = useState('');     // Kullanıcının girdiği e-posta
  const [password, setPassword] = useState(''); // Kullanıcının girdiği şifre

  // Context'ten login fonksiyonunu alıyoruz
  const { login } = useAuth(); 

  // --- GİRİŞ MANTIĞI ---
  const handleLogin = async () => {
    // 1. Context içindeki login fonksiyonunu çağır (API isteği orada yapılır)
    const success = await login(email, password);
    
    // 2. Eğer giriş başarısızsa kullanıcıya uyarı ver
    if (!success) {
      Alert.alert("Giriş Başarısız", "Lütfen bilgilerinizi kontrol edin.");
    }
    // NOT: Eğer giriş başarılı olursa, App.js'teki 'token' state'i değişeceği için
    // uygulama otomatik olarak Ana Sayfa'ya (MainTabs) geçiş yapacaktır.
    // Bu yüzden burada navigation.navigate('Home') dememize gerek yok.
  };

  return (
    <LinearGradient colors={COLORS.gradient} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        {/* Klavye açıldığında ekranı yukarı itmek için */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.innerContainer}>
            <Text style={styles.title}>Combine</Text>
            <Text style={styles.subtitle}>Tekrar Hoşgeldiniz!</Text>

            {/* E-posta Giriş Alanı */}
            <TextInput
              style={styles.input}
              placeholder="E-posta"
              placeholderTextColor={COLORS.gray}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address" // Klavye tipini e-postaya uygun açar
              autoCapitalize="none"        // Baş harfi otomatik büyütme (e-posta için önemlidir)
              autoCorrect={false}
            />

            {/* Şifre Giriş Alanı */}
            <TextInput
              style={styles.input}
              placeholder="Şifre"
              placeholderTextColor={COLORS.gray}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true} // Şifreyi gizle (***)
            />

            {/* Giriş Butonu */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Giriş Yap</Text>
            </TouchableOpacity>

            {/* Kayıt Ol Yönlendirmesi */}
            <View style={styles.registerLinkContainer}>
              <Text style={styles.registerText}>Hesabın yok mu? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>Kayıt Ol</Text>
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