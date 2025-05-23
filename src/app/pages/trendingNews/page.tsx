"use client";

import NewsPost from '@/src/components/NewsPost';
import { useEffect, useState } from 'react';
import useAuthVerification from '../../hooks/useAuthVerification';
import { useGeolocation } from '../../hooks/useGeolocation';


interface News {
    _id: string;
    title: string;
    description: string;
    latitude?: number;
    longitude?: number;
    creatorName: string;
    creatorImage: string;
    createdAt: string;
    location: string;
    likes: number;
    comments: number;
    categories: string[];
    images: string[];
    commentsCount: number;
    currentUserProfile: boolean;
    // Add these
    upvoteCount: number;
    downvoteCount: number;
    isUserUpvote: boolean;
    isUserDownvote: boolean;
    isSaved: boolean;
}


function Page() {
    const { isVerified } = useAuthVerification();
    const [data, setData] = useState<News[]>([]);
    const [error, setError] = useState<string | null>(null);
    const location = useGeolocation();

    useEffect(() => {
        if (!isVerified || !location) return;

        const fetchNearbyPosts = async (latitude: number, longitude: number) => {
            try {
                const res = await fetch(`/api/main/nearby?lat=${latitude}&lng=${longitude}&range=7000&limit=20&images=0`);
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error("API fetch error:", err);
                setError("Failed to fetch nearby posts.");
            }
        };

        fetchNearbyPosts(location.lat, location.lng);
    }, [location, isVerified]);

    if (error) return <p className="text-red-500 text-center">{error}</p>;
    if (!data || data.length === 0) return <p className="text-center">No trending news nearby.</p>;

    const handleHide = (postId: number) => {
        setData(prevNews => prevNews.filter(news => news._id !== postId.toString()));

        const hiddenPosts = JSON.parse(localStorage.getItem("hideNews") || "[]");
        if (!hiddenPosts.includes(postId)) {
            hiddenPosts.push(postId);
            localStorage.setItem("hideNews", JSON.stringify(hiddenPosts));
        }
    };

    return (
        <div className='py-3 px-1'>
            <h2 className="text-3xl font-bold">Breaking <span className='text-green-500'>News!</span></h2>
            <div className="mt-6 mb-20">
                {data.map((news) => (
                    <NewsPost news={news} key={news._id} onHide={handleHide} fullDescription={false} />
                ))}
            </div>
        </div>
    );
}

export default Page;
