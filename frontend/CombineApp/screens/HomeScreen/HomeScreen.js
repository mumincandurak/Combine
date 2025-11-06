import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../colors';
import { Ionicons } from '@expo/vector-icons';

// --- SİMÜLASYON VERİSİ ---
const suggestedOutfit = [
    { id: '1', name: 'Jacket', category: 'Outwear', imageUrl: 'https://i.imgur.com/S10fR6S.png' },
    { id: '2', name: 'Finn T-shirt', category: 'Top', imageUrl: 'https://i.imgur.com/3N26uJq.png' },
    { id: '3', name: 'Dark Jeans', category: 'Bottom', imageUrl: 'https://i.imgur.com/eBv6p1X.png' },
    { id: '4', name: 'White Sneakers', category: 'Outwear', imageUrl: 'https://i.imgur.com/t7i3d2c.png' },
];
const weatherData = {
    location: 'Istanbul, TR',
    temperature: 15,
    condition: 'Partly Cloudy',
    icon: 'partly-sunny-outline',
};
// --- SİMÜLASYON VERİSİ SONU ---

const OutfitGridCard = ({ item }) => (
    <View style={styles.gridCard}>
        <Image source={{ uri: item.imageUrl }} style={styles.gridImage} />
        <Text style={styles.gridItemName}>{item.name}</Text>
        <Text style={styles.gridItemCategory}>{item.category}</Text>
    </View>
);

const HomeScreen = ({ navigation }) => {
    return (
        <LinearGradient
            colors={COLORS.gradient} // 5'li GÜNCEL gradient
            style={styles.gradient}
        >
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.header}>
                        <Text style={styles.greeting}>Good Morning</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Profile', { screen: 'Settings' })}
                        >
                            <Ionicons name="settings-outline" size={24} color={COLORS.textPrimary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.weatherCard}>
                        <Ionicons name={weatherData.icon} size={40} color={COLORS.textPrimary} />
                        <View style={styles.weatherInfo}>
                            <Text style={styles.weatherLocation}>{weatherData.location}</Text>
                            <Text style={styles.weatherCondition}>{weatherData.condition}</Text>
                        </View>
                        <Text style={styles.temperature}>{weatherData.temperature}°C</Text>
                    </View>
                    <View style={styles.gridContainer}>
                        <Text style={styles.sectionTitle}>Today's Outfit</Text>
                        <View style={styles.grid}>
                            {suggestedOutfit.map(item => (
                                <OutfitGridCard key={item.id} item={item} />
                            ))}
                        </View>
                    </View>
                    <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="thumbs-up" size={24} color={COLORS.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="thumbs-down" size={24} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
        fontSize: 28,
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
        paddingHorizontal: 20,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 15,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridCard: {
        width: '48%',
        backgroundColor: COLORS.card,
        borderRadius: 15,
        padding: 10,
        marginBottom: 15,
    },
    gridImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    gridItemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    gridItemCategory: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
    },
    actionButton: {
        backgroundColor: COLORS.card,
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 25,
    },
});

export default HomeScreen;
