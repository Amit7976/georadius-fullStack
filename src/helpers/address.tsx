import React, { useEffect, useState } from 'react';

const API_KEY = 'txBOleR58lHkyz1Aio6WJc5zPW223xIabWR3Yd4k';

type AddressProps = {
  location: string; // A string in the format "Lat: lat_value, Lng: lng_value"
};

const Address: React.FC<AddressProps> = ({ location }) => {
  const [address, setAddress] = useState<string>('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // Extract latitude and longitude from the location string
  useEffect(() => {
    // console.log('Received location prop:', location);

    const parseLocation = () => {
      const regex = /Lat:\s*(-?\d+\.\d+),\s*Lng:\s*(-?\d+\.\d+)/;
      const match = location.match(regex);
      if (match) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);
        // console.log('Extracted Latitude:', lat);
        // console.log('Extracted Longitude:', lng);
        setLatitude(lat);
        setLongitude(lng);
      } else {
        // console.log('Failed to extract latitude and longitude');
      }
    };

    if (location) {
      parseLocation();
    }
  }, [location]);

  useEffect(() => {
    const fetchAddress = async () => {
      // console.log('Extracted Latitude:', latitude);
      // console.log('Extracted Longitude:', longitude);
      if (latitude && longitude) {
        // console.log('====================================');
        // console.log("running");
        // console.log('====================================');
      }
      if (latitude && longitude) {
        const url = `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${latitude},${longitude}&api_key=${API_KEY}`;
        // console.log('Fetching address from:', url);

        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'X-Request-Id': '123456', // Use a unique ID for each request
            },
          });

          // console.log('API Response Status:', response.status);
          const data = await response.json();
          // console.log('API Response Data:', data);

          const name = data.results[0].formatted_address;

          if (name) {
            setAddress(name);
            // console.log('Extracted Address:', name);
          } else {
            setAddress('Address not found');
            // console.log('Address not found in API response');
          }
        } catch (error) {
          setAddress('Error fetching address');
          console.log('Error fetching address:', error);
        }
      } else {
        // console.log('Latitude or Longitude is null, skipping API call');
      }
    };

    fetchAddress();
  }, [latitude, longitude]);

  return address;
};

export default Address;
