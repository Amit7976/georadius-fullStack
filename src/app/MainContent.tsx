"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import interestsList from "@/public/json/interestList.json";
import NewsPost from "@/src/components/NewsPost";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoMapOutline, IoNotificationsOutline } from "react-icons/io5";
import TrendingNewsSlider from "../components/TrendingNewsSlider";
import { useGeolocation } from "./hooks/useGeolocation";

const filterOptions = ["Nearby", "District", "Global"];

export default function MainContent() {
    const [selectedFilter, setSelectedFilter] = useState("Nearby");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [newsData, setNewsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFixedHeader, setShowFixedHeader] = useState(false);
    const [showFixedCategories, setShowFixedCategories] = useState(false);
    const [addShadow, setAddShadow] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const lastScrollY = useRef(0);
    const categoriesRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const location = useGeolocation();



    const handleHide = (postId: number) => {
        setNewsData(prevNews => prevNews.filter(news => news._id !== postId));

        let hiddenPosts = JSON.parse(localStorage.getItem("hideNews") || "[]");
        if (!hiddenPosts.includes(postId)) {
            hiddenPosts.push(postId);
            localStorage.setItem("hideNews", JSON.stringify(hiddenPosts));
        }
    };

    useEffect(() => {
        if (!location) return;
        const range = selectedFilter === "Nearby"
            ? 50
            : selectedFilter === "District"
                ? 100
                : 7000;

        const fetchNearbyPosts = async (latitude: number, longitude: number) => {
            setLoading(true);
            try {
                const res = await fetch(`/api/main/category?category=${selectedCategory}&lat=${latitude}&lng=${longitude}&range=${range}&limit=5`);
                const json = await res.json();

                console.log('====================================');
                console.log(json);
                console.log('====================================');

                const hiddenPosts = JSON.parse(localStorage.getItem("hideNews") || "[]");
                const filteredNews = json.filter((news: any) => !hiddenPosts.includes(news._id));
                setNewsData(filteredNews);

            } catch (err) {
                console.error("API fetch error:", err);
                setError("Failed to fetch nearby posts.");
            } finally {
                setLoading(false);
            }
        };




        fetchNearbyPosts(location.lat, location.lng);

    }, [selectedFilter, selectedCategory, location]);


    useEffect(() => {
        if (error) {
            alert(error);
            setError(null);
        }
    }, [error]);


    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const screenHeight = window.innerHeight;
            const categoriesTop = categoriesRef.current?.offsetTop || 0;

            if (currentScrollY > screenHeight && currentScrollY < lastScrollY.current) {
                setShowFixedHeader(true);
            } else if (currentScrollY > screenHeight && currentScrollY > lastScrollY.current) {
                setShowFixedHeader(false);
            }

            setShowFixedCategories(currentScrollY > categoriesTop);
            setAddShadow(currentScrollY > 0);

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);



    return (
        <div className="h-screen w-full bg-white p-0 scroll-smooth">


            <div className="sticky top-0 w-full bg-white z-50 transition-shadow">
                <div className="flex justify-between items-center p-3 pb-1.5 bg-white">
                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                        <SelectTrigger className="w-fit border-0 text-2xl font-bold shadow-none px-0 scale-90">
                            <SelectValue placeholder="Select Filter" />
                        </SelectTrigger>
                        <SelectContent className={""}>
                            {filterOptions.map((option) => (
                                <SelectItem key={option} value={option} className="text-xl font-semibold py-2">
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="flex items-center gap-4 pr-1">
                        <IoMapOutline className="text-3xl scale-95" onClick={() => router.replace("/pages/others/map")} />
                    </div>
                </div>
            </div>



            <div className="bg-green-600 text-white font-medium p-2 pr-5 my-2 text-sm overflow-hidden whitespace-nowrap relative flex items-center">
                <div
                    className="relative flex items-center gap- flex-4"
                    style={{
                        animation: 'scrollText 50s linear infinite ',
                    }}
                >
                    <span>
                        Thundering with Thunderstorm, Very Strong Winds, Lightning, and Dust Storm is very likely to occur at many places over Ajmer, Didwana-Kuchaman, Dudu, Jaipur, Jaipur (Gramin), Nagaur, Neem Ka Thana, Sikar in next 3 hours.
                    </span>
                </div>

                <style jsx>{`
                                @keyframes scrollText {
                                0% {
                                    transform: translateX(10%);
                                }
                                100% {
                                    transform: translateX(-100%);
                                }
                                }
                            `}</style>
            </div>





            {/* Trending News */}
            <TrendingNewsSlider
                range={
                    selectedFilter === "Nearby"
                        ? 50
                        : selectedFilter === "District"
                            ? 100
                            : 7000
                }
            />




            {/* Categories */}
            <div ref={categoriesRef} className="w-full py-2 bg-white">
                <div className="flex gap-2 px-2 overflow-x-auto whitespace-nowrap">
                    <Button
                        size={100}
                        variant="outline"
                        className={`rounded-lg px-6 py-2 font-bold active:scale-95 text-xs ${selectedCategory === "All" ? "bg-black text-white" : ""}`}
                        onClick={() => setSelectedCategory("All")}
                    >
                        All
                    </Button>
                    {interestsList.map((category, index) => (
                        <Button
                            key={index}
                            size={100}
                            variant="outline"
                            className={`rounded-lg px-6 py-2 font-bold active:scale-95 text-xs ${selectedCategory === category.name ? "bg-black text-white" : ""}`}
                            onClick={() => setSelectedCategory(category.name)}
                        >
                            {category.name}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Fixed Header */}
            {showFixedHeader && (
                <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50 transition-transform duration-300">
                    <div className="flex justify-between items-center p-3">
                        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                            <SelectTrigger className="w-fit border-0 text-2xl font-bold shadow-none px-0 scale-90">
                                <SelectValue placeholder="Select Filter" />
                            </SelectTrigger>
                            <SelectContent className={""}>
                                {filterOptions.map((option) => (
                                    <SelectItem key={option} value={option} className="text-xl font-semibold py-2">
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex items-center gap-4 pr-1">
                            <IoMapOutline className="text-3xl scale-95" onClick={() => router.replace("/pages/others/map")} />
                        </div>
                    </div>
                </div>
            )}

            {/* News Posts */}
            <div>
                {loading ? (
                    <div className="flex items-center justify-center h-screen"><div className="loader"></div></div>
                ) : (
                    newsData.length > 0 ? (
                        newsData.map((news) => (
                            <div key={news._id} className="snap-start">
                                <NewsPost news={news} key={news._id} onHide={handleHide} fullDescription={false} />
                            </div>
                        ))) : (
                        <div className="flex flex-col gap-2 py-10">
                            <p className="text-center text-gray-500">No News Available.</p>
                        </div>

                    )
                )}
            </div>
        </div>
    );
}
