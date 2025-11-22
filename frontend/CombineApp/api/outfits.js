// This file simulates an API call to the AI outfit suggestion engine.

/**
 * Simulates fetching an outfit suggestion from the backend.
 * The backend would use the user's preferences and current weather for its AI logic.
 * @param {object} data The user and weather data.
 * @param {object} data.user The user object from AuthContext.
 * @param {object} data.weather The current weather object.
 * @returns {Promise<object>} A promise that resolves with an array of clothing items for the outfit.
 */
export const getOutfitSuggestion = ({ user, weather }) => {
  console.log('Simulating: Fetching outfit suggestion with user and weather data...', { 
    userName: user.name,
    styles: user.stylePreferences,
    colors: user.favoriteColors,
    weather: weather.condition,
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      // This is dummy data. In a real scenario, the backend's AI would generate
      // this list based on the user's wardrobe, preferences, and the weather.
      const suggestedOutfit = {
          items: [
              { id: '1', name: 'AI-Jacket', category: 'Outwear', imageUrl: 'https://i.imgur.com/S10fR6S.png', color: 'Gray', season: 'Spring' },
              { id: '2', name: 'AI-T-shirt', category: 'Top', imageUrl: 'https://i.imgur.com/3N26uJq.png', color: 'White', season: 'Summer' },
              { id: '3', name: 'AI-Jeans', category: 'Bottom', imageUrl: 'https://i.imgur.com/eBv6p1X.png', color: 'Blue', season: 'All' },
              { id: '4', name: 'AI-Sneakers', category: 'Shoes', imageUrl: 'https://i.imgur.com/t7i3d2c.png', color: 'White', season: 'All' },
          ]
      };
      console.log('Simulating: Outfit suggestion received.', suggestedOutfit);
      resolve({ success: true, data: suggestedOutfit });
    }, 2000); // Simulate 2 seconds for AI processing time
  });
};

/**
 * Simulates sending a 'like' action to the backend for a specific outfit.
 * @param {object} outfit The outfit object that was liked.
 * @returns {Promise<object>} A promise that resolves indicating success.
 */
export const likeOutfit = (outfit) => {
  console.log('Simulating: Liking outfit...', { outfitId: outfit.id, items: outfit.items.map(i => i.name) });

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Simulating: Outfit liked successfully on the backend.');
      resolve({ success: true, message: `Outfit ${outfit.id} liked.` });
    }, 500); // Simulate network latency
  });
};

/**
 * Simulates sending a 'dislike' action to the backend for a specific outfit.
 * @param {object} outfit The outfit object that was disliked.
 * @returns {Promise<object>} A promise that resolves indicating success.
 */
export const dislikeOutfit = (outfit) => {
  console.log('Simulating: Disliking outfit...', { outfitId: outfit.id, items: outfit.items.map(i => i.name) });

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Simulating: Outfit disliked successfully on the backend.');
      resolve({ success: true, message: `Outfit ${outfit.id} disliked.` });
    }, 500); // Simulate network latency
  });
};