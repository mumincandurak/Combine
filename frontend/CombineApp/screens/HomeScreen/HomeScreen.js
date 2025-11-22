import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../colors';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useAuth } from '../../context/AuthContext';
import { getWeatherByCoords } from '../../api/weather';
import { getOutfitSuggestion, likeOutfit, dislikeOutfit } from '../../api/outfits';
import ClothingCard from '../../components/ClothingCard';
import ClothingDetailModal from '../../components/ClothingDetailModal'; // İthal et


const WeatherCard = ({ weather }) => {
    if (!weather) {
        return (
            <View style={styles.weatherCard}>
                <ActivityIndicator color={COLORS.textPrimary} />
                <Text style={styles.weatherLoadingText}>Fetching weather...</Text>
            </View>
        );
    }

    return (
        <View style={styles.weatherCard}>
            <Ionicons name={`${weather.icon}-outline`} size={40} color={COLORS.textPrimary} />
            <View style={styles.weatherInfo}>
                <Text style={styles.weatherLocation}>{weather.location}</Text>
                <Text style={styles.weatherCondition}>{weather.condition}</Text>
            </View>
            <Text style={styles.temperature}>{weather.temperature}°C</Text>
        </View>
    );
};

const HomeScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [weather, setWeather] = useState(null);
    const [outfit, setOutfit] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modal state ve handler'ları
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleCardLongPress = (item) => {
        setSelectedItem(item);
        setDetailModalVisible(true);
    };

    const handleCloseDetailModal = () => {
        setDetailModalVisible(false);
        setSelectedItem(null);
    };

    const handleLike = async () => {
        if (!outfit) return;
        console.log('Outfit Liked:', outfit.id);
        // TODO: API'ye beğenme isteği gönderilecek.
        // await likeOutfit(outfit.id); 
        // Beğenme işleminden sonra yeni bir kombin getir:
        fetchAllData();
    };

    const fetchAllData = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Please grant location permission for weather and suggestions.');
                setLoading(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            const weatherResponse = await getWeatherByCoords(latitude, longitude);

            if (weatherResponse.success) {
                const current_weather = weatherResponse.data;
                setWeather(current_weather);

                const outfitResponse = await getOutfitSuggestion({ user, weather: current_weather });
                if (outfitResponse.success) {
                    setOutfit(outfitResponse.data);
                } else {
                    Alert.alert('Suggestion Error', 'Could not fetch an outfit suggestion.');
                }
            } else {
                Alert.alert('Weather Error', 'Could not fetch weather data.');
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
            Alert.alert('Error', 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    }, [user]); // user değiştiğinde fonksiyon yeniden oluşturulur.

    const handleDislike = async () => {
        if (!outfit) return;
        console.log('Outfit Disliked:', outfit.id);
        // TODO: API'ye beğenmeme isteği gönderilecek.
        // await dislikeOutfit(outfit.id);
        // Beğenmeme işleminden sonra yeni bir kombin getir:
        fetchAllData();
    };

    useEffect(() => {
        // Bileşen ilk yüklendiğinde ve fetchAllData fonksiyonu (yani user) değiştiğinde verileri çek.
        if (user) {
            fetchAllData();
        }
    }, [user, fetchAllData]);

    return (
        <LinearGradient
            colors={COLORS.gradient}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.header}>
                        <Text style={styles.greeting}>Good Morning, {user?.name.split(' ')[0]}</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Settings')}
                        >
                            <Ionicons name="settings-outline" size={24} color={COLORS.textPrimary} />
                        </TouchableOpacity>
                    </View>

                    <WeatherCard weather={weather} />

                    <View style={styles.suggestionHeader}>
                        <Text style={styles.sectionTitle}>Today's Outfit Suggestion</Text>
                    </View>

                    <View style={styles.gridContainer}>
                        {loading || !outfit ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={COLORS.primary} />
                                <Text style={styles.loadingText}>Finding the perfect outfit for you...</Text>
                            </View>
                        ) : (
                            <View style={styles.grid}>
                                {outfit.items.map(item => (
                                    <View style={styles.gridItem} key={item.id}>
                                        <ClothingCard
                                            item={item}
                                            onCardLongPress={() => handleCardLongPress(item)}
                                        />
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                    <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                            <Ionicons name="thumbs-up-outline" size={24} color={COLORS.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} onPress={fetchAllData}>
                            <Ionicons name="refresh-outline" size={24} color={COLORS.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} onPress={handleDislike}>
                            <Ionicons name="thumbs-down-outline" size={24} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <ClothingDetailModal
                    visible={detailModalVisible}
                    item={selectedItem}
                    onClose={handleCloseDetailModal}
                    season={outfit?.season}
                    colors={outfit?.colors}
                />
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    weatherCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.secondary,
        borderRadius: 20,
        padding: 20,
        margin: 20,
        minHeight: 90,
    },
    weatherLoadingText: {
        marginLeft: 15,
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    weatherInfo: {
        flex: 1,
        marginLeft: 15,
    },
    weatherLocation: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    weatherCondition: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    temperature: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    gridContainer: {
        paddingHorizontal: 10, // Kenar boşluğunu azalt
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 5, // Boşluğu azalt
        paddingHorizontal: 10, // gridContainer'a uyum sağla
    },
    suggestionHeader: {
        paddingHorizontal: 10,
        marginTop: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        // justifyContent kaldırıldı, item'lar kendi genişliğini alacak
    },
    gridItem: {
        width: '50%', // Her item %50 genişlikte
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
    },
    actionButton: {
        backgroundColor: COLORS.card,
        padding: 15,
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: COLORS.textSecondary,
        fontSize: 16,
    }
});

export default HomeScreen;
