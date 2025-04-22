export const getDistanceFromCurrentLocation = async (
  lat: number,
  lon: number
) => {
  return new Promise<{
    formattedDistance: string;
    distance: number;
    currentLat: number;
    currentLon: number;
  }>((resolve, reject) => {
    console.log(
      "Function called with lat:",
      lat.toFixed(2),
      "lon:",
      lon.toFixed(2)
    );

    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by this browser.");
      reject("Geolocation is not supported by this browser.");
      return;
    }
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("==============START=================");

          // Round to 2 decimal places
          const currentLat = parseFloat(position.coords.latitude.toFixed(2));
          const currentLon = parseFloat(position.coords.longitude.toFixed(2));
          console.log("Current location fetched:", { currentLat, currentLon });

          const toRad = (degree: number) => (degree * Math.PI) / 180;

          const R = 6371; // Earth's radius in km
          const dLat = toRad(currentLat - lat);
          const dLon = toRad(currentLon - lon);

          console.log("Converted to radians:", { dLat, dLon });

          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat)) *
            Math.cos(toRad(currentLat)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

          console.log("Haversine formula 'a' value:", a);

          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

          console.log("Haversine formula 'c' value:", c);

          const distance = R * c; // Distance in km
          console.log("Calculated distance (km):", distance);

          // Format distance
          let formattedDistance = "";
          console.log("====================================");
          console.log(distance);
          console.log("====================================");
          if (distance < 1) {
            formattedDistance = `${Math.round(distance * 100)}m`;
          } else {
            formattedDistance = `${Math.round(distance)}km`;
          }

          console.log("Formatted distance:", formattedDistance);

          resolve({ formattedDistance, distance, currentLat, currentLon });

          console.log("===============END==================");
        },
        (error) => {
          console.log("Error getting location:", error.message);
          reject(error.message);
        }
      );
    }
  });
};
