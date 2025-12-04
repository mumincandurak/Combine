import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS } from "../../colors";

// Helper for Mock Images
const MOCK_IMG = "https://via.placeholder.com/150";

// Updated Mock Data with 'outfitItems' so the "Favorites" tab isn't empty when expanded
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
    outfitItems: [], // Empty for mock, but real ones will have data
  },
];

const OutfitScreen = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState("favorites");
  const [customOutfits, setCustomOutfits] = useState(INITIAL_CUSTOM);
  const [favoriteOutfits, setFavoriteOutfits] = useState(INITIAL_FAVORITES);

  // Track which card is currently open
  const [expandedId, setExpandedId] = useState(null);

  // --- LISTENING FOR NEW OUTFITS ---
  useFocusEffect(
    useCallback(() => {
      if (route.params?.newOutfit) {
        const newOutfit = route.params.newOutfit;
        setCustomOutfits((prev) => [newOutfit, ...prev]);
        setActiveTab("custom");

        // Automatically expand the new outfit so the user sees it immediately
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
    // If clicking the same one, close it. If clicking a new one, open it.
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const renderOutfitItem = ({ item }) => {
    const isExpanded = expandedId === item.id;

    return (
      <TouchableOpacity
        style={styles.cardContainer}
        activeOpacity={0.9}
        onPress={() => toggleExpand(item.id)}
      >
        {/* HEADER (Always Visible) */}
        <View style={styles.cardHeader}>
          <View style={styles.cardImageContainer}>
            <Ionicons
              name="shirt-outline"
              size={30}
              color={COLORS.secondaryText}
            />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{item.name}</Text>
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

        {/* BODY (Visible only when Expanded) */}
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
                      // Fallback Icon
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

  // --- CARD STYLES (UPDATED) ---
  cardContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
    // Removed flexDirection: 'row' so it can grow vertically
    flexDirection: "column",
  },
  // New Header style for the top part of the card
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
  cardMetaContainer: { flexDirection: "row" },
  cardDate: { fontSize: 12, color: COLORS.textSecondary, marginRight: 10 },
  cardItemCount: { fontSize: 12, color: COLORS.primary, fontWeight: "600" },

  // --- EXPANDED BODY STYLES ---
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
    backgroundColor: COLORS.gradient[0], // Dark background for item
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
});

export default OutfitScreen;
