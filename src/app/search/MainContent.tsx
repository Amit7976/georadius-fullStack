"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IoSearch, IoClose } from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import interestsList from "@/public/json/interestList.json";
import Link from "next/link";


const categories = [
    {
        name: "Crime",
        image: "/images/crime-image.png",
        size: 170,
        top: 50,
        left: -30,
    },
    {
        name: "Events",
        image: "/images/event-image.png",
        size: 150,
        top: 10,
        left: 150,
    },
    {
        name: "Nearby",
        image: "/images/nearby-image.png",
        size: 200,
        top: 60,
        left: 350,
    },
    {
        name: "IT",
        image: "/images/it-image.png",
        size: 130,
        top: 250,
        left: -10,
    },
    {
        name: "Breaking News",
        image: "/images/breaking-news-image.png",
        size: 250,
        top: 200,
        left: 130,
    },
    {
        name: "Traffic",
        image: "/images/traffic-image.png",
        size: 140,
        top: 300,
        left: 380,
    },
];

const trendingTopics = [
    {
        name: "Maha Khumbh",
        image: "/images/massive-crowd.png",
    },
    {
        name: "Pollution",
        image: "/images/pollution-image.jpg",
    },
];

export default function MainContent() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="bg-white min-h-screen pb-10">
            {/* 🔎 Search Bar */}
            <div className="px-2 pt-5">
                <div className="border-2 w-full rounded-full px-5 flex items-center">
                    <IoSearch className="text-gray-500 text-2xl" />
                    <Input
                        type={"text"}
                        placeholder="Topic, Content or Location"
                        className="h-14 focus-visible:ring-0 focus-visible:outline-0 focus-visible:border-0 font-semibold focus:ring-0 border-0 focus:outline-0 outline-0 ring-0 "
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <IoClose
                            className="text-gray-500 text-2xl cursor-pointer"
                            onClick={() => setSearchQuery("")}
                        />
                    )}
                </div>
            </div>

            {/* 📌 Top Categories Section */}
            <div className="py-8">
                <h2 className="px-5 font-extrabold text-xl text-black">Top Category</h2>
                <div className="relative w-full  h-[450px] overflow-x-hidden">
                    {categories.map((item, index) => (
                        <div
                            key={index}
                            className="absolute flex flex-col items-center"
                            style={{ top: item.top, left: item.left, width: item.size, height: item.size }}
                        >
                            <Image
                                src={item.image}
                                alt={item.name}
                                width={item.size}
                                height={item.size}
                                className="rounded-full border-2 border-white object-cover"
                            />
                            <span className="absolute bottom-6 text-white text-sm font-bold">
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 🔥 Trending Topics Section */}
            <div className="py-10">
                <h2 className="px-5 font-extrabold text-xl text-black">Trending Topics</h2>
                <div className="py-5 pl-4 pr-0">
                    <Swiper spaceBetween={10} slidesPerView={1.15}>
                        {trendingTopics.map((topic, index) => (
                            <SwiperSlide key={index}>
                                <div className="w-[80vw] h-56 rounded-xl relative overflow-hidden">
                                    <Image
                                        src={topic.image}
                                        alt={topic.name}
                                        width={600}
                                        height={300}
                                        className="w-full h-full object-cover"
                                    />
                                    <span className="absolute bottom-0 pt-2 pb-3 w-full text-white text-xl font-bold bg-black bg-opacity-40 px-3">
                                        {topic.name}
                                    </span>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            {/* 🔥 Trending Topics Section */}
            <div className="pt-12">
                <h2 className="px-5 font-extrabold text-xl text-black">All Categories</h2>
                <div className="flex flex-wrap items-center px-5 py-8 gap-y-5 gap-x-3 select-none">
                    {interestsList.map((interest, index) => (
                        <Link
                            key={index}
                            href={`/pages/category/${interest.name}`}
                            className="relative overflow-hidden rounded-lg flex items-center gap-2 p-4 pr-5 border duration-300 active:scale-95">
                            <p className="text-xl ">{interest.icon}</p>
                            <p className="text-lg font-bold">{interest.name}</p>
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    );
}