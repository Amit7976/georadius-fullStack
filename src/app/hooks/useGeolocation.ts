import { useEffect, useState } from "react";

export function useGeolocation() {
  const jaipurCenter = { lat: 26.9124, lng: 75.7873 }; // Jaipur's center coordinates
  const [location, setLocation] = useState<{ lat: number; lng: number }>(
    jaipurCenter
  );

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Geolocation error:", error.message);
          setLocation(jaipurCenter); // fallback if error
        },
        {
          enableHighAccuracy: true,
        }
      );
    } else {
      // Geolocation not supported
      setLocation(jaipurCenter);
    }
  }, []);

  return location;
}
