import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../colors';
// import { useHeaderHeight } from '@react-navigation/elements'; // <-- SİLİNDİ

const AVAILABLE_STYLES = ['Casual', 'Minimalist', 'Streetwear', 'Boho', 'Vintage', 'Formal', 'Sporty'];
const AVAILABLE_COLORS = [
    COLORS.primary, COLORS.secondary, '#d1c4e9', '#FF6B6B',
    '#4ECDC4', '#F9E79F', '#34495E', '#E74C3C', '#2ECC71',
];
const currentSelections = {
    colors: [COLORS.primary, COLORS.secondary, '#d1c4e9'],
    styles: ['Casual', 'Minimalist'],
};

const EditStyleScreen = ({ navigation }) => {
    const [selectedColors, setSelectedColors] = useState(currentSelections.colors);
    const [selectedStyles, setSelectedStyles] = useState(currentSelections.styles);

    // ... (toggleColor, toggleStyle, handleSave fonksiyonları aynı)
    const toggleColor = (color) => {
        const isSelected = selectedColors.includes(color);
        if (isSelected) {
            setSelectedColors(selectedColors.filter(c => c !== color));
        } else {
            if (selectedColors.length < 3) {
                setSelectedColors([...selectedColors, color]);
            } else {
                Alert.alert("Max 3 Colors", "You can only select up to 3 favorite colors.");
            }
        }
    };
    const toggleStyle = (style) => {
        const isSelected = selectedStyles.includes(style);
        if (isSelected) {
            setSelectedStyles(selectedStyles.filter(s => s !== style));
        } else {
            setSelectedStyles([...selectedStyles, style]);
        }
    };
    const handleSave = () => {
        console.log('Yeni Stiller:', { selectedStyles, selectedColors });
        navigation.goBack();
    };
    
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
                    <View style={styles.section}>
                        <Text style={styles.title}>Favorite Colors (Select up to 3)</Text>
                        <View style={styles.gridContainer}>
                            {AVAILABLE_COLORS.map((color) => {
                                const isSelected = selectedColors.includes(color);
                                return (
                                    <TouchableOpacity
                                        key={color} 
                                        style={[styles.colorBox, { backgroundColor: color }]}
                                        onPress={() => toggleColor(color)}
                                    >
                                        {isSelected && <Text style={styles.checkMark}>✓</Text>}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.title}>Style Preferences</Text>
                        <View style={styles.gridContainer}>
                            {AVAILABLE_STYLES.map((style) => {
                                const isSelected = selectedStyles.includes(style);
                                return (
                                    <TouchableOpacity
                                        key={style} 
                                        style={[styles.tag, isSelected ? styles.tagSelected : styles.tagDefault]}
                                        onPress={() => toggleStyle(style)}
                                    >
                                        <Text style={isSelected ? styles.tagTextSelected : styles.tagTextDefault}>
                                            {style}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
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

// --- STİLLER GÜNCELLENDİ ---
const styles = StyleSheet.create({
    gradient: { flex: 1 },
    container: { flex: 1 },
    section: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        // YENİ: İlk bölüme başlık için 10px boşluk
        paddingTop: 10, 
        borderBottomWidth: 1,
        borderBottomColor: COLORS.secondary,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 20,
        // YENİ: İkinci bölümün başlığı için de 10px boşluk
        paddingTop: 10, 
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    colorBox: {
        width: 60,
        height: 60,
        borderRadius: 10,
        margin: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.secondary,
    },
    checkMark: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
    },
    tag: {
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        margin: 6,
        borderWidth: 1,
    },
    tagDefault: {
        backgroundColor: COLORS.card,
        borderColor: COLORS.secondary,
    },
    tagSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    tagTextDefault: { color: COLORS.textPrimary },
    tagTextSelected: {
        color: COLORS.primaryText,
        fontWeight: 'bold',
    },
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

export default EditStyleScreen;
