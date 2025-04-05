"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { IoHomeOutline, IoHome, IoFlashOutline, IoFlash } from "react-icons/io5";
import { MdAddBox, MdOutlineAddBox } from "react-icons/md";
import { CgSearchLoading, CgSearch } from "react-icons/cg";
import { FaUser } from "react-icons/fa";
import HomePage from "@/src/app/page";
import RapidPage from "@/src/app/rapid/page";
import PostPage from "@/src/app/post/page";
import SearchPage from "@/src/app/search/page";
import ProfilePage from "@/src/app/[profile]/page";



export default function BottomNavigation() {
    const router = useRouter();
    const pathname = usePathname();

    // ✅ Extract tab from URL or default to "home"
    const currentTab = pathname.split("/")[1] || "home";
    const [activeTab, setActiveTab] = useState(currentTab);
    const [isVisible, setIsVisible] = useState(true);
    const [userName, setUserName] = useState<string | null>(null); // State to hold the fetched username
    let lastScrollY = 0;

    const tabs = [
        { key: "home", name: "Home", icon: IoHomeOutline, icon2: IoHome, component: <HomePage /> },
        { key: "rapid", name: "Rapid", icon: IoFlashOutline, icon2: IoFlash, component: <RapidPage /> },
        { key: "post", name: "Post", icon: MdOutlineAddBox, icon2: MdAddBox, component: <PostPage /> },
        { key: "search", name: "Search", icon: CgSearch, icon2: CgSearchLoading, component: <SearchPage /> },
        { key: userName, name: "Profile", icon: FaUser, icon2: FaUser, component: <ProfilePage /> },
    ];

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsVisible(currentScrollY < lastScrollY || currentScrollY === 0);
            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // ✅ Fetch username from the server when the component mounts
    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const response = await fetch("/api/userProfile/username"); // Adjust the endpoint as needed
                const data = await response.json();

                if (data.username) {
                    setUserName(data.username);
                } else {
                    console.error("Username not found.");
                }
            } catch (error) {
                console.error("Failed to fetch username:", error);
            }
        };

        fetchUserName();
    }, []);

    // ✅ Update URL on tab change
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        router.push(`/${tab}`, { scroll: false }); // Prevents page reload
    };

    return (
        <div className="flex flex-col h-screen">
            {/* ✅ ShadCN Tabs for Navigation */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-grow">
                {tabs.map(({ key, component }) => (
                    <TabsContent key={key} value={key} className="h-full">
                        {component}
                    </TabsContent>
                ))}

                {/* ✅ Scroll Hide/Show Navigation Bar */}
                <TabsList className={`fixed bottom-0 w-full bg-white flex justify-around p-2 pt-0 rounded-none z-50 h-auto transition-transform duration-300 ${isVisible ? "translate-y-0" : "translate-y-full"}`}>
                    {tabs.map(({ key, name, icon: Icon, icon2: Icon2 }) => (
                        <TabsTrigger key={key} value={key} className={`flex flex-col items-center flex-1 active:bg-gray-100 p-2 ${activeTab === key ? "border-t-[3px] border-green-500" : "border-t-1"}`}>
                            {activeTab === key ? <Icon2 size={24} className="text-green-600" /> : <Icon size={24} className="text-gray-400" />}
                            <span className={`text-xs font-bold mt-0.5 ${activeTab === key ? "text-green-600" : "text-gray-400"}`}>
                                {name}
                            </span>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </div>
    );
}
