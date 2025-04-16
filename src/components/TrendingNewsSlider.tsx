'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Link from 'next/link';
import useAuthVerification from '../app/hooks/useAuthVerification';
import { formatTimeAgo } from '../helpers/formatTimeAgo';
import { getDistanceFromCurrentLocation } from '../helpers/getDistanceFromCurrentLocation';
import { useGeolocation } from '../app/hooks/useGeolocation';

type TrendingNewsSliderProps = {
    range: number;
};

const TrendingNewsSlider: React.FC<TrendingNewsSliderProps> = ({ range }) => {

    const { isVerified, loading } = useAuthVerification();
    const [data, setData] = useState<any[]>([]);
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
                    json.map(async (post: any) => {
                        try {
                            const { formattedDistance } = await getDistanceFromCurrentLocation(
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

    if (loading || loadingPosts) return <div className="flex items-center justify-center h-screen"><div className="loader"></div></div>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;
    if (!data || data.length === 0) return <p className="text-center">No breaking news nearby.</p>;

    return (
        <div className="py-3 px-0">
            {/* Header */}
            <div className="flex justify-between items-end p-2">
                <h2 className="text-3xl font-bold">Breaking <span className='text-green-500'>News!</span></h2>
                <Link href={'/pages/trendingNews'} className="text-xs font-bold pb-2 text-gray-500 active:scale-95">
                    View More
                </Link>
            </div>

            <div className="py-2 pr-0">
                <Swiper spaceBetween={0} slidesPerView={1} parallax={true} modules={[Autoplay]}>
                    {data.map((news: any, index: number) => (
                        <SwiperSlide key={news._id || index}>
                            <div className="w-full h-96 relative overflow-hidden select-none">
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
        </div>
    );
};

export default TrendingNewsSlider;
