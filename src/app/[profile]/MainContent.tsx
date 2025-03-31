"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ImagePost from "@/src/components/ImagePost";
import { IoSettingsOutline } from "react-icons/io5";

function MainContent({ params }: any) {
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
    const router = useRouter();

    return (
        <>
            <div className="bg-white">
                <div className="flex items-center justify-between p-6">
                    <h2 className="text-lg font-bold">{params.profile}</h2>
                    <IoSettingsOutline className="text-2xl" onClick={() => router.push("/pages/others/settings")} />
                </div>

                <div className="flex items-start gap-4 my-2 p-4">
                    <div className="flex-1">
                        <img
                            src="/images/profileIcon/image.jpg"
                            alt="Profile Pic"
                            className="w-full border-4 border-green-500 rounded-full object-cover"
                        />
                    </div>
                    <div className="flex-3 mt-1 space-y-2">
                        <h3 className="text-xl font-bold">Amit Gupta</h3>
                        <p className="text-gray-500 text-base font-medium">
                            Hi, I am Amit Agrawal, I am a software engineer and I love to code. I am a full-stack web app developer and I love to work on new technologies.
                        </p>
                        <p className="text-gray-400 font-semibold text-sm mt-3">Jaipur, Rajasthan, India</p>
                    </div>
                </div>

                <div className="flex flex-row justify-between gap-3 px-3">
                    <Button variant={"primary"} size={100} onClick={() => router.push("/pages/others/updateprofile")} className="bg-gray-200 w-full flex-1 h-10 text-gray-600 font-semibold text-sm active:scale-95">
                        Update Profile
                    </Button>
                    <Button variant={"primary"} size={100} onClick={() => { }} className="bg-gray-200 w-full flex-1 h-10 text-gray-600 font-semibold text-sm active:scale-95">
                        Share Profile
                    </Button>
                </div>
                
                {/* News Posts */}
                <div className="mt-6 mb-20">
                    {loading ? (
                        <p className="text-center text-gray-500">Loading news...</p>
                    ) : (
                        newsData.map((news) => <ImagePost key={news.id} news={news} />)
                    )}
                </div>
            </div>
        </>
    );
}

export default MainContent;
