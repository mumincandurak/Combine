import apiClient from './client';
import { Buffer } from 'buffer'; // Import Buffer for base64 conversion

/**
 * Uploads an image to the backend to remove its background.
 * @param {string} imageUri The URI of the image to process.
 * @returns {Promise<{success: boolean, imageUrl?: string, message?: string}>}
 */
export const uploadImageForBgRemoval = async (imageUri) => {
  const formData = new FormData();
  
  // Extract file name and type from URI
  const uriParts = imageUri.split('/');
  const fileName = uriParts[uriParts.length - 1];
  let fileType;
  const fileTypeMatch = /\.(\w+)$/.exec(fileName);
  if (fileTypeMatch) {
    fileType = `image/${fileTypeMatch[1]}`;
  } else {
    fileType = 'image/jpeg'; // Default
  }

  formData.append('image', {
    uri: imageUri,
    name: fileName,
    type: fileType,
  });

  try {
    const response = await apiClient.post('/image/remove-bg', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'arraybuffer', // Important to handle the binary data
    });

    // Convert the binary data (ArrayBuffer) to a Base64 string
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    const imageUrl = `data:image/png;base64,${base64}`;

    return { success: true, imageUrl };
  } catch (error) {
    console.error('Error removing background:', error.response ? error.response.data : error.message);
    const message = error.response?.data?.message || 'Arka plan temizlenirken bir hata oluştu.';
    return { success: false, message };
  }
};


const dummyWardrobeData = [
    { id: '1', name: 'White T-Shirt', category: 'Top', color: 'White', season: 'Summer', imageUrl: 'https://via.placeholder.com/100/FFFFFF/1B1229?text=T-Shirt' },
    // ... diğer veriler
];

/**
 * Kıyafeti veritabanına kaydetme
 */
export const saveClothingItem = async (clothingData) => {
  try {
    // We assume the backend endpoint is '/clothes' from the file structure
    const response = await apiClient.post('/clothes', clothingData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error saving clothing item:', error.response ? error.response.data : error.message);
    const message = error.response?.data?.message || 'Kıyafet kaydedilirken bir hata oluştu.';
    return { success: false, message };
  }
};

export const updateClothingItem = (updatedItem) => {
    console.log('Simulating: Updating item...', updatedItem);
    return new Promise((resolve) => {
        setTimeout(() => {
            // Dummy veriyi güncelle
            const index = dummyWardrobeData.findIndex(item => item.id === updatedItem.id);
            if (index !== -1) {
                dummyWardrobeData[index] = { ...dummyWardrobeData[index], ...updatedItem };
            }
            resolve({ success: true, message: 'Item updated successfully!' });
        }, 1000);
    });
};

export const deleteClothingItem = (itemId) => {
    console.log('Simulating: Deleting item...', itemId);
    return new Promise((resolve) => {
        setTimeout(() => {
            // Dummy veriden sil
            const index = dummyWardrobeData.findIndex(item => item.id === itemId);
            if (index !== -1) {
                dummyWardrobeData.splice(index, 1); // Listeden çıkar
            }
            resolve({ success: true, message: 'Item deleted successfully!' });
        }, 1000);
    });
};

export const getClothingItems = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, data: dummyWardrobeData });
        }, 1000);
    });
}