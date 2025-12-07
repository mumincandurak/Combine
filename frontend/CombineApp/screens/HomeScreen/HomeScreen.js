import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../colors";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useAuth } from "../../context/AuthContext";
import { getWeatherByCoords } from "../../api/weather";
import {
    getOutfitSuggestion,
    likeOutfit,
    dislikeOutfit,
} from "../../api/outfits";
import ClothingCard from "../../components/ClothingCard";
import ClothingDetailModal from "../../components/ClothingDetailModal";

// --- HAVA DURUMU KARTI BİLEŞENİ ---
const WeatherCard = ({ weather }) => {
    if (!weather) {
        return (
            <View style={styles.weatherCard}>
                <ActivityIndicator color={COLORS.textPrimary} />
                <Text style={styles.weatherLoadingText}>
                    Hava durumu alınıyor...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.weatherCard}>
            <Ionicons
                name={`${weather.icon}-outline`}
                size={40}
                color={COLORS.textPrimary}
            />
            <View style={styles.weatherInfo}>
                <Text style={styles.weatherLocation}>{weather.location}</Text>
                <Text style={styles.weatherCondition}>{weather.condition}</Text>
            </View>
            <Text style={styles.temperature}>{weather.temperature}°C</Text>
        </View>
    );
};

const HomeScreen = ({ navigation }) => {
    const { user, locationUpdated } = useAuth();

    // --- STATE TANIMLAMALARI ---
    const [weather, setWeather] = useState(null);
    const [outfit, setOutfit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processingAction, setProcessingAction] = useState(false);

    // Modal kontrolü
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

    // --- AYARLARA GİTME FONKSİYONU ---
    const handleGoToSettings = () => {
        navigation.navigate("Settings");
    };

    // --- VERİ ÇEKME FONKSİYONU ---
    const fetchAllData = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);

            // Check permission first (do not prompt here; AuthContext handles prompting on app active)
            const perm = await Location.getForegroundPermissionsAsync();
            let coords;

            if (perm.status === "granted") {
                const location = await Location.getCurrentPositionAsync({});
                coords = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                };
            } else {
                // fallback to saved coords in user (set by AuthContext) or default Istanbul coords
                if (
                    user?.coords &&
                    user.coords.latitude &&
                    user.coords.longitude
                ) {
                    coords = { ...user.coords };
                } else {
                    coords = { latitude: 41.0082, longitude: 28.9784 }; // default Istanbul
                    console.log(
                        "Using fallback/default coordinates for weather:",
                        coords
                    );
                }
            }

            console.log("Fetching weather for coordinates:", coords);

            const weatherResponse = await getWeatherByCoords(
                coords.latitude,
                coords.longitude
            );

            if (weatherResponse.success) {
                const current_weather = weatherResponse.data;
                setWeather(current_weather);

                const outfitResponse = await getOutfitSuggestion({
                    user,
                    weather: current_weather,
                });
                if (outfitResponse.success) {
                    setOutfit(outfitResponse.data);
                } else {
                    console.warn("Outfit suggestion failed");
                }
            } else {
                console.warn("Weather fetch failed");
            }
        } catch (error) {
            console.error("Veri çekme hatası:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // --- LIKE İŞLEVİ ---
    const handleLike = async () => {
        if (!outfit || loading || processingAction) return;
        try {
            setProcessingAction(true);
            await likeOutfit(outfit);
            console.log("Kombin Beğenildi:", outfit.id);
            Alert.alert("Beğenildi!", "Bu tarzı tercihlerine kaydettik.");
        } catch (error) {
            console.error("Beğeni hatası:", error);
            Alert.alert("Hata", "İşlem gerçekleştirilemedi.");
        } finally {
            setProcessingAction(false);
        }
    };

    // --- DISLIKE İŞLEVİ ---
    const handleDislike = async () => {
        if (!outfit || loading || processingAction) return;
        try {
            setProcessingAction(true);
            await dislikeOutfit(outfit);
            console.log("Kombin Beğenilmedi:", outfit.id);
            Alert.alert(
                "Not Edildi",
                "Bu tarz kombinleri daha az göstereceğiz."
            );
        } catch (error) {
            console.error("Dislike hatası:", error);
            Alert.alert("Hata", "İşlem gerçekleştirilemedi.");
        } finally {
            setProcessingAction(false);
        }
    };

    // Uygulama açılışında veri çek
    useEffect(() => {
        if (user) {
            fetchAllData();
        }
    }, [user, fetchAllData]);

    // Konum güncellendiğinde veri çek
    useEffect(() => {
        if (user) {
            console.log("Location updated, refreshing weather and outfit...");
            fetchAllData();
        }
    }, [locationUpdated, user, fetchAllData]);

    return (
        <LinearGradient colors={COLORS.gradient} style={styles.gradient}>
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    {/* ÜST BAŞLIK VE AYARLAR BUTONU */}
                    <View style={styles.header}>
                        <Text style={styles.greeting}>
                            Günaydın, {user?.name.split(" ")[0]}
                        </Text>

                        <TouchableOpacity onPress={handleGoToSettings}>
                            <Ionicons
                                name="settings-outline"
                                size={24}
                                color={COLORS.textPrimary}
                            />
                        </TouchableOpacity>
                    </View>

                    <WeatherCard weather={weather} />

                    <View style={styles.suggestionHeader}>
                        <Text style={styles.sectionTitle}>
                            Günün Kombin Önerisi
                        </Text>
                    </View>

                    <View style={styles.gridContainer}>
                        {loading || !outfit ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator
                                    size="large"
                                    color={COLORS.primary}
                                />
                                <Text style={styles.loadingText}>
                                    {loading
                                        ? "Tarzın oluşturuluyor..."
                                        : "Mükemmel kombin aranıyor..."}
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.grid}>
                                {outfit.items.map((item) => (
                                    <View style={styles.gridItem} key={item.id}>
                                        <ClothingCard
                                            item={item}
                                            onCardLongPress={() =>
                                                handleCardLongPress(item)
                                            }
                                        />
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity
                            style={[
                                styles.actionButton,
                                (loading || processingAction) &&
                                    styles.disabledButton,
                            ]}
                            onPress={handleLike}
                            disabled={loading || processingAction}
                        >
                            <Ionicons
                                name="thumbs-up-outline"
                                size={24}
                                color={
                                    loading || processingAction
                                        ? COLORS.gray
                                        : COLORS.primary
                                }
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.actionButton,
                                (loading || processingAction) &&
                                    styles.disabledButton,
                            ]}
                            onPress={fetchAllData}
                            disabled={loading || processingAction}
                        >
                            <Ionicons
                                name="refresh-outline"
                                size={24}
                                color={
                                    loading || processingAction
                                        ? COLORS.gray
                                        : COLORS.primary
                                }
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.actionButton,
                                (loading || processingAction) &&
                                    styles.disabledButton,
                            ]}
                            onPress={handleDislike}
                            disabled={loading || processingAction}
                        >
                            <Ionicons
                                name="thumbs-down-outline"
                                size={24}
                                color={
                                    loading || processingAction
                                        ? COLORS.gray
                                        : COLORS.primary
                                }
                            />
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
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    greeting: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.textPrimary,
    },
    weatherCard: {
        flexDirection: "row",
        alignItems: "center",
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
        fontWeight: "bold",
        color: COLORS.textPrimary,
    },
    weatherCondition: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    temperature: {
        fontSize: 28,
        fontWeight: "bold",
        color: COLORS.textPrimary,
    },
    gridContainer: {
        paddingHorizontal: 10,
        marginTop: 10,
        minHeight: 200,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: COLORS.textPrimary,
        marginBottom: 5,
        paddingHorizontal: 10,
    },
    suggestionHeader: {
        paddingHorizontal: 10,
        marginTop: 20,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    gridItem: {
        width: "50%",
    },
    actionButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 20,
        marginBottom: 20,
    },
    actionButton: {
        backgroundColor: COLORS.card,
        padding: 15,
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
    },
    disabledButton: {
        opacity: 0.5,
    },
    loadingContainer: {
        height: 200,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        color: COLORS.textSecondary,
        fontSize: 16,
    },
});

export default HomeScreen;
