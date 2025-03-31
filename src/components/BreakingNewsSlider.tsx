'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Link from 'next/link';


const BreakingNewsSlider: React.FC = () => {

    const [newsData, setNewsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/json/news.json")
            .then((res) => res.json())
            .then((data) => {
                setNewsData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching news:", err);
                setLoading(false);
            });
    }, []);


    const formatTimeAgo = (publish_time: string) => {
        const time = new Date(publish_time);
        const now = new Date();
        const diff = Math.floor((now.getTime() - time.getTime()) / 1000); // Difference in seconds

        if (diff < 60) return `${diff} min ago`;
        const minutes = Math.floor(diff / 60);
        if (minutes < 60) return `${minutes} min ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} h ago`;
        const days = Math.floor(hours / 24);
        if (days === 1) return "yesterday";
        if (days < 30) return `${days} days ago`;
        const months = Math.floor(days / 30);
        if (months < 12) return `${months} months ago`;
        return `${Math.floor(months / 12)} years ago`;
    };


    return (
        <div className="py-3 px-0">
            {/* Header */}
            <div className="flex justify-between items-end p-2">
                <h2 className="text-3xl font-bold">Breaking <span className='text-green-500'>News!</span></h2>
                <Link href={''} className="text-xs font-bold pb-2 text-gray-500 active:scale-95">
                    View More
                </Link>
            </div>


            <div className="py-2 pr-0">
                <Swiper spaceBetween={0} slidesPerView={1} parallax={true}>
                    {newsData.map((news, index) => (
                        <SwiperSlide key={index}>
                            <div className="w-full h-80 relative overflow-hidden select-none">
                                <Image
                                    src={news.image}
                                    alt={news.title}
                                    width={600}
                                    height={300}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 space-y-3 py-4 w-full h-full  bg-gradient-to-b to-[#00000060] bg-opacity-40 px-3 flex flex-col justify-end text-white">
                                    <span className="text-xl font-bold">
                                        {news.title}
                                    </span>
                                    <div className="flex items-center gap-4">
                                        <p className="text-green-600">{news.longitude}, {news.latitude}</p>
                                        <p className="font-bold text-gray-300"><span className='text-gray-400'>by</span> {news.source.username}</p>
                                        <p className="text-gray-400 text-sm font-medium">{formatTimeAgo(news.publish_time)}</p>
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

export default BreakingNewsSlider;
