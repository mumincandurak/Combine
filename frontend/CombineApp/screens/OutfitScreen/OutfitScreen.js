import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal, // Added
  TextInput, // Added
  KeyboardAvoidingView, // Added
  Platform, // Added
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS } from "../../colors";

// Helper for Mock Images
const MOCK_IMG = "https://via.placeholder.com/150";

const INITIAL_FAVORITES = [
  {
    id: "1",
    name: "Rainy Tuesday",
    date: "Nov 12",
    items: 3,
    outfitItems: [
      { id: "f1", imageUrl: MOCK_IMG },
      { id: "f2", imageUrl: MOCK_IMG },
      { id: "f3", imageUrl: MOCK_IMG },
    ],
  },
  {
    id: "2",
    name: "Weekend Vibe",
    date: "Nov 14",
    items: 2,
    outfitItems: [
      { id: "f4", imageUrl: MOCK_IMG },
      { id: "f5", imageUrl: MOCK_IMG },
    ],
  },
];

const INITIAL_CUSTOM = [
  {
    id: "101",
    name: "My Birthday Look",
    date: "Oct 20",
    items: 5,
    outfitItems: [],
  },
];

const OutfitScreen = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState("favorites");
  const [customOutfits, setCustomOutfits] = useState(INITIAL_CUSTOM);
  const [favoriteOutfits, setFavoriteOutfits] = useState(INITIAL_FAVORITES);
  const [expandedId, setExpandedId] = useState(null);

  // --- RENAME STATE ---
  const [isRenameModalVisible, setRenameModalVisible] = useState(false);
  const [itemToRename, setItemToRename] = useState(null);
  const [newNameText, setNewNameText] = useState("");

  // --- LISTENING FOR NEW OUTFITS ---
  useFocusEffect(
    useCallback(() => {
      if (route.params?.newOutfit) {
        const newOutfit = route.params.newOutfit;
        setCustomOutfits((prev) => [newOutfit, ...prev]);
        setActiveTab("custom");
        setExpandedId(newOutfit.id);
        navigation.setParams({ newOutfit: null });
      }
    }, [route.params?.newOutfit]),
  );

  const currentData =
    activeTab === "favorites" ? favoriteOutfits : customOutfits;

  const handleCreateOutfit = () => {
    navigation.navigate("CreateOutfit");
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // --- RENAME LOGIC ---
  const openRenameModal = (item) => {
    setItemToRename(item);
    setNewNameText(item.name); // Pre-fill with current name
    setRenameModalVisible(true);
  };

  const handleSaveRename = () => {
    if (!itemToRename || !newNameText.trim()) {
      setRenameModalVisible(false);
      return;
    }

    const updateList = (list) =>
      list.map((item) =>
        item.id === itemToRename.id ? { ...item, name: newNameText } : item,
      );

    // Try to update both lists (since we don't strictly know which one it came from without checking)
    setFavoriteOutfits((prev) => updateList(prev));
    setCustomOutfits((prev) => updateList(prev));

    setRenameModalVisible(false);
    setItemToRename(null);
  };

  const renderOutfitItem = ({ item }) => {
    const isExpanded = expandedId === item.id;

    return (
      <TouchableOpacity
        style={styles.cardContainer}
        activeOpacity={0.9}
        onPress={() => toggleExpand(item.id)}
      >
        {/* HEADER */}
        <View style={styles.cardHeader}>
          <View style={styles.cardImageContainer}>
            <Ionicons
              name="shirt-outline"
              size={30}
              color={COLORS.secondaryText}
            />
          </View>

          <View style={styles.cardInfo}>
            {/* Title Row with Edit Pencil */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.cardTitle}>{item.name}</Text>

              {/* RENAME BUTTON */}
              <TouchableOpacity
                style={styles.renameIconArea}
                onPress={(e) => {
                  e.stopPropagation(); // Prevent card from expanding when clicking pencil
                  openRenameModal(item);
                }}
              >
                <Ionicons name="pencil" size={16} color={COLORS.gray} />
              </TouchableOpacity>
            </View>

            <View style={styles.cardMetaContainer}>
              <Text style={styles.cardDate}>{item.date}</Text>
              <Text style={styles.cardItemCount}>{item.items} Items</Text>
            </View>
          </View>

          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={COLORS.gray}
          />
        </View>

        {/* BODY */}
        {isExpanded && (
          <View style={styles.cardBody}>
            <View style={styles.divider} />
            <Text style={styles.itemsLabel}>Items in this outfit:</Text>

            {item.outfitItems && item.outfitItems.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {item.outfitItems.map((clothing, index) => (
                  <View
                    key={clothing.id || index}
                    style={styles.clothingItemBox}
                  >
                    {clothing.imageUrl &&
                    !clothing.imageUrl.includes("placeholder") ? (
                      <Image
                        source={{ uri: clothing.imageUrl }}
                        style={styles.clothingImage}
                      />
                    ) : (
                      <Ionicons
                        name="shirt"
                        size={24}
                        color={COLORS.secondaryText}
                      />
                    )}
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.noItemsText}>
                No details available for this outfit.
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={COLORS.gradient} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "favorites" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("favorites")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "favorites" && styles.activeTabText,
              ]}
            >
              Favorites
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "custom" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("custom")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "custom" && styles.activeTabText,
              ]}
            >
              My Creations
            </Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        <FlatList
          data={currentData}
          renderItem={renderOutfitItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No outfits yet.</Text>
            </View>
          }
        />

        <TouchableOpacity style={styles.fab} onPress={handleCreateOutfit}>
          <Ionicons name="add" size={32} color={COLORS.white} />
        </TouchableOpacity>

        {/* --- RENAME MODAL --- */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isRenameModalVisible}
          onRequestClose={() => setRenameModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalOverlay}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Rename Outfit</Text>
              <TextInput
                style={styles.modalInput}
                value={newNameText}
                onChangeText={setNewNameText}
                autoFocus={true}
                selectTextOnFocus={true}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.modalBtnCancel]}
                  onPress={() => setRenameModalVisible(false)}
                >
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.modalBtnSave]}
                  onPress={handleSaveRename}
                >
                  <Text
                    style={[styles.modalBtnText, { color: COLORS.primaryText }]}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 15,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  activeTabButton: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 14, fontWeight: "600", color: COLORS.textSecondary },
  activeTabText: { color: COLORS.primaryText },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },

  // --- CARD STYLES ---
  cardContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
    flexDirection: "column",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardImageContainer: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.gradient[0],
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  cardInfo: { flex: 1 },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  renameIconArea: {
    padding: 5,
    marginLeft: 5,
  },
  cardMetaContainer: { flexDirection: "row" },
  cardDate: { fontSize: 12, color: COLORS.textSecondary, marginRight: 10 },
  cardItemCount: { fontSize: 12, color: COLORS.primary, fontWeight: "600" },

  // --- EXPANDED BODY ---
  cardBody: {
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.secondary,
    marginBottom: 10,
  },
  itemsLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 8,
  },
  clothingItemBox: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.gradient[0],
    borderRadius: 8,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.secondary,
    overflow: "hidden",
  },
  clothingImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  noItemsText: {
    color: COLORS.gray,
    fontSize: 12,
    fontStyle: "italic",
  },

  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  emptyContainer: { marginTop: 50, alignItems: "center" },
  emptyText: { color: COLORS.gray, fontSize: 16 },

  // --- MODAL STYLES ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: COLORS.gradient[0], // Darker input bg
    color: COLORS.textPrimary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  modalBtnCancel: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  modalBtnSave: {
    backgroundColor: COLORS.primary,
  },
  modalBtnText: {
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
});

export default OutfitScreen;
