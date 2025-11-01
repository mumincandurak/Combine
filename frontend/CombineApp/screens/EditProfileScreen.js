import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
// import { useHeaderHeight } from '@react-navigation/elements'; // <-- SİLİNDİ

const currentUser = {
    name: 'Elisa Yıldırım',
    location: 'Istanbul, TR',
    profileImageUrl: 'https://via.placeholder.com/150/FFFFFF/1B1229?text=User',
};

const EditProfileScreen = ({ navigation }) => {
    const [name, setName] = useState(currentUser.name);
    const [location, setLocation] = useState(currentUser.location);
    const [imageUri, setImageUri] = useState(currentUser.profileImageUrl);

    const handleSave = () => {
        console.log('Değişiklikler Kaydedildi:', { name, location, imageUri });
        navigation.goBack();
    };

    const handleChangePhoto = () => {
        console.log("Fotoğraf Değiştir tıklandı!");
        setImageUri('https://via.placeholder.com/150/92c952/1B1229?text=New');
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
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: imageUri }} style={styles.profileImage} />
                        <TouchableOpacity onPress={handleChangePhoto}>
                            <Text style={styles.changePhotoText}>Change Photo</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.formContainer}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Your Name"
                            placeholderTextColor={COLORS.gray}
                        />
                        <Text style={styles.label}>Location</Text>
                        <TextInput
                            style={styles.input}
                            value={location}
                            onChangeText={setLocation}
                            placeholder="City, Country"
                            placeholderTextColor={COLORS.gray}
                        />
                    </View>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
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
    imageContainer: {
        alignItems: 'center',
        // paddingVertical: 30, // <-- ESKİ
        paddingTop: 10, // YENİ: Başlık ile resim arası 10px (ProfileScreen gibi)
        paddingBottom: 20, // Alt boşluk
        backgroundColor: 'transparent',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: COLORS.primary,
        marginBottom: 10,
    },
    changePhotoText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    formContainer: { padding: 20 },
    label: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 5,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: COLORS.card,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 20,
        color: COLORS.textPrimary,
        borderWidth: 1,
        borderColor: COLORS.secondary,
    },
    saveButton: {
        backgroundColor: COLORS.primary, // GÜNCEL lila
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        marginHorizontal: 20,
        marginTop: 10,
    },
    saveButtonText: {
        color: COLORS.primaryText, // GÜNCEL siyah yazı
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default EditProfileScreen;