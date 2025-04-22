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
        let olaMapsInstance: InstanceType<typeof OlaMaps>;

        // Dynamically import the OlaMaps SDK
        import('olamaps-web-sdk').then((module) => {
            const { OlaMaps } = module;

            // Initialize OlaMaps
            olaMapsInstance = new OlaMaps({
                apiKey: "txBOleR58lHkyz1Aio6WJc5zPW223xIabWR3Yd4k",
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

                    const myMap = olaMapsInstance.init({
                        style: "https://api.olamaps.io/styleEditor/v1/styleEdit/styles/f97cd17c-6bbe-48b0-8438-e0bae67a14be/geoRadiusStyle",
                        container: 'map',
                        center: [longitude, latitude],
                        zoom: 16,
                    });

                    const geolocate = olaMapsInstance.addGeolocateControls({
                        positionOptions: {
                            enableHighAccuracy: true,
                        },
                        trackUserLocation: true,
                    });

                    myMap.addControl(geolocate);

                    myMap.on('load', () => {
                        geolocate.trigger();
                    });

                    // Fetch news locations and add markers
                    fetch('/api/main/map')
                        .then((res) => res.json())
                        .then((data) => {
                            if (data.success && Array.isArray(data.data)) {
                                data.data.forEach((news: { _id: string, title: string, latitude: number, longitude: number }) => {
                                    const markerEl = document.createElement('div');
                                    markerEl.classList.add('marker');

                                    const popup = olaMapsInstance
                                        .addPopup({ offset: [0, -40], anchor: 'bottom' })
                                        .setHTML(`<div><strong>${news.title}</strong></div>`);

                                    const marker = olaMapsInstance
                                        .addMarker({
                                            element: markerEl,
                                            offset: [0, -10],
                                            anchor: 'bottom',
                                        })
                                        .setLngLat([news.longitude, news.latitude])
                                        .addTo(myMap);

                                    markerEl.addEventListener('mouseenter', () => {
                                        marker.setPopup(popup).togglePopup();
                                    });

                                    markerEl.addEventListener('mouseleave', () => {
                                        marker.togglePopup();
                                    });

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
    }, []);

    return (
        <div id="map" className="w-full h-screen">
            {/* The map will be rendered here */}
        </div>
    );
}

export default Page;
