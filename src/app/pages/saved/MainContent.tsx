"use client";
import BackButton from '@/src/components/BackButton';
import NewsPost from '@/src/components/NewsPost';
import { t } from '@/src/helpers/i18n';
import { News } from '@/src/helpers/types';
import { useEffect, useState } from 'react';



function MainContent() {
    const [data, setData] = useState<News[]>([]);
    const [currentLoginUsername, setCurrentLoginUsername] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNearbyPosts = async () => {
            try {
                const res = await fetch(`/api/main/saved`);
                const data = await res.json();
                if (data?.posts) {
                    setData(data.posts);
                    setCurrentLoginUsername(data.currentLoginUsername);
                }
            } catch (err) {
                console.error("API fetch error:", err);
                setError(t("failedToFetchSavedPosts"));
            }
        };

        fetchNearbyPosts();
    }, []);

    if (error) return <p className="text-red-500 text-center">{error}</p>;
    if (!data || data.length === 0) return (
        <>
            <div className="h-screen w-full flex items-center justify-center">
                <p className='text-xl font-medium text-gray-500'>{t("noNewsSavedYet")}</p>
            </div>
        </>
    );

    const handleHide = (postId: string) => {
        setData(prevNews => prevNews.filter(news => news._id !== postId.toString()));

        const hiddenPosts = JSON.parse(localStorage.getItem("hideNews") || "[]");
        if (!hiddenPosts.includes(postId)) {
            hiddenPosts.push(postId);
            localStorage.setItem("hideNews", JSON.stringify(hiddenPosts));
        }
    };

    return (
        <div className='py-3'>
            <div className='flex justify-start items-center gap-0'>
                <BackButton classname='relative text-sm pl-0 pr-5' />
                <h2 className="text-xl font-bold">{t("saved")} <span className='text-green-500'>{t("news")}</span></h2>
            </div>
            <div className="py-6 px-1">
                {data.map((news) => (
                    <NewsPost news={news} key={news._id} onHide={handleHide} fullDescription={false} currentLoginUsername={currentLoginUsername} />
                ))}
            </div>
        </div>
    );
}

export default MainContent;
