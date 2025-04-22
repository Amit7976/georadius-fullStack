"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoSettingsOutline } from "react-icons/io5";
import NewsPost from "@/src/components/NewsPost";
import { FaArrowLeftLong } from "react-icons/fa6";

function MainContent({ username, userData, userPosts }: any) {
    const router = useRouter();
    const [newsData, setNewsData] = useState<any[]>([]);

    useEffect(() => {
        const hiddenPosts = JSON.parse(localStorage.getItem("hideNews") || "[]");
        const filteredNews = userPosts.posts.filter((news: any) => !hiddenPosts.includes(news._id));
        setNewsData(filteredNews);
    }, [userPosts.posts]); // ✅ Run only when `userPosts.posts` changes

    const handleHide = (postId: number) => {
        setNewsData(prevNews => prevNews.filter(news => news._id !== postId));

        let hiddenPosts = JSON.parse(localStorage.getItem("hideNews") || "[]");
        if (!hiddenPosts.includes(postId)) {
            hiddenPosts.push(postId);
            localStorage.setItem("hideNews", JSON.stringify(hiddenPosts));
        }
    };

    const handleShare = () => {
        const url = `${window.location.origin}/${username}`;
        if (navigator.share) {
            navigator.share({
                title: "Check out this profile!",
                text: "Here is a profile you might be interested in.",
                url: url,
            }).catch((error) => console.error("Error sharing profile:", error));
        } else {
            alert("Sharing not supported on this device.");
        }
    };

    return (
        <div className="bg-white">
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
                <IoSettingsOutline className="text-2xl" onClick={() => router.push("/pages/others/settings")} />
            </div>

            <div className="flex items-start gap-4 my-2 p-4">
                <div className="flex-1">
                    <img src={userData.profileImage} alt="Profile Pic"
                        className="w-full aspect-square border-4 border-green-500 rounded-full object-cover" />
                </div>
                <div className="flex-3 mt-1 space-y-2">
                    <h3 className="text-xl font-bold">{userData.fullname}</h3>
                    <p className="text-gray-500 text-sm font-medium" dangerouslySetInnerHTML={{
                        __html: userData.bio.replace(/\r?\n/g, "<br />"),
                    }}></p>
                    <p className="text-gray-400 font-semibold text-xs mt-3">{userData.location}</p>
                </div>
            </div>

            <div className="flex flex-row justify-between gap-3 px-3">
                {userData.currentUserProfile && (
                    <Button variant={"primary"} size={100} onClick={() => router.push("/pages/others/updateprofile")}
                        className="bg-gray-200 w-full flex-1 h-10 text-gray-600 font-semibold text-sm active:scale-95">
                        Update Profile
                    </Button>
                )}

                <Button variant="primary" size={100} onClick={handleShare}
                    className="bg-gray-200 w-full flex-1 h-10 text-gray-600 font-semibold text-sm active:scale-95">
                    Share Profile
                </Button>
            </div>

            {/* News Posts */}
            <div className="mt-6 mb-20">
                {newsData.map((news: any) => (
                    <NewsPost news={news} key={news._id} onHide={handleHide} fullDescription={false} />
                ))}
            </div>
        </div>
    );
}

export default MainContent;
