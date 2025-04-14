"use client";

import { useEffect, useState } from "react";
import { use } from "react"; // <-- for unwrapping the `params` Promise
import NewsPost from "@/src/components/NewsPost";

export default function SinglePostPage({ params }: { params: Promise<{ post: string }> }) {
    const { post } = use(params); // ✅ Unwrap the Promise

    const [newsData, setNewsData] = useState<{ _id: string }[]>([]);
    const [userData, setUserData] = useState({ currentUserProfile: false });

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
                    setNewsData([data.post]);
                    setUserData({ currentUserProfile: data.currentUserProfile });
                }
            } catch (err) {
                console.error("Error fetching post:", err);
            }
        };

        fetchPost();
    }, [post]);

    const handleHide = (id: number) => {
        setNewsData(prev => prev.filter(post => post._id !== id.toString()));
    };

    return (
        <div>
            {newsData.map((news: any) => (
                <NewsPost
                    news={news}
                    key={news._id}
                    onHide={handleHide}
                    fullDescription={true}
                    currentUserProfile={userData.currentUserProfile}
                />
            ))}
        </div>
    );
}
