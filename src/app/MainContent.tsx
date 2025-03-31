"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { IoMapOutline, IoNotificationsOutline } from "react-icons/io5";
import BreakingNewsSlider from "../components/BreakingNewsSlider";
import { Button } from "@/components/ui/button";
import ImagePost from "@/src/components/ImagePost";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import clsx from "clsx";

const filterOptions = ["Radius", "District", "Global"];
const categoryOptions = [
    "All", "Newest", "Technology", "Sports", "Business", "Science / Tech",
    "Crime", "Health & Fitness", "Education", "Travel",
    "Government & Politics", "Family & Relationships"
];

export default function MainContent() {
    const [selectedFilter, setSelectedFilter] = useState("Radius");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [newsData, setNewsData] = useState<any[]>([]);
    const [filteredNews, setFilteredNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFixedHeader, setShowFixedHeader] = useState(false);
    const [showFixedCategories, setShowFixedCategories] = useState(false);
    const [addShadow, setAddShadow] = useState(false);

    const lastScrollY = useRef(0);
    const categoriesRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    // 🟢 ✅ Check onboarding & permissions
   

    // 🟢 ✅ Fetch news data
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

    // 🟢 ✅ Filter news based on category
    useEffect(() => {
        if (selectedCategory === "All") {
            setFilteredNews(newsData);
        } else {
            setFilteredNews(newsData.filter((news) => news.categories.includes(selectedCategory)));
        }
    }, [selectedCategory, newsData]);

    // 🟢 ✅ Handle scroll events
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
            {/* Normal Header */}
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
                        <IoNotificationsOutline className="text-3xl scale-95" onClick={() => router.push("/pages/others/notifications")} />
                        <IoMapOutline className="text-3xl scale-95" onClick={() => router.push("/pages/others/map")} />
                    </div>
                </div>
            </div>

            {/* Breaking News */}
            <BreakingNewsSlider />

            {/* Categories */}
            <div ref={categoriesRef} className="w-full py-2 bg-white">
                <div className="flex gap-2 px-2 overflow-x-auto whitespace-nowrap">
                    {categoryOptions.map((category) => (
                        <Button
                            key={category}
                            size={100}
                            variant="outline"
                            className={`rounded-lg px-6 py-2 font-bold active:scale-95 text-xs ${selectedCategory === category ? "bg-black text-white" : ""}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
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
                            <IoNotificationsOutline className="text-3xl scale-95" onClick={() => router.push("/pages/others/notifications")} />
                            <IoMapOutline className="text-3xl scale-95" onClick={() => router.push("/pages/others/map")} />
                        </div>
                    </div>
                </div>
            )}

            {/* News Posts */}
            <div>
                {loading ? (
                    <p className="text-center text-gray-500">Loading news...</p>
                ) : (
                    filteredNews.map((news) => (
                        <div key={news.id} className="snap-start">
                            <ImagePost news={news} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
