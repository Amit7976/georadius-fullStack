export const getAddress = async (): Promise<string> => {
  const API_KEY = "txBOleR58lHkyz1Aio6WJc5zPW223xIabWR3Yd4k";

  if (!navigator.geolocation) {
    console.log("❌ Geolocation is not supported by this browser.");
    return "Geolocation not supported";
  }

  try {
    // Wrap getCurrentPosition in a Promise
    const position: GeolocationPosition = await new Promise(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    );

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    console.log("✅ Extracted Latitude:", latitude);
    console.log("✅ Extracted Longitude:", longitude);

    const url = `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${latitude},${longitude}&api_key=${API_KEY}`;
    console.log("🌍 Fetching Address from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: { "X-Request-Id": "123456" },
    });

    console.log("📡 API Response Status:", response.status);
    const data = await response.json();
    console.log("📜 API Response Data:", data);

    return data.results[0].formatted_address || "Address not found"; // Use correct property for address
  } catch (error) {
    console.error("❌ Error:", error);
    return "Error fetching address";
  }
};

export const getCoordinates = async (
  address: string
): Promise<{ latitude: number; longitude: number } | null> => {
  const API_KEY = "txBOleR58lHkyz1Aio6WJc5zPW223xIabWR3Yd4k";

  try {
    const url = `https://api.olamaps.io/places/v1/geocode?address=${encodeURIComponent(
      address
    )}&api_key=${API_KEY}`;
    console.log("🌍 Fetching Coordinates from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: { "X-Request-Id": "123456" },
    });

    console.log("📡 API Response Status:", response.status);
    const data = await response.json();
    console.log("📜 API Response Data:", data);

    if (data.geocodingResults && data.geocodingResults.length > 0) {
      const { lat, lng } = data.geocodingResults[0].geometry.location;
      console.log("📍 Extracted Coordinates:", {
        latitude: lat,
        longitude: lng,
      });
      return { latitude: lat, longitude: lng };
    } else {
      console.log("❌ No results found for address");
      return null;
    }
  } catch (error) {
    console.error("❌ Error fetching coordinates:", error);
    return null;
  }
};