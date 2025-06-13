"use client";
import { useEffect, useState } from "react";
import MainContent from "./MainContent";
import { LoaderLink } from "@/src/components/loaderLinks";
import { AnimatedText } from "@/src/components/Animate";
import { t } from "@/src/helpers/i18n";
import { News, UserData } from "@/src/helpers/types";
import { PlaceholderPost, PlaceholderUserProfile } from "@/src/components/home/Placeholder";


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


type Props = {
    profile: string;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////

function ProfileClientContent({ profile }: Props) {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [currentLoginUsername, setCurrentLoginUsername] = useState("");
    const [newsData, setNewsData] = useState<News[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [userNotFound, setUserNotFound] = useState(false);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        if (!profile) return;

        /////////////////////////////////////////////////////////////////////////////////////////////////////

        fetch("/api/userProfile/username", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: profile }),
        })
            .then(async (res) => res.json())
            .then((data) => {
                
                if (!Array.isArray(data.posts)) {
                    setUserNotFound(true);
                    return;
                }

                /////////////////////////////////////////////////////////////////////////////////////////////////////

                const formattedPosts: News[] = data.posts.map((item: News) => ({
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
                    topComments: item.topComments || [],
                    currentUserProfile: item.currentUserProfile ?? false,
                    upvoteCount: item.upvoteCount || 0,
                    downvoteCount: item.downvoteCount || 0,
                    isUserUpvote: item.isUserUpvote || false,
                    isUserDownvote: item.isUserDownvote || false,
                    isSaved: item.isSaved || false,
                }));

                /////////////////////////////////////////////////////////////////////////////////////////////////////

                setUserData(data.user);
                setCurrentLoginUsername(data.currentLoginUsername);
                setNewsData(formattedPosts);
                setError(null);
            })
            .catch((err) => {
                setError(err.message);
                setUserNotFound(true);
            });
    }, [profile]);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    // Filter out hidden posts once
    useEffect(() => {
        const hiddenPosts: string[] = JSON.parse(localStorage.getItem("hideNews") || "[]");

        if (Array.isArray(newsData)) {
            const filtered = newsData.filter((post) => !hiddenPosts.includes(post._id));
            setNewsData(filtered);
        }
    }, []);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const handleHide = (postId: string) => {
        setNewsData((prev) => (prev ? prev.filter((post) => post._id !== postId) : null));

        const hiddenPosts: string[] = JSON.parse(localStorage.getItem("hideNews") || "[]");
        if (!hiddenPosts.includes(postId)) {
            hiddenPosts.push(postId);
            localStorage.setItem("hideNews", JSON.stringify(hiddenPosts));
        }
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    if (userNotFound) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-transparent">
                <div className="rounded-xl p-8 w-full text-center space-y-6">
                    <div className="text-red-500">
                        <AnimatedText text="Oops!" />
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
    } else if (!userData || !newsData) {
        return (
            <>
                <PlaceholderUserProfile />
                <PlaceholderPost />
            </>
        );
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    if (error) {
        return <div className="text-center text-red-500 mt-10">{error}</div>;
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <MainContent
            username={profile}
            userData={userData}
            handleHide={handleHide}
            currentLoginUsername={currentLoginUsername}
            userPosts={newsData}
        />
    );
}

export default ProfileClientContent;
