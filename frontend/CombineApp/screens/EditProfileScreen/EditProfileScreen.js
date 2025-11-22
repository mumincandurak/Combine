import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../colors';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';

const EditProfileScreen = ({ navigation }) => {
    const { user, updateUser } = useAuth();

    const [name, setName] = useState(user.name);
    const [location, setLocation] = useState(user.location);
    const [imageUri, setImageUri] = useState(user.profileImageUrl);

    const handleSave = () => {
        updateUser({
            name,
            location,
            profileImageUrl: imageUri,
        });
        Alert.alert('Success', 'Your profile has been updated.', [
            { text: 'OK', onPress: () => navigation.goBack() }
        ]);
    };

    const handleChangePhoto = async () => {
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
            // Gerçek uygulamada bu resmi bir bulut depolama servisine yükleyip
            // URL'i almanız gerekir. Şimdilik yerel URI'ı kullanıyoruz.
            setImageUri(result.assets[0].uri);
        }
    };

    return (
        <LinearGradient
            colors={COLORS.gradient}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.container}>
                <ScrollView>
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

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    container: { flex: 1 },
    imageContainer: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 20,
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
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        marginHorizontal: 20,
        marginTop: 10,
    },
    saveButtonText: {
        color: COLORS.primaryText,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default EditProfileScreen;
