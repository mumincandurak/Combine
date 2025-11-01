import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Alert,
    TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
// import { useHeaderHeight } from '@react-navigation/elements'; // <-- SİLİNDİ

const initialDates = [
    { id: '1', title: 'Doğum Günü', date: '2025-11-20' },
    { id: '2', title: 'Proje Sunumu', date: '2025-12-15' },
];

const EditDatesScreen = ({ navigation }) => {
    const [dates, setDates] = useState(initialDates);
    const [newTitle, setNewTitle] = useState('');
    const [newDate, setNewDate] = useState('');

    // ... (handleAddDate, handleDeleteDate fonksiyonları aynı)
    const handleAddDate = () => {
        if (!newTitle || !newDate) {
            Alert.alert('Eksik Bilgi', 'Lütfen hem başlık hem de tarih girin.');
            return;
        }
        const newDateObject = { id: Math.random().toString(), title: newTitle, date: newDate };
        setDates([...dates, newDateObject]);
        setNewTitle('');
        setNewDate('');
    };
    const handleDeleteDate = (idToDelete) => {
        Alert.alert('Tarihi Sil', 'Bu tarihi silmek istediğinizden emin misiniz?', [
            { text: 'İptal', style: 'cancel' },
            { text: 'Sil', style: 'destructive', onPress: () => setDates(dates.filter(date => date.id !== idToDelete)) }
        ]);
    };

    const renderDateItem = ({ item }) => (
        <View style={styles.dateItem}>
            <View>
                <Text style={styles.dateTitle}>{item.title}</Text>
                <Text style={styles.dateText}>{item.date}</Text>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteDate(item.id)}>
                <Ionicons name="trash-bin-outline" size={20} color={'#E74C3C'} />
            </TouchableOpacity>
        </View>
    );

    // const headerHeight = useHeaderHeight(); // <-- SİLİNDİ

    return (
        <LinearGradient
            colors={COLORS.gradient} 
            style={styles.gradient}
        >
            <SafeAreaView style={styles.container}>
                {/* 1. Yeni Tarih Ekleme Formu */}
                <View style={styles.formContainer}>
                    <Text style={styles.formTitle}>Add New Date</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Title (e.g., Birthday)"
                        placeholderTextColor={COLORS.gray}
                        value={newTitle}
                        onChangeText={setNewTitle}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Date (YYYY-MM-DD)"
                        placeholderTextColor={COLORS.gray}
                        value={newDate}
                        onChangeText={setNewDate}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={handleAddDate}>
                        <Text style={styles.addButtonText}>Add Date</Text>
                    </TouchableOpacity>
                </View>
                
                {/* 2. Mevcut Tarihlerin Listesi */}
                <FlatList
                    data={dates}
                    renderItem={renderDateItem}
                    keyExtractor={item => item.id}
                    style={styles.list}
                />
            </SafeAreaView>
        </LinearGradient>
    );
};

// --- STİLLER GÜNCELLENDİ ---
const styles = StyleSheet.create({
    gradient: { flex: 1 },
    container: { flex: 1 },
    formContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20, // Alt boşluk
        // YENİ: Solid başlığın hemen altında başlaması için
        paddingTop: 10, 
        backgroundColor: COLORS.secondary, // Formu ayırmak için ikincil renk
        borderBottomWidth: 1,
        borderBottomColor: COLORS.secondary,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 10,
    },
    input: {
        backgroundColor: COLORS.card,
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 10,
        borderColor: COLORS.secondary,
        borderWidth: 1,
        color: COLORS.textPrimary,
    },
    addButton: {
        backgroundColor: COLORS.primary, 
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    addButtonText: {
        color: COLORS.primaryText, 
        fontWeight: 'bold',
        fontSize: 16,
    },
    list: { flex: 1 },
    dateItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.secondary,
    },
    dateTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    dateText: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    deleteButton: { padding: 5 },
});

export default EditDatesScreen;