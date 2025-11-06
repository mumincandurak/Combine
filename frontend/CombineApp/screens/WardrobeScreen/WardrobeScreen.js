import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../colors';
import { Ionicons } from '@expo/vector-icons';
// import { useHeaderHeight } from '@react-navigation/elements'; // <-- SİLİNDİ

const dummyWardrobeData = [
    { id: '1', category: 'Top', color: 'White', season: 'Summer', imageUrl: 'https://via.placeholder.com/100/FFFFFF/1B1229?text=T-Shirt' },
    { id: '2', category: 'Bottom', color: 'Blue', season: 'All', imageUrl: 'https://via.placeholder.com/100/3498db/FFFFFF?text=Jeans' },
    { id: '3', category: 'Shoes', color: 'Black', season: 'Winter', imageUrl: 'https://via.placeholder.com/100/000000/FFFFFF?text=Boots' },
];

const ClothingCard = ({ item, onDelete, onEdit }) => (
    <View style={styles.card}>
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
        <View style={styles.cardInfo}>
            <Text style={styles.cardCategory}>{item.category}</Text>
            <Text style={styles.cardDetails}>{item.color} / {item.season}</Text>
        </View>
        <View style={styles.cardActions}>
            <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
                <Ionicons name="pencil" size={20} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
                <Ionicons name="trash-bin" size={20} color={'#E74C3C'} />
            </TouchableOpacity>
        </View>
    </View>
);

const WardrobeScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [clothes, setClothes] = useState(dummyWardrobeData);

    // ... (handleDelete, handleEdit, handleAddPhoto fonksiyonları aynı)
    const handleDelete = (idToDelete) => {
        Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => setClothes(clothes.filter(item => item.id !== idToDelete)) },
        ]);
    };
    const handleEdit = (item) => console.log('Düzenlenecek:', item);
    const handleAddPhoto = () => navigation.navigate('AddClothing');

    // const headerHeight = useHeaderHeight(); // <-- SİLİNDİ

    return (
        <LinearGradient
            colors={COLORS.gradient} 
            style={styles.gradient}
        >
            <SafeAreaView style={styles.container}>
                {/* 1. Arama Çubuğu (Kaymıyor) */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search in your wardrobe..."
                        placeholderTextColor={COLORS.gray}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <TouchableOpacity style={styles.filterButton}>
                        <Ionicons name="filter" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>
                
                {/* 2. Liste (Kayar) */}
                <FlatList
                    data={clothes}
                    renderItem={({ item }) => (
                        <ClothingCard
                            item={item}
                            onDelete={() => handleDelete(item.id)}
                            onEdit={() => handleEdit(item)}
                        />
                    )}
                    keyExtractor={item => item.id}
                    style={styles.list}
                    contentContainerStyle={{ paddingBottom: 80 }} // FAB için
                />
                
                <TouchableOpacity style={styles.fab} onPress={handleAddPhoto}>
                    <Ionicons name="add" size={32} color={COLORS.primaryText} />
                </TouchableOpacity>
            </SafeAreaView>
        </LinearGradient>
    );
};

// --- STİLLER GÜNCELLENDİ ---
const styles = StyleSheet.create({
    gradient: { flex: 1 },
    container: { flex: 1 },
    searchContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingBottom: 10, // Alt boşluk
        // YENİ: Solid başlığın hemen altında başlaması için
        paddingTop: 10, 
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.secondary,
    },
    searchInput: {
        flex: 1,
        height: 40,
        backgroundColor: COLORS.card,
        borderRadius: 20,
        paddingHorizontal: 15,
        marginRight: 10,
        fontSize: 16,
        color: COLORS.textPrimary,
    },
    filterButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: { flex: 1 },
    card: {
        flexDirection: 'row',
        backgroundColor: COLORS.card,
        marginHorizontal: 10,
        marginTop: 10,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.secondary,
        alignItems: 'center',
    },
    cardImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: COLORS.secondary,
    },
    cardInfo: {
        flex: 1,
        marginLeft: 15,
    },
    cardCategory: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    cardDetails: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    cardActions: { flexDirection: 'row' },
    actionButton: {
        padding: 5,
        marginLeft: 10,
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primary, 
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
    },
});

export default WardrobeScreen;
