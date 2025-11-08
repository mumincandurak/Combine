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
import apiClient from '../../api/client';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Passwords don't match!");
      return;
    }
    
    if (!username || !email || !password) {
      Alert.alert("Missing Fields", "Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/auth/register', {
        username,
        email,
        password,
      });

      if (response.data) {
        Alert.alert('Registration Successful!', 'Please log in.');
        navigation.navigate('Login');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setLoading(false);
    }
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Let's get you started!</Text>

            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor={COLORS.gray}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={COLORS.gray}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={COLORS.gray}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor={COLORS.gray}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={COLORS.primaryText} />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <Text 
                style={styles.link} 
                onPress={() => navigation.navigate('Login')}
              >
                Log In
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