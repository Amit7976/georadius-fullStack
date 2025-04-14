'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Link from 'next/link';
import useAuthVerification from '../../hooks/useAuthVerification';
import { getDistanceFromCurrentLocation } from '@/src/helpers/getDistanceFromCurrentLocation';
import NewsPost from '@/src/components/NewsPost';


function page() {

    const { isVerified, loading } = useAuthVerification();
    const [data, setData] = useState<any[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [distances, setDistances] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!isVerified) return;

        const fetchNearbyPosts = async (latitude: number, longitude: number) => {
            try {
                const res = await fetch(`/api/main/nearby?lat=${latitude}&lng=${longitude}&range=${7000}&limit=20&images=0`);
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
    if (error) return <p className="text-red-500 text-center">{error}</p>;
    if (!data || data.length === 0) return <p className="text-center">No trending news nearby.</p>;

    const handleHide = (postId: number) => {
        setData(prevNews => prevNews.filter(news => news._id !== postId));

        let hiddenPosts = JSON.parse(localStorage.getItem("hideNews") || "[]");
        if (!hiddenPosts.includes(postId)) {
            hiddenPosts.push(postId);
            localStorage.setItem("hideNews", JSON.stringify(hiddenPosts));
        }
    };


  return (
      <div className='py-3 px-1'>
          <h2 className="text-3xl font-bold">Breaking <span className='text-green-500'>News!</span></h2>
          <div className="mt-6 mb-20">
              {data.map((news: any) => (
                  <NewsPost news={news} key={news._id} onHide={handleHide} fullDescription={false} />
              ))}
          </div>
    </div>
  )
}

export default page
