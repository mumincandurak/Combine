import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  ScrollView,
  ActivityIndicator,
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../colors';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import SelectionModal from '../../components/SelectionModal';
import { CATEGORIES, COLORS_OPTIONS, SEASONS } from '../../constants/options';
import { uploadImageForBgRemoval, saveClothingItem } from '../../api/clothing';

const AddClothingScreen = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState(null);
  const [color, setColor] = useState(null);
  const [season, setSeason] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);
  const [modalOptions, setModalOptions] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [currentSelection, setCurrentSelection] = useState('');

  const pickImageGallery = async () => {
    if (loading) return;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const pickImageCamera = async () => {
    if (loading) return;
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const openModal = (type) => {
    if (loading) return;
    setCurrentSelection(type);
    if (type === 'category') {
      setModalOptions(CATEGORIES);
      setModalTitle('Select Category');
    } else if (type === 'color') {
      setModalOptions(COLORS_OPTIONS);
      setModalTitle('Select Color');
    } else if (type === 'season') {
      setModalOptions(SEASONS);
      setModalTitle('Select Season');
    }
    setModalVisible(true);
  };

  const handleSelect = (option) => {
    if (currentSelection === 'category') {
      setCategory(option);
    } else if (currentSelection === 'color') {
      setColor(option);
    } else if (currentSelection === 'season') {
      setSeason(option);
    }
  };

  const handleSave = async () => {
    if (!imageUri || !name || !category || !color || !season) {
        Alert.alert('Missing Information', 'Please fill out all fields and select an image.');
        return;
    }

    setLoading(true);

    try {
      Alert.alert('Processing', 'Your image is being processed, please wait...');
      const uploadResponse = await uploadImageForBgRemoval(imageUri);

      if (!uploadResponse.success) {
        throw new Error('Failed to process image background.');
      }

      const clothingData = {
        name,
        category: category.value,
        color: color.value,
        season: season.value,
        imageUrl: uploadResponse.imageUrl,
      };

      const saveResponse = await saveClothingItem(clothingData);

      if (!saveResponse.success) {
        throw new Error('Failed to save the item.');
      }

      Alert.alert('Success!', 'Your item has been added to your wardrobe.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);

    } catch (error) {
      Alert.alert('Error', error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const SelectionDisplay = ({ label, value, onPress, placeholder }) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.input} onPress={onPress} disabled={loading}>
        <Text style={value ? styles.inputText : styles.inputPlaceholderText}>
            {value ? value.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={COLORS.gray} />
      </TouchableOpacity>
    </>
  );

  return (
    <LinearGradient colors={COLORS.gradient} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <ScrollView>
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
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.imageButton, loading && styles.disabledButton]} onPress={pickImageCamera} disabled={loading}>
              <Ionicons name="camera-outline" size={20} color={COLORS.primaryText} />
              <Text style={styles.imageButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.imageButton, loading && styles.disabledButton]} onPress={pickImageGallery} disabled={loading}>
              <Ionicons name="images-outline" size={20} color={COLORS.primaryText} />
              <Text style={styles.imageButtonText}>From Gallery</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} placeholder="e.g., Red Jacket, Blue Jeans" placeholderTextColor={COLORS.gray} value={name} onChangeText={setName} editable={!loading} />
            
            <SelectionDisplay label="Category" value={category} onPress={() => openModal('category')} placeholder="Select a category" />
            <SelectionDisplay label="Color" value={color} onPress={() => openModal('color')} placeholder="Select a color" />
            <SelectionDisplay label="Season" value={season} onPress={() => openModal('season')} placeholder="Select a season" />
          </View>
          
          <TouchableOpacity style={[styles.saveButton, loading && styles.disabledButton]} onPress={handleSave} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={COLORS.primaryText} />
            ) : (
              <Text style={styles.saveButtonText}>Save Item</Text>
            )}
          </TouchableOpacity>
          <View style={{ height: 30 }} />
        </ScrollView>
        <SelectionModal 
            visible={isModalVisible}
            options={modalOptions}
            onSelect={handleSelect}
            onClose={() => setModalVisible(false)}
            modalTitle={modalTitle}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  imagePickerContainer: {
    height: 300,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
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
    height: 50,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: COLORS.card,
    color: COLORS.textPrimary,
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  inputPlaceholderText: {
    fontSize: 16,
    color: COLORS.gray,
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
  disabledButton: {
    backgroundColor: COLORS.gray,
  },
});

export default AddClothingScreen;

