import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { PieChart } from 'react-native-chart-kit';
import { COLORS } from '../colors';
// import { useHeaderHeight } from '@react-navigation/elements'; // <-- SİLİNDİ

// --- SİMÜLASYON VERİSİ ---
// Yüksek kontrastlı renkler (Aynı)
const statsData = [
    { name: 'Tops', count: 35, color: '#B13BFF' }, // Açık Lila
    { name: 'Bottoms', count: 20, color: '#1abc9c' }, // Turkuaz
    { name: 'Shoes', count: 15, color: '#f1c40f' }, // Sarı
    { name: 'Accessories', count: 30, color: '#e74c3c' }, // Kırmızı
];
const totalItems = statsData.reduce((sum, item) => sum + item.count, 0);
const screenWidth = Dimensions.get('window').width;

// Koyu tema için grafik ayarları (Aynı)
const chartConfig = {
    backgroundGradientFrom: COLORS.card,
    backgroundGradientTo: COLORS.card,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: { borderRadius: 16 },
};

// Açıklama bileşeni (Aynı)
const LegendItem = ({ color, name, count }) => (
    <View style={styles.legendItem}>
        <View style={[styles.legendColorBox, { backgroundColor: color }]} />
        <Text style={styles.legendText}>{name} ({count})</Text>
    </View>
);
// --- SİMÜLASYON VERİSİ SONU ---

const StatisticsScreen = () => {
    const chartKitData = statsData.map(item => ({
        ...item,
        legendFontColor: COLORS.textPrimary,
        legendFontSize: 14,
    }));

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
                    {/* 1. Toplam Parça Sayısı */}
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalCount}>{totalItems}</Text>
                        <Text style={styles.totalLabel}>Total Items in Wardrobe</Text>
                    </View>

                    {/* 2. Pasta Grafik */}
                    <View style={styles.chartContainer}>
                        <Text style={styles.chartTitle}>Category Distribution</Text>
                        <PieChart
                            data={chartKitData}
                            width={screenWidth - 40}
                            height={220}
                            chartConfig={chartConfig}
                            accessor="count"
                            backgroundColor="transparent"
                            paddingLeft="15"
                            absolute
                            hasLegend={false} 
                        />
                    </View>

                    {/* 3. Kendi Açıklamalarımız (Legend) */}
                    <View style={styles.legendContainer}>
                        {statsData.map(item => (
                            <LegendItem
                                key={item.name}
                                color={item.color}
                                name={item.name}
                                count={item.count}
                            />
                        ))}
                    </View>
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
    totalContainer: {
        backgroundColor: COLORS.primary,
        padding: 30,
        alignItems: 'center',
        // YENİ: Solid başlığın hemen altında başlaması için
        marginTop: 10,
        marginHorizontal: 10, 
        borderRadius: 10, 
    },
    totalCount: {
        fontSize: 48,
        fontWeight: 'bold',
        color: COLORS.primaryText, // Siyah yazı
    },
    totalLabel: {
        fontSize: 18,
        color: COLORS.primaryText, // Siyah yazı
        opacity: 0.8,
    },
    chartContainer: {
        marginTop: 20, 
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: COLORS.card,
        borderRadius: 16,
        margin: 10, 
        paddingVertical: 20,
    },
    chartTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 15,
    },
    legendContainer: {
        paddingHorizontal: 30,
        marginTop: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    legendColorBox: {
        width: 20,
        height: 20,
        borderRadius: 5,
        marginRight: 10,
    },
    legendText: {
        fontSize: 16,
        color: COLORS.textPrimary,
    },
});

export default StatisticsScreen;
