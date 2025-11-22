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
import { COLORS } from '../colors';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext'; // AuthContext'i içeri aktar

const EditDatesScreen = ({ navigation }) => {
    const { user, updateUser } = useAuth(); // Context'ten user ve updateUser'ı al

    // State'i context'teki kullanıcı verisiyle başlat
    const [dates, setDates] = useState(user.importantDates || []);
    const [newTitle, setNewTitle] = useState('');
    const [newDate, setNewDate] = useState('');

    const handleAddDate = () => {
        if (!newTitle || !newDate) {
            Alert.alert('Missing Information', 'Please enter both a title and a date.');
            return;
        }
        // YYYY-MM-DD formatını basitçe kontrol et
        if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
            Alert.alert('Invalid Format', 'Please use YYYY-MM-DD format for the date.');
            return;
        }
        const newDateObject = { id: Math.random().toString(), title: newTitle, date: newDate };
        setDates([...dates, newDateObject]);
        setNewTitle('');
        setNewDate('');
    };

    const handleDeleteDate = (idToDelete) => {
        Alert.alert('Delete Date', 'Are you sure you want to delete this date?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => setDates(dates.filter(date => date.id !== idToDelete)) }
        ]);
    };

    const handleSave = () => {
        // Değişiklikleri context üzerinden merkezi state'e kaydet
        updateUser({ importantDates: dates });
        Alert.alert('Success', 'Your important dates have been updated.', [
            { text: 'OK', onPress: () => navigation.goBack() }
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

    return (
        <LinearGradient
            colors={COLORS.gradient} 
            style={styles.gradient}
        >
            <SafeAreaView style={styles.container}>
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
                        <Text style={styles.addButtonText}>Add Date to List</Text>
                    </TouchableOpacity>
                </View>
                
                <FlatList
                    data={dates}
                    renderItem={renderDateItem}
                    keyExtractor={item => item.id}
                    style={styles.list}
                    ListFooterComponent={
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        </TouchableOpacity>
                    }
                />
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    container: { flex: 1 },
    formContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 10, 
        backgroundColor: 'rgba(0,0,0,0.1)',
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
    saveButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        margin: 20,
    },
    saveButtonText: {
        color: COLORS.primaryText,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default EditDatesScreen;
