
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../colors";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../context/AuthContext";

const EditProfileScreen = ({ navigation }) => {
    const { user, updateUser } = useAuth();

    const [name, setName] = useState(user?.name || "");
    const [country, setCountry] = useState(user?.country || "");
    const [city, setCity] = useState(user?.city || "");
    const [neighborhood, setNeighborhood] = useState(user?.neighborhood || "");
    const [imageUri, setImageUri] = useState(user?.profileImageUrl || "");

    useEffect(() => {
        setName(user?.name || "");
        setCountry(user?.country || "");
        setCity(user?.city || "");
        setNeighborhood(user?.neighborhood || "");
        setImageUri(user?.profileImageUrl || "");
    }, [user]);

    const handleSave = () => {
        updateUser({
            name,
            country,
            city,
            neighborhood,
            profileImageUrl: imageUri,
        });
        Alert.alert("Success", "Your profile has been updated.", [
            { text: "OK", onPress: () => navigation.goBack() },
        ]);
    };

    const handleChangePhoto = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Permission Denied",
                "Gallery access permission is required."
            );
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

    const applyDeviceLocation = () => {
        if (!user) return;
        if (user.country) setCountry(user.country);
        if (user.city) setCity(user.city);
        if (user.neighborhood) setNeighborhood(user.neighborhood);
        Alert.alert(
            "Location Applied",
            "Device location has been applied to the form."
        );
    };

    return (
        <LinearGradient colors={COLORS.gradient} style={styles.gradient}>
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.profileImage}
                        />
                        <TouchableOpacity onPress={handleChangePhoto}>
                            <Text style={styles.changePhotoText}>
                                Change Photo
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Your name"
                            placeholderTextColor={COLORS.gray}
                        />

                        <Text style={styles.label}>Country</Text>
                        <TextInput
                            style={styles.input}
                            value={country}
                            onChangeText={setCountry}
                            placeholder="Country"
                            placeholderTextColor={COLORS.gray}
                        />

                        <Text style={styles.label}>City</Text>
                        <TextInput
                            style={styles.input}
                            value={city}
                            onChangeText={setCity}
                            placeholder="City"
                            placeholderTextColor={COLORS.gray}
                        />

                        <Text style={styles.label}>Neighborhood</Text>
                        <TextInput
                            style={styles.input}
                            value={neighborhood}
                            onChangeText={setNeighborhood}
                            placeholder="Neighborhood or district"
                            placeholderTextColor={COLORS.gray}
                        />

                        <TouchableOpacity
                            style={styles.smallButton}
                            onPress={applyDeviceLocation}
                        >
                            <Text style={styles.smallButtonText}>
                                Use Device Location
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                    >
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    container: { flex: 1 },
    imageContainer: {
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 20,
        backgroundColor: "transparent",
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
        fontWeight: "bold",
        color: COLORS.primary,
    },
    formContainer: { padding: 20 },
    label: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 5,
    },
    input: {
        width: "100%",
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
    smallButton: {
        backgroundColor: COLORS.secondary,
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: "center",
        marginBottom: 10,
    },
    smallButtonText: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: "500",
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        marginHorizontal: 20,
        marginTop: 10,
    },
    saveButtonText: {
        color: COLORS.primaryText,
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default EditProfileScreen;
