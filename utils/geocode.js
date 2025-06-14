const axios = require("axios");

// Function to geocode an address using Nominatim
const geocodeAddress = async (address) => {
  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: address,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "YourAppName/1.0 (your-email@example.com)", // Nominatim requires a user agent
      },
    });

    if (response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat: parseFloat(lat), lng: parseFloat(lon) };
    }
    throw new Error("Location not found");
  } catch (error) {
    console.error("Error geocoding address:", error);
    throw error;
  }
};

module.exports = geocodeAddress;