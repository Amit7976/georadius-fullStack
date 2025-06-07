"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IoSettingsOutline } from "react-icons/io5";
import { FaArrowLeftLong } from "react-icons/fa6";
import Image from "next/image";
import NewsPost from "@/src/components/NewsPost";

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

interface MainContentProps {
    username: string;
    userData: UserData;
    userPosts: {
        posts: News[];
    };
}

export default function MainContent({
    username,
    userData,
    userPosts,
}: MainContentProps) {
    const router = useRouter();
    const [newsData, setNewsData] = useState<News[]>([]);

    // Filter out hidden posts when userPosts.posts changes
    useEffect(() => {
        const hiddenPosts: string[] = JSON.parse(localStorage.getItem("hideNews") || "[]");
        const postsArray = Array.isArray(userPosts.posts) ? userPosts.posts : [];
        const filtered = postsArray.filter((post) => !hiddenPosts.includes(post._id));
        setNewsData(filtered);
    }, [userPosts.posts]);

    const handleHide = (postId: string) => {
        setNewsData((prev) => prev.filter((post) => post._id !== postId));

        const hiddenPosts: string[] = JSON.parse(localStorage.getItem("hideNews") || "[]");
        if (!hiddenPosts.includes(postId)) {
            hiddenPosts.push(postId);
            localStorage.setItem("hideNews", JSON.stringify(hiddenPosts));
        }
    };

    const handleShare = () => {
        const url = `${window.location.origin}/${username}`;
        if (navigator.share) {
            navigator
                .share({
                    title: "Check out this profile!",
                    text: "Here is a profile you might be interested in.",
                    url,
                })
                .catch((err) => console.error("Share failed:", err));
        } else {
            alert("Sharing not supported on this device.");
        }
    };

    return (
        <div className="bg-white">
            {/* Header */}
            <div className="flex items-center justify-between py-5 p-4">
                <div className="flex items-center gap-4 relative">
                    {!userData.currentUserProfile && (
                        <FaArrowLeftLong
                            onClick={() => router.back()}
                            className="text-lg w-5 cursor-pointer mt-1"
                        />
                    )}
                    <h2 className="text-lg font-bold">{username}</h2>
                </div>
                <IoSettingsOutline
                    className="text-2xl cursor-pointer"
                    onClick={() => router.push("/pages/others/settings")}
                />
            </div>

            {/* Profile Info */}
            <div className="flex items-start gap-4 my-2 p-4">
                <div className="flex-1">
                    <Image
                        width={100}
                        height={100}
                        src={userData.profileImage}
                        alt="Profile Pic"
                        className="w-full aspect-square border-4 border-green-500 rounded-full object-cover"
                    />
                </div>
                <div className="flex-3 mt-1 space-y-2">
                    <h3 className="text-xl font-bold">{userData.fullname}</h3>
                    <p
                        className="text-gray-500 text-sm font-medium"
                        dangerouslySetInnerHTML={{
                            __html: userData.bio.replace(/\r?\n/g, "<br />"),
                        }}
                    />
                    <p className="text-gray-400 font-semibold text-xs mt-3">{userData.location}</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row justify-between gap-3 px-3">
                {userData.currentUserProfile && (
                    <Button
                        variant="primary"
                        onClick={() => router.push("/pages/others/updateprofile")}
                        className="bg-gray-200 w-full flex-1 h-10 text-gray-600 font-semibold text-sm active:scale-95"
                    >
                        Update Profile
                    </Button>
                )}

                <Button
                    variant="primary"
                    onClick={handleShare}
                    className="bg-gray-200 w-full flex-1 h-10 text-gray-600 font-semibold text-sm active:scale-95"
                >
                    Share Profile
                </Button>
            </div>

            {/* News Posts */}
            <div className="mt-6 mb-20">
                {newsData.length > 0 ? (
                    newsData.map((news) => (
                        <NewsPost
                            news={news}
                            key={news._id}
                            onHide={() => handleHide(news._id)}
                            fullDescription={false}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500">No posts to show</p>
                )}
            </div>
        </div>
    );
}
