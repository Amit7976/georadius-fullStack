"use client";

import { useEffect, useState } from "react";
import { use } from "react"; // <-- for unwrapping the `params` Promise
import NewsPost from "@/src/components/NewsPost";
import BackButton from "@/src/components/BackButton";
import { News } from "@/src/helpers/types";


export default function SinglePostPage({ params }: { params: Promise<{ post: string }> }) {
    const { post } = use(params);

    const [newsData, setNewsData] = useState<News[]>([]);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch("/api/post/getSinglePost", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ postId: post }),
                });

                const data = await res.json();
                if (data?.post) {
                    setNewsData([data.post as News]);
                }
            } catch (err) {
                console.error("Error fetching post:", err);
            }
        };

        fetchPost();
    }, [post]);

    const handleHide = (id: string) => {
        setNewsData(prev => prev.filter(post => post._id !== id.toString()));
    };

    return (
        <>
            <div className="pt-3 flex items-center justify-start gap-2 select-none">
                <BackButton classname="relative pr-3" />
                <p className="font-medium text-gray-500">Back</p>
            </div>
            {newsData.map((news) => (
                <NewsPost
                    news={news}
                    key={news._id}
                    onHide={handleHide}
                    fullDescription={true}
                />
            ))}
        </>
    );
}
