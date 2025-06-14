"use client";
import NewsPost from '@/src/components/NewsPost';
import { useEffect, useState } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { t } from '@/src/helpers/i18n';
import BackButton from '@/src/components/BackButton';
import { News } from '@/src/helpers/types';
import { PlaceholderPost } from '@/src/components/home/Placeholder';


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


function Page() {
    const [data, setData] = useState<News[]>([]);
    const [currentLoginUsername, setCurrentLoginUsername] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const location = useGeolocation();

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        const fetchNearbyPosts = async (latitude: number, longitude: number) => {
            setLoading(true);
            try {
                const hiddenPosts: string[] = JSON.parse(localStorage.getItem("hideNews") || "[]");

                const res = await fetch(`/api/main/nearby?lat=${latitude}&lng=${longitude}&range=7000&limit=20&images=0`);
                const data = await res.json();
                if (data?.posts) {
                    const filteredNews: News[] = data.posts.filter((news: News) => !hiddenPosts.includes(news._id));
                    setData(filteredNews);
                    setCurrentLoginUsername(data.currentLoginUsername);
                }
            } catch (err) {
                console.error("API fetch error:", err);
                setError(t("failedToFetchNearbyPosts"));
            } finally {
                setLoading(false);
            }
        };

        fetchNearbyPosts(location.lat, location.lng);
    }, []);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    if (error) return <p className="text-red-500 text-center">{error}</p>;

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    if (loading) return (
        <div className='py-3'>
            <div className='flex justify-start items-center gap-0'>
                <BackButton classname='relative text-sm pl-0 pr-5' />
                <h2 className="text-xl font-bold">{t("breaking")} <span className='text-green-500'>{t("news")}</span></h2>
            </div>
            <div className="py-6 px-1">
                <PlaceholderPost />
            </div>
        </div>
    );

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    if (!data || data.length === 0) return (
        <>
            <div className="h-screen w-full flex items-center justify-center">
                <p className='text-xl font-medium text-gray-500'>{t("noBreakingNewsNearByYou")}</p>
            </div>
        </>
    );

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const handleHide = (postId: string) => {
        setData(prevNews => prevNews.filter(news => news._id !== postId.toString()));

        const hiddenPosts = JSON.parse(localStorage.getItem("hideNews") || "[]");
        if (!hiddenPosts.includes(postId)) {
            hiddenPosts.push(postId);
            localStorage.setItem("hideNews", JSON.stringify(hiddenPosts));
        }
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <div className='py-3'>
            <div className='flex justify-start items-center gap-0'>
                <BackButton classname='relative text-sm pl-0 pr-5' />
                <h2 className="text-xl font-bold">{t("breaking")} <span className='text-green-500'>{t("news")}</span></h2>
            </div>
            <div className="py-6 px-1">
                {data.map((news) => (
                    <NewsPost news={news} key={news._id} onHide={handleHide} fullDescription={false} currentLoginUsername={currentLoginUsername} />
                ))}
            </div>
        </div>
    );
}

export default Page;
