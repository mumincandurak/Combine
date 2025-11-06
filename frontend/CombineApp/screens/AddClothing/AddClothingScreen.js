import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
// import { useHeaderHeight } from '@react-navigation/elements'; // <-- SİLİNDİ

const AddClothingScreen = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const [season, setSeason] = useState('');

  // ... (pickImageGallery, pickImageCamera, handleSave fonksiyonları aynı)
  const pickImageGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Galeri izni gerekiyor!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Expo Go için
      allowsEditing: true, aspect: [1, 1], quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };
  const pickImageCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Kamera izni gerekiyor!');
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, aspect: [1, 1], quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };
  const handleSave = () => {
    if (!imageUri || !category || !color || !season) {
        alert('Lütfen tüm alanları doldurun ve resim seçin.');
        return;
    }
    console.log('Kıyafet Kaydedildi:', { imageUri, category, color, season });
    navigation.goBack();
  };

  // const headerHeight = useHeaderHeight(); // <-- SİLİNDİ

  return (
    <LinearGradient
      colors={COLORS.gradient} 
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          // contentContainerStyle={{ paddingTop: headerHeight }} // <-- SİLİNDİ
        >
          {/* 1. Fotoğraf Alanı */}
          <View style={styles.imagePickerContainer}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera" size={80} color={COLORS.gray} />
                <Text style={styles.placeholderText}>No Image Selected</Text>
              </View>
            )}
          </View>
          
          {/* 2. Fotoğraf Seçme Butonları */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.imageButton} onPress={pickImageCamera}>
              <Ionicons name="camera-outline" size={20} color={COLORS.primaryText} />
              <Text style={styles.imageButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageButton} onPress={pickImageGallery}>
              <Ionicons name="images-outline" size={20} color={COLORS.primaryText} />
              <Text style={styles.imageButtonText}>From Gallery</Text>
            </TouchableOpacity>
          </View>
          
          {/* 3. Bilgi Giriş Formu */}
          <View style={styles.formContainer}>
            <Text style={styles.label}>Category</Text>
            <TextInput style={styles.input} placeholder="e.g., Top, Bottom, Shoes" placeholderTextColor={COLORS.gray} value={category} onChangeText={setCategory} />
            <Text style={styles.label}>Color</Text>
            <TextInput style={styles.input} placeholder="e.g., Blue, White, Black" placeholderTextColor={COLORS.gray} value={color} onChangeText={setColor} />
            <Text style={styles.label}>Season</Text>
            <TextInput style={styles.input} placeholder="e.g., Summer, Winter, All" placeholderTextColor={COLORS.gray} value={season} onChangeText={setSeason} />
          </View>
          
          {/* 4. Kaydet Butonu */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Item</Text>
          </TouchableOpacity>
          <View style={{ height: 30 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

// --- STİLLER GÜNCELLENDİ ---
const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  imagePickerContainer: {
    height: 300,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    // YENİ: Solid başlığın hemen altında başlaması için
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: COLORS.gray,
    fontSize: 18,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: 'transparent',
  },
  imageButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary, 
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  imageButtonText: {
    color: COLORS.primaryText, 
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  formContainer: { padding: 20 },
  label: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: COLORS.card,
    color: COLORS.textPrimary,
  },
  saveButton: {
    backgroundColor: COLORS.primary, 
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.primaryText, 
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddClothingScreen;
