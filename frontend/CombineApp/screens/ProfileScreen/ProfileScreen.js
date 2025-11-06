import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../colors';
import { Ionicons } from '@expo/vector-icons';
// useHeaderHeight'a artık gerek yok

// Simülasyon verisi (Aynı)
const userProfile = {
    name: 'Elisa Yıldırım',
    location: 'Istanbul, TR',
    profileImageUrl: 'https://via.placeholder.com/150/FFFFFF/1B1229?text=User',
    favoriteColors: [COLORS.primary, COLORS.secondary, '#d1c4e9'],
    stylePreferences: ['Casual', 'Minimalist'],
    importantDates: [
        { id: 1, title: 'Doğum Günü', date: '2025-11-20' },
        { id: 2, title: 'Proje Sunumu', date: '2025-12-15' },
    ]
};
// Menü ve Renk bileşenleri (Aynı)
const ProfileMenuItem = ({ title, iconName, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.menuItemContent}>
            <Ionicons name={iconName} size={22} color={COLORS.primary} />
            <Text style={styles.menuItemText}>{title}</Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={22} color={COLORS.gray} />
    </TouchableOpacity>
);
const ColorCircle = ({ color }) => (
    <View style={[styles.colorCircle, { backgroundColor: color }]} />
);


const ProfileScreen = ({ navigation }) => {
    const onSettingsPress = () => navigation.navigate('Settings');
    const onStatsPress = () => navigation.navigate('Statistics');

    return (
        <LinearGradient
            colors={COLORS.gradient}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.header}>
                        <Image
                            source={{ uri: userProfile.profileImageUrl }}
                            style={styles.profileImage}
                        />
                        <Text style={styles.profileName}>{userProfile.name}</Text>
                        <Text style={styles.profileLocation}>{userProfile.location}</Text>
                    </View>
                    <View style={styles.menuContainer}>
                        <ProfileMenuItem
                            title="Statistics"
                            iconName="pie-chart-outline"
                            onPress={onStatsPress}
                        />
                        <ProfileMenuItem
                            title="Settings"
                            iconName="settings-outline"
                            onPress={onSettingsPress}
                        />
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoTitle}>Favorite Colors</Text>
                        <View style={styles.colorContainer}>
                            {userProfile.favoriteColors.map((color, index) => (
                                <ColorCircle key={index} color={color} />
                            ))}
                        </View>
                        <Text style={styles.infoTitle}>Style Preferences</Text>
                        <View style={styles.styleContainer}>
                            {userProfile.stylePreferences.map((style, index) => (
                                <View key={index} style={styles.styleTag}>
                                    <Text style={styles.styleTagText}>{style}</Text>
                                </View>
                            ))}
                        </View>
                        <Text style={styles.infoTitle}>Important Dates</Text>
                        {userProfile.importantDates.map((date) => (
                            <View key={date.id} style={styles.dateItem}>
                                <Text style={styles.dateTitle}>{date.title}</Text>
                                <Text style={styles.dateText}>{date.date}</Text>
                            </View>
                        ))}
                    </View>
                    <View style={{ height: 30 }} />
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

// --- STİLLER GÜNCELLENDİ (VE TEMİZLENDİ) ---
const styles = StyleSheet.create({
    gradient: { flex: 1 },
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: 'transparent',
        alignItems: 'center',
        // YENİ: Başlık ile resim arasına çok az boşluk (10px)
        paddingTop: 10, 
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: COLORS.primary,
        marginBottom: 10,
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    profileLocation: {
        fontSize: 16,
        color: COLORS.textSecondary,
        paddingBottom: 10,
    },
    menuContainer: {
        marginTop: 20,
        marginHorizontal: 10,
        backgroundColor: COLORS.card,
        borderRadius: 10,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.secondary,
    },
    menuItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemText: {
        fontSize: 18,
        color: COLORS.textPrimary,
        marginLeft: 15,
    },
    infoContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    infoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 15,
    },
    colorContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    colorCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: COLORS.card,
        marginRight: 10,
    },
    styleContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    styleTag: {
        backgroundColor: COLORS.primary,
        borderRadius: 15,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginRight: 8,
        marginBottom: 8,
    },
    styleTagText: {
        color: COLORS.primaryText,
        fontWeight: 'bold',
    },
    dateItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.secondary,
    },
    dateTitle: {
        fontSize: 16,
        color: COLORS.textPrimary,
    },
    dateText: {
        fontSize: 16,
        color: COLORS.textSecondary,
    }
});

export default ProfileScreen;
