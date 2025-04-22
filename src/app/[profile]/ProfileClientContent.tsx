"use client";

import { useEffect, useState } from "react";
import MainContent from "./MainContent";
import useAuthVerification from "../hooks/useAuthVerification";

type Props = {
    profile: string;
};

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


interface UserData {
    fullname: string;
    profileImage: string;
    bio: string;
    location: string;
    currentUserProfile: boolean;
}

function ProfileClientContent({ profile }: Props) {
    const { isVerified, loading } = useAuthVerification();

    const [userData, setUserData] = useState<UserData | null>(null);
    const [newsData, setNewsData] = useState<News[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!profile) return;

        console.log(`🔹 Fetching data for: ${profile}`);

        Promise.all([
            fetch("/api/userProfile/username", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: profile }),
            }).then(async (res) => {
                if (!res.ok) throw new Error("User profile not found");
                return res.json();
            }),
            fetch("/api/post/username", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: profile }),
            }).then(async (res) => {
                if (!res.ok) throw new Error("User posts not found");
                return res.json();
            }),
        ])
            .then(([userDataRes, postDataRes]) => {
                console.log("✅ Post data raw:", postDataRes);

                const postsArray = postDataRes.posts;
                if (!Array.isArray(postsArray)) {
                    throw new Error("Invalid post data format");
                }

                const formattedPosts: News[] = postsArray.map((item): News => ({
                    _id: item._id.toString(),
                    title: item.title,
                    description: item.content || "",
                    latitude: item.latitude ?? undefined,
                    longitude: item.longitude ?? undefined,
                    creatorName: item.creatorName || "Unknown",
                    creatorImage: item.creatorImage || "/default.jpg",
                    createdAt: item.createdAt,
                    location: item.location || "",
                    likes: item.likes || 0,
                    comments: item.comments || 0,
                    categories: item.categories || [],
                    images: item.images || [],
                    commentsCount: item.commentsCount || 0,
                    currentUserProfile: item.currentUserProfile ?? false,
                    upvoteCount: item.upvoteCount || 0,
                    downvoteCount: item.downvoteCount || 0,
                    isUserUpvote: item.isUserUpvote || false,
                    isUserDownvote: item.isUserDownvote || false,
                    isSaved: item.isSaved || false,
                }));

                setUserData(userDataRes);
                setNewsData(formattedPosts);
                setError(null);
            })
            .catch((err) => {
                console.error("❌ Fetch error:", err);
                setError(err.message);
            });
    }, [profile]);

    if (loading || !isVerified || !userData || !newsData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="loader"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500 mt-10">{error}</div>;
    }

    return (
        <MainContent
            username={profile}
            userData={userData}
            userPosts={{ posts: newsData }}
        />
    );
}

export default ProfileClientContent;
