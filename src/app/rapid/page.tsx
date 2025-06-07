"use client";

import { useEffect, useState } from "react";
import useAuthVerification from "../hooks/useAuthVerification";
import MainContent from "./MainContent";
import { useGeolocation } from "../hooks/useGeolocation";
import BottomNavigation from "@/src/components/BottomNavigation";

function Page() {
    const { isVerified, loading } = useAuthVerification();
    const [data, setData] = useState(null);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const location = useGeolocation();

    useEffect(() => {
        if (!isVerified) return;
        if (!location) return;

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


      
        fetchNearbyPosts(location.lat, location.lng);


    }, [location,isVerified]);

    if (loading || loadingPosts) return <div className="flex items-center justify-center h-screen"><div className="loader"></div></div>;
    if (error) return <p className="text-red-500">{error}</p>;

    return isVerified && data ? (
        <>
            <MainContent posts={data} />
            <BottomNavigation />
        </>
    ) : null;
}

export default Page;
