"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import ImagePost from "@/src/components/ImagePost";

type Params = {
    category?: string;
};

function MainContent({ params }: { params: Params }) {
    const [newsData, setNewsData] = useState<any[]>([]);
    const [filteredNews, setFilteredNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    
    const categoryOptions = [
        "All", "Newest", "Technology", "Sports", "Business", "Science / Tech",
        "Crime", "Health & Fitness", "Education", "Travel",
        "Government & Politics", "Family & Relationships"
    ];

    
    const formatCategory = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    
    let category = params.category ? formatCategory(params.category) : "";
    const isValidCategory = categoryOptions.includes(category);

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

    useEffect(() => {
        if (isValidCategory) {
            setFilteredNews(newsData.filter((news) => news.categories.includes(category)));
        }
    }, [newsData, category, isValidCategory]);

    
    if (!isValidCategory) {
        return (
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-2xl font-bold text-red-500">PAGE NOT FOUND</h1>
            </div>
        );
    }

    return (
        <div className="bg-white p-2">
            <div className="flex items-center justify-center relative my-5">
                <FaArrowLeftLong
                    onClick={() => router.back()}
                    className="text-lg absolute left-3 w-10 h-10 p-2.5 cursor-pointer"
                />
                <h1 className="text-xl font-bold">{category}</h1>
            </div>

            
            <div>
                {loading ? (
                    <p className="text-center text-gray-500">Loading news...</p>
                ) : filteredNews.length > 0 ? (
                    filteredNews.map((news) => (
                        <div key={news.id} className="snap-start">
                            <ImagePost news={news} />
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">Currently No News Available</p>
                )}
            </div>
        </div>
    );
}

export default MainContent;
