// This file simulates an API call to a weather service.
// In a real application, this would use apiClient to make a request to your backend,
// which would then communicate with a real weather API.

/**
 * Simulates fetching weather data based on geographic coordinates.
 * @param {number} latitude The latitude.
 * @param {number} longitude The longitude.
 * @returns {Promise<object>} A promise that resolves with weather data.
 */
export const getWeatherByCoords = (latitude, longitude) => {
  console.log('Simulating: Fetching weather for coordinates...', { latitude, longitude });

  return new Promise((resolve) => {
    setTimeout(() => {
      // This is dummy data. In a real scenario, the backend would return this
      // based on the provided coordinates.
      const weatherData = {
        location: 'Istanbul', // Backend could use reverse geocoding to find the city name
        temperature: 15,
        condition: 'Partly Cloudy',
        icon: 'partly-sunny', // Icon name from Ionicons
      };
      console.log('Simulating: Weather data fetched.', weatherData);
      resolve({ success: true, data: weatherData });
    }, 1500); // Simulate 1.5 seconds of network time
  });
};
