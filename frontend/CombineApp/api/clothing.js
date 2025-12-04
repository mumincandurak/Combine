// This file simulates API calls to the backend for clothing items.
// In a real application, this would use apiClient to make actual HTTP requests.

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
 * Simulates uploading an image to a background removal service.
 * @param {string} imageUri The local URI of the image to upload.
 * @returns {Promise<object>} A promise that resolves with an object containing the new URL.
 */
export const uploadImageForBgRemoval = (imageUri) => {
  console.log(
    "Simulating: Uploading image for background removal...",
    imageUri,
  );

  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real scenario, this URL would come from the backend response.
      const newImageUrl = `https://via.placeholder.com/300/FFFFFF/000000?text=BG-Removed`;
      console.log(
        "Simulating: Background removal complete. New URL:",
        newImageUrl,
      );
      resolve({ success: true, imageUrl: newImageUrl });
    }, 2000); // Simulate 2 seconds of network and processing time.
  });
};

/**
 * Simulates saving the final clothing item data to the backend.
 * @param {object} clothingData The complete data for the clothing item.
 * @returns {Promise<object>} A promise that resolves with a success message.
 */
export const saveClothingItem = (clothingData) => {
  console.log("Simulating: Saving clothing item to database...", clothingData);

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Simulating: Clothing item saved successfully.");
      // Add the new item to our dummy data for the simulation
      const newItem = {
        id: Math.random().toString(),
        ...clothingData,
      };
      dummyWardrobeData.push(newItem);
      resolve({ success: true, message: "Item saved successfully!" });
    }, 1500); // Simulate 1.5 seconds of network time.
  });
};

/**
 * Simulates fetching all clothing items from the backend.
 * @returns {Promise<object>} A promise that resolves with a list of clothing items.
 */
export const getClothingItems = () => {
  console.log("Simulating: Fetching all clothing items...");
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Simulating: Fetched items.", dummyWardrobeData);
      resolve({ success: true, data: dummyWardrobeData });
    }, 1000); // Simulate 1 second network time
  });
};
