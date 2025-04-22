"use client";
import { useEffect } from 'react';
import type { OlaMaps } from 'olamaps-web-sdk';

declare global {
    interface Window {
        OlaMaps: OlaMaps;
    }
}


function Page() {
    useEffect(() => {
       
        let olaMaps: Record<string, any>;

        // Dynamically import the OlaMaps SDK
        import('olamaps-web-sdk').then((module) => {
            const { OlaMaps } = module;

            // Initialize OlaMaps
            olaMaps = new OlaMaps({
                apiKey: "txBOleR58lHkyz1Aio6WJc5zPW223xIabWR3Yd4k", // Your Ola Maps API key
            });

            // Function to get the user's current position
            const getCurrentPosition = () => {
                return new Promise<GeolocationPosition>((resolve, reject) => {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(resolve, reject);
                    } else {
                        reject(new Error("Geolocation is not supported by this browser."));
                    }
                });
            };

            // Initialize the map after getting the user's location
            getCurrentPosition()
                .then((position) => {
                    const { latitude, longitude } = position.coords;

                    // Initialize the map with the user's current position as the center
                    const myMap = olaMaps.init({
                        style: "https://api.olamaps.io/styleEditor/v1/styleEdit/styles/f97cd17c-6bbe-48b0-8438-e0bae67a14be/geoRadiusStyle",
                        container: 'map', // The id of the container div
                        center: [longitude, latitude], // Use current position coordinates
                        zoom: 16, // Initial zoom level
                    });



                    const geolocate = olaMaps.addGeolocateControls({
                        positionOptions: {
                            enableHighAccuracy: true,
                        },
                        trackUserLocation: true,
                    })

                    myMap.addControl(geolocate);

                    myMap.on('load', () => {
                        geolocate.trigger()
                    })






                    // Fetch news locations from backend and add markers
                    fetch('/api/main/map')
                        .then((res) => res.json())
                        .then((data) => {
                            if (data.success && Array.isArray(data.data)) {
                                data.data.forEach((news: { _id: string, title: string, latitude: number, longitude: number }) => {
                                    const markerEl = document.createElement('div');
                                    markerEl.classList.add('marker');

                                    // Create popup
                                    const popup = olaMaps
                                        .addPopup({ offset: [0, -40], anchor: 'bottom' })
                                        .setHTML(`<div><strong>${news.title}</strong></div>`);

                                    // Add the marker to map
                                    const marker = olaMaps
                                        .addMarker({
                                            element: markerEl,
                                            offset: [0, -10],
                                            anchor: 'bottom',
                                        })
                                        .setLngLat([news.longitude, news.latitude])
                                        .addTo(myMap);

                                    // Show popup on hover
                                    markerEl.addEventListener('mouseenter', () => {
                                        marker.setPopup(popup).togglePopup();
                                    });

                                    markerEl.addEventListener('mouseleave', () => {
                                        marker.togglePopup();
                                    });

                                    // Navigate to detail page on click
                                    markerEl.addEventListener('click', () => {
                                        window.open(`/post/${news._id}`, '_blank');
                                    });
                                });
                            }
                        })
                        .catch((err) => console.error('Error fetching news locations:', err));


                })
                .catch((error) => {
                    console.error("Error getting user location:", error);
                });

        });





        // Clean up map when the component is unmounted
        // return () => {
        //     if (typeof olaMaps !== 'undefined') {
        //         olaMaps.remove();
        //     }
        // };

    }, []);

    return (
        <div id="map" className="w-full h-screen">
            {/* The map will be rendered inside this container */}
        </div>
    );
}

export default Page;
