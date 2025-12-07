// api/clothing.js

// [RESOLUTION]: Kept HEAD because it has the full list of 4 items
const dummyWardrobeData = [
  {
    id: "1",
    name: "White T-Shirt",
    category: "Top",
    color: "White",
    season: "Summer",
    imageUrl: "https://via.placeholder.com/100/FFFFFF/1B1229?text=T-Shirt",
  },
  {
    id: "2",
    name: "Blue Jeans",
    category: "Bottom",
    color: "Blue",
    season: "All-Season",
    imageUrl: "https://via.placeholder.com/100/3498db/FFFFFF?text=Jeans",
  },
  {
    id: "3",
    name: "Black Boots",
    category: "Shoes",
    color: "Black",
    season: "Winter",
    imageUrl: "https://via.placeholder.com/100/000000/FFFFFF?text=Boots",
  },
  {
    id: "4",
    name: "Red Jacket",
    category: "Outerwear",
    color: "Red",
    season: "Autumn",
    imageUrl: "https://via.placeholder.com/100/FF0000/FFFFFF?text=Jacket",
  },
];

/**
 * Yapay Zeka Görüntü Analizi
 */
export const analyzeImageWithAI = (imageUri) => {
  console.log("Simulating: Sending image to AI for analysis...", imageUri);

  return new Promise((resolve) => {
    setTimeout(() => {
      // AI'ın döndüreceği örnek JSON yanıtı
      const aiResponse = {
        category: "Top",
        season: "Summer",
        color1: "red", // constants/options.js içindeki value değerleriyle eşleşmeli
        color2: "black", // constants/options.js içindeki value değerleriyle eşleşmeli
        confidence: 0.95,
      };

      console.log("Simulating: AI Analysis complete.", aiResponse);
      resolve({ success: true, data: aiResponse });
    }, 2000);
  });
};

/**
 * Arka plan temizleme servisi simülasyonu
 */
export const uploadImageForBgRemoval = (imageUri) => {
  console.log(
    "Simulating: Uploading image for background removal...",
    imageUri,
  );

  return new Promise((resolve) => {
    setTimeout(() => {
      // [RESOLUTION]: Kept HEAD version (English) for consistency
      // In a real scenario, this URL would come from the backend response.
      const newImageUrl = `https://via.placeholder.com/300/FFFFFF/000000?text=BG-Removed`;
      console.log(
        "Simulating: Background removal complete. New URL:",
        newImageUrl,
      );
      resolve({ success: true, imageUrl: newImageUrl });
    }, 1500);
  });
};

/**
 * Kıyafeti veritabanına kaydetme
 */
export const saveClothingItem = (clothingData) => {
  // [RESOLUTION]: Used Remote version here because it handles 'color1' mapping
  console.log(
    "Simulating: Saving final clothing item to database...",
    clothingData,
  );

  return new Promise((resolve) => {
    setTimeout(() => {
      const newItem = {
        id: Math.random().toString(),
        ...clothingData,
        // Eski yapı tek 'color' alanı kullanıyordu, uyumluluk için color1'i ana renk yapıyoruz
        color: clothingData.color1,
      };
      dummyWardrobeData.push(newItem);
      resolve({ success: true, message: "Item saved successfully!" });
    }, 1000);
  });
};

// [RESOLUTION]: Added these new functions from Remote (missing in local)
export const updateClothingItem = (updatedItem) => {
  console.log("Simulating: Updating item...", updatedItem);
  return new Promise((resolve) => {
    setTimeout(() => {
      // Dummy veriyi güncelle
      const index = dummyWardrobeData.findIndex(
        (item) => item.id === updatedItem.id,
      );
      if (index !== -1) {
        dummyWardrobeData[index] = {
          ...dummyWardrobeData[index],
          ...updatedItem,
        };
      }
      resolve({ success: true, message: "Item updated successfully!" });
    }, 1000);
  });
};

export const deleteClothingItem = (itemId) => {
  console.log("Simulating: Deleting item...", itemId);
  return new Promise((resolve) => {
    setTimeout(() => {
      // Dummy veriden sil
      const index = dummyWardrobeData.findIndex((item) => item.id === itemId);
      if (index !== -1) {
        dummyWardrobeData.splice(index, 1); // Listeden çıkar
      }
      resolve({ success: true, message: "Item deleted successfully!" });
    }, 1000);
  });
};

export const getClothingItems = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: dummyWardrobeData });
    }, 1000);
  });
};
