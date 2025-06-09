"use client";

import { useEffect, useState } from "react";
import MainContent from "./MainContent";
import { LoaderLink } from "@/src/components/loaderLinks";
import { AnimatedText } from "@/src/components/Animate";
import { t } from "@/src/helpers/i18n";

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
    const [userData, setUserData] = useState<UserData | null>(null);
    const [newsData, setNewsData] = useState<News[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [userNotFound, setUserNotFound] = useState(false)

    useEffect(() => {
        if (!profile) return;

        console.log(`🔹 Fetching data for: ${profile}`);

        Promise.all([
            fetch("/api/userProfile/username", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: profile }),
            }).then(async (res) => {
                return res.json();
            }),
            fetch("/api/post/username", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: profile }),
            }).then(async (res) => {
                return res.json();
            }),
        ])
            .then(([userDataRes, postDataRes]) => {
                console.log("✅ Post data raw:", postDataRes);

                const postsArray = postDataRes.posts;
                if (!Array.isArray(postsArray)) {
                    setUserNotFound(true)
                    return;
                }

                const formattedPosts: News[] = postsArray.map((item): News => ({
                    _id: item._id.toString(),
                    title: item.title,
                    description: item.description || "",
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
                setError(err.message);
                setUserNotFound(true)
            });
    }, [profile]);


    if (userNotFound) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
                <div className="rounded-xl p-8 w-full text-center space-y-6">
                    <div className="text-red-500">
                        <AnimatedText text="Oops!" color="black" />
                    </div>
                    <p className="text-lg text-gray-400 font-medium mb-6 max-w-md mx-auto animate-fade-in-up">
                        {t("userNotFound")}
                    </p>
                    <LoaderLink
                        href="/"
                        className="inline-block px-10 py-3.5 bg-green-500 text-white animate-fade-in-up rounded-full font-semibold hover:bg-red-600 transition duration-300"
                    >
                        Go to Home
                    </LoaderLink>
                </div>
            </div>          
        );

    } else {

        if (!userData || !newsData) {
            return (
                <div className="flex items-center justify-center h-screen">
                    <div className="loader"></div>
                </div>
            );
        }
    }

    if (error) {
        return <div className="text-center text-red-500 mt-10">{error}</div>;
    }

    return (
        <>
            <MainContent
                username={profile}
                userData={userData}
                userPosts={{ posts: newsData }}
            />
        </>
    );
}

export default ProfileClientContent;
