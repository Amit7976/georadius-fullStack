"use client";
import { useGeolocation } from "@/src/app/hooks/useGeolocation";
import { getDistanceFromCurrentLocation } from "@/src/helpers/getDistanceFromCurrentLocation";
import { t } from "@/src/helpers/i18n";
import { News, TrendingNewsPost } from "@/src/helpers/types";
import { useEffect, useRef, useState } from "react";
import CategoryTabs from "../components/home/CategoryTabs";
import HeaderFilter from "../components/home/HeaderFilter";
import LocationDeniedBanner from "../components/home/locationDenied";
import TrendingNewsSlider from "../components/TrendingNewsSlider";



export default function MainContent() {
    const [selectedFilter, setSelectedFilter] = useState(t("nearby"));
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [newsData, setNewsData] = useState<News[]>([]);
    const [trendingNews, setTrendingNews] = useState<TrendingNewsPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const categoriesRef = useRef<HTMLDivElement | null>(null);
    const [currentLoginUsername, setCurrentLoginUsername] = useState("");

    const location = useGeolocation();

    useEffect(() => {
        if (error) {
            alert(error);
            setError(null);
        }
    }, [error]);

    const handleHide = (postId: string) => {
        setNewsData(prevNews => prevNews.filter(news => news._id !== postId.toString()));

        const hiddenPosts = JSON.parse(localStorage.getItem("hideNews") || "[]");
        if (!hiddenPosts.includes(postId)) {
            hiddenPosts.push(postId);
            localStorage.setItem("hideNews", JSON.stringify(hiddenPosts));
        }
    };

    useEffect(() => {
        if (!location) return;
        const range = selectedFilter === "Nearby"
            ? Number(localStorage.getItem("radius")) || 10
            : selectedFilter === "District"
                ? 100
                : 7000;

        const fetchNearbyPosts = async (latitude: number, longitude: number) => {
            setLoading(true);
            try {
                const hiddenPosts: string[] = JSON.parse(localStorage.getItem("hideNews") || "[]");

                const res = await fetch(`/api/main/category`, {
                    method: "POST", // ✅ Changed to POST
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        hiddenPostIds: hiddenPosts,
                        category: selectedCategory,
                        lat: latitude,
                        lng: longitude,
                        range: range,
                        limit: 50,
                    }),
                });

                const json = await res.json();

                setCurrentLoginUsername(json.currentLoginUsername);
                // console.log('/////////////////////////////////////////////////////');
                // console.log(json);
                // console.log('/////////////////////////////////////////////////////');
                // console.log(json.posts);
                // console.log('/////////////////////////////////////////////////////');

                // ✅ Remove hidden posts
                const filteredNews: News[] = json.posts.filter((news: News) => !hiddenPosts.includes(news._id));

                // console.log('====================================');
                // console.log(filteredNews);
                // console.log('====================================');
                setNewsData(filteredNews);

                if (selectedCategory === "All") {
                    try {
                        // console.log('====================================');
                        // console.log("all");
                        // console.log('====================================');

                        const postsWithImages = filteredNews.filter(
                            (post: News) => Array.isArray(post.images) && post.images.length > 0
                        );

                        const topPostsWithImages = await Promise.all(
                            postsWithImages.map(async (post: News) => {
                                const upvoteCount = post.upvoteCount;
                                let distance = "";

                                try {
                                    const { formattedDistance } = await getDistanceFromCurrentLocation(
                                        post.latitude ?? 0,
                                        post.longitude ?? 0
                                    );
                                    distance = formattedDistance;
                                } catch {
                                    distance = t("nearby");
                                }

                                return {
                                    _id: post._id,
                                    image: post.images[0],
                                    title: post.title,
                                    creatorName: post.creatorName,
                                    createdAt: post.createdAt,
                                    distance,
                                    upvoteCount,
                                };
                            })
                        );

                        const sortedTop = topPostsWithImages
                            .sort((a, b) => b.upvoteCount - a.upvoteCount)
                            .slice(0, 5);

                        setTrendingNews(sortedTop);
                    } catch (err) {
                        // console.log('====================================');
                        console.log(err);
                        // console.log('====================================');
                    }
                }
            } catch (err) {
                console.error("API fetch error:", err);
                setError("Failed to fetch nearby posts.");
            } finally {
                setLoading(false);
            }
        };

        fetchNearbyPosts(location.lat, location.lng);
    }, [selectedFilter, selectedCategory]);


    return (
        <div className="h-screen w-full p-0 scroll-smooth">

            {/* Header Filter */}
            <HeaderFilter selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />

            {/* Location Banner */}
            <LocationDeniedBanner />


            {/* Trending News */}
            <TrendingNewsSlider trendingNews={trendingNews} loading={loading} />

            {/* Categories News */}
            <CategoryTabs selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} currentLoginUsername={currentLoginUsername} handleHide={handleHide} loading={loading} newsData={newsData} categoriesRef={categoriesRef} />

        </div>
    );
}
