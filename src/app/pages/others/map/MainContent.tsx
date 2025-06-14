"use client";
import { useEffect } from 'react';
import type { OlaMaps } from 'olamaps-web-sdk';
import { useRouter } from 'next/navigation';

declare global {
    interface Window {
        OlaMaps: OlaMaps;
    }
}

const jaipurCenter = { lat: 26.9124, lng: 75.7873 }; // Default fallback location

function MainContent() {
    const router = useRouter();

    useEffect(() => {
        // Check if geolocation permission is denied
        if (!navigator.geolocation) {
            return;
        }

        navigator.permissions.query({ name: "geolocation" as PermissionName }).then((result) => {
            if (result.state === "denied") {
                // don't redirect immediately – let fallback to Jaipur happen
                console.warn("Geolocation permission denied");
            }
        });
    }, [router]);

    useEffect(() => {
        let olaMapsInstance: InstanceType<typeof OlaMaps>;

        import('olamaps-web-sdk').then((module) => {
            const { OlaMaps } = module;

            olaMapsInstance = new OlaMaps({
                apiKey: "txBOleR58lHkyz1Aio6WJc5zPW223xIabWR3Yd4k",
                mode: "3d",
                threedTileset: "https://api.olamaps.io/tiles/vector/v1/3dtiles/tileset.json",
            });

            const getCurrentPosition = () => {
                return new Promise<GeolocationPosition>((resolve, reject) => {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(resolve, reject, {
                            enableHighAccuracy: true,
                            timeout: 5000,
                        });
                    } else {
                        reject(new Error("Geolocation is not supported"));
                    }
                });
            };

            const initMap = (latitude: number, longitude: number) => {
                const myMap = olaMapsInstance.init({
                    style: "https://api.olamaps.io/tiles/vector/v1/styles/default-dark-standard-mr/style.json",
                    container: 'map',
                    center: [longitude, latitude],
                    zoom: 10,
                });

                const geolocate = olaMapsInstance.addGeolocateControls({
                    positionOptions: { enableHighAccuracy: true },
                    trackUserLocation: true,
                });

                myMap.addControl(geolocate);

                myMap.on('load', () => {
                    geolocate.trigger();
                });

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
                                    window.open(`/search/results/${news._id}`);
                                });
                            });
                        }
                    })
                    .catch(() => {
                        // Still show map even if data fails
                    });
            };

            getCurrentPosition()
                .then((position) => {
                    const { latitude, longitude } = position.coords;
                    initMap(latitude, longitude);
                })
                .catch(() => {
                    // Use fallback location: Jaipur
                    console.warn("📍 Using fallback location: Jaipur");
                    initMap(jaipurCenter.lat, jaipurCenter.lng);
                });
        });
    }, []);

    return (
        <div id="map" className="w-full h-screen" />
    );
}

export default MainContent;
