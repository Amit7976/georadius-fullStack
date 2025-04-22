'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import useAuthVerification from '../app/hooks/useAuthVerification';
import { useGeolocation } from '../app/hooks/useGeolocation';
import { formatTimeAgo } from '../helpers/formatTimeAgo';
import { getDistanceFromCurrentLocation } from '../helpers/getDistanceFromCurrentLocation';

type TrendingNewsSliderProps = {
    range: number;
};

const TrendingNewsSlider: React.FC<TrendingNewsSliderProps> = ({ range }) => {

    const { isVerified, loading } = useAuthVerification();
    type NewsPost = {
        _id: string;
        title: string;
        images?: string[];
        creatorName?: string;
        createdAt?: string;
        latitude: number;
        longitude: number;
    };

    const [data, setData] = useState<NewsPost[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [distances, setDistances] = useState<Record<string, string>>({});
    const location = useGeolocation();

    useEffect(() => {
        if (!isVerified) return;
        if (!location) return;


        const fetchNearbyPosts = async (latitude: number, longitude: number) => {
            try {
                const res = await fetch(`/api/main/nearby?lat=${latitude}&lng=${longitude}&range=${range}&limit=5`);
                const json = await res.json();
                setData(json);
                console.log('====================================');
                console.log(json);
                console.log('====================================');
                const distanceResults: Record<string, string> = {};
                await Promise.all(
                    json.map(async (post: { _id: string; latitude: number; longitude: number }) => {
                        try {
                            const { formattedDistance }: { formattedDistance: string } = await getDistanceFromCurrentLocation(
                                post.latitude,
                                post.longitude
                            );
                            distanceResults[post._id] = formattedDistance;
                        } catch {
                            distanceResults[post._id] = "Location not available";
                        }
                    })
                );
                setDistances(distanceResults);
            } catch (err) {
                console.error("API fetch error:", err);
                setError("Failed to fetch nearby posts.");
            } finally {
                setLoadingPosts(false);
            }
        };



        fetchNearbyPosts(location.lat, location.lng);
    }, [location, isVerified, range]);

    if (loading || loadingPosts) return (
        <>
            <div className="py-2 pr-0">
                <Swiper spaceBetween={0} slidesPerView={1} parallax={true} modules={[Autoplay]}>
                    {[1, 2, 3].map((i) => (
                        <SwiperSlide key={i}>
                            <div className="animate-pulse bg-gray-100 rounded-lg h-80 w-full" />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </>
    );
    if (error) return <p className="text-red-500 text-center">{error}</p>;
    if (!data || data.length === 0) return <p className="text-center">No breaking news nearby.</p>;

    return (
        <div className="py-2 pr-0">
            <Swiper spaceBetween={0} slidesPerView={1} parallax={true} modules={[Autoplay]}>
                {data.map((news, index: number) => (
                    <SwiperSlide key={news._id || index}>
                        <div className="w-full h-80 relative overflow-hidden select-none">
                            {/* Nested Swiper for images */}
                            {news?.images && (
                                <Image
                                    src={news.images[0]}
                                    alt={news.title}
                                    width={600}
                                    height={300}
                                    priority
                                    className="w-full h-full object-fill object-center"
                                />
                            )}

                            {/* Text Overlay */}
                            <div className="absolute bottom-0 space-y-3 py-4 w-full h-full bg-gradient-to-b to-[#00000080] bg-opacity-40 px-3 flex flex-col justify-end text-white z-50">
                                <span className="text-xl font-bold">{news.title}</span>
                                <div className="flex items-center gap-4 flex-wrap">
                                    <p className="text-green-500 text-sm font-semibold">
                                        {distances[news._id] || "Calculating..."}
                                    </p>
                                    <p className="font-bold text-gray-100 text-sm">
                                        <span className='text-gray-300 font-normal'>by</span> {news?.creatorName || "Unknown"}
                                    </p>
                                    <p className="text-gray-400 text-xs font-medium">
                                        {news.createdAt ? formatTimeAgo(news.createdAt) : "Just now"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default TrendingNewsSlider;
