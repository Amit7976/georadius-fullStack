"use client";

import { useEffect, useState } from "react";
import useAuthVerification from "../hooks/useAuthVerification";
import MainContent from "./MainContent";

function Page() {
    const { isVerified, loading } = useAuthVerification();
    const [data, setData] = useState<any>(null);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isVerified) return;

        const fetchNearbyPosts = async (latitude: number, longitude: number) => {
            try {
                const res = await fetch(`/api/rapid/nearby?lat=${latitude}&lng=${longitude}`);
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error("API fetch error:", err);
                setError("Failed to fetch nearby posts.");
            } finally {
                setLoadingPosts(false);
            }
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchNearbyPosts(latitude, longitude);
            },
            (err) => {
                console.error("Geolocation error:", err);
                setError("Location access is required to load nearby posts.");
                setLoadingPosts(false);
            }
        );
    }, [isVerified]);

    if (loading || loadingPosts) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return isVerified && data ? (
        <>
            <MainContent posts={data} />
        </>
    ) : null;
}

export default Page;
