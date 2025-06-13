"use client";
import { DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import DeleteButton from "@/src/components/DeleteButton";
import HideButton from "@/src/components/HideButton";
import { LoaderLink } from "@/src/components/loaderLinks";
import QrButton from "@/src/components/QrButton";
import VoteButtons from "@/src/components/VoteButtons";
import { formatTimeAgo } from "@/src/helpers/formatTimeAgo";
import { t } from "@/src/helpers/i18n";
import { News } from "@/src/helpers/types";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { TbReport } from "react-icons/tb";
import PullToRefresh from "react-pull-to-refresh";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { useGeolocation } from "../hooks/useGeolocation";
import GetDistance from "./GetDistance";


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


export default function MainContent() {
    const [newsData, setNewsData] = useState<News[]>([]);
    const [posts, setPosts] = useState<News[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const location = useGeolocation();
    const [openDrawerId, setOpenDrawerId] = useState<string | null>(null);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        const hiddenPosts = JSON.parse(localStorage.getItem("hideNews") || "[]");
        const filteredNews = posts.filter((news: News) => !hiddenPosts.includes(news._id));
        setNewsData(filteredNews);
    }, [posts]);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const handleHide = (postId: string) => {
        setNewsData(prev => prev.filter(news => news._id !== postId));
        const hidden = JSON.parse(localStorage.getItem("hideNews") || "[]");
        if (!hidden.includes(postId)) {
            hidden.push(postId);
            localStorage.setItem("hideNews", JSON.stringify(hidden));
        }
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        if (!location) return;
        const fetchNearbyPosts = async (lat: number, lng: number) => {
            try {
                const res = await fetch(`/api/rapid/nearby?lat=${lat}&lng=${lng}`);
                const json = await res.json();
                setPosts(json);
            } catch (err) {
                console.error("API fetch error:", err);
                setError("Failed to fetch nearby posts.");
            } finally {
                setLoadingPosts(false);
            }
        };
        fetchNearbyPosts(location.lat, location.lng);
    }, [location]);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const handleRefresh = async () => {
        window.location.reload();
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const handleDrawerOpen = (postId: string) => {
        setOpenDrawerId(postId);
        window.location.hash = postId;
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const handleDrawerClose = () => {
        setOpenDrawerId(null);
        history.pushState("", document.title, window.location.pathname + window.location.search);
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        const onHashChange = () => {
            if (!window.location.hash && openDrawerId) {
                setOpenDrawerId(null);
            }
        };
        window.addEventListener("hashchange", onHashChange);
        return () => window.removeEventListener("hashchange", onHashChange);
    }, [openDrawerId]);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        if (window.location.hash) {
            const hash = window.location.hash.replace("#", "");
            setOpenDrawerId(hash);
        }
    }, []);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    if (loadingPosts) return <div className="flex items-center justify-center h-[94vh]"><div className="loader"></div></div>;

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    if (error) return <p className="text-red-500">{error}</p>;

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <PullToRefresh onRefresh={handleRefresh} resistance={5}>
            <div className="bg-gray-100 dark:bg-neutral-800">
                <Swiper direction="vertical" slidesPerView={1} className="h-[94vh] w-full">
                    {newsData.map(post => (
                        post.images.length > 0 && (
                            <SwiperSlide key={post._id} className="relative flex items-center justify-center w-full">
                                <Swiper direction="horizontal" slidesPerView={1} className="w-full h-[50vh] z-10 relative">
                                    {post.images.map(image => (
                                        <SwiperSlide key={image} className="relative flex items-center justify-center w-full">
                                            <Image src={image} alt={post.title} layout="fill" sizes="full" objectFit="cover" priority />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                {/* Menu Drawer */}
                                <div className="absolute top-5 right-4 z-50">
                                    <Drawer>
                                        <DrawerTrigger>
                                            <HiDotsVertical className="text-2xl text-gray-500" />
                                        </DrawerTrigger>
                                        <DrawerContent className={""}>
                                            <div className="px-4 py-10 space-y-6">
                                                <DialogTitle className="flex gap-2 px-4 flex-wrap">
                                                    {post.categories.map((cat, idx) => (
                                                        <LoaderLink key={idx} href={`/category/${cat}`} className="bg-gray-200 dark:bg-neutral-800 rounded-sm px-5 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-green-500 cursor-pointer">
                                                            {cat}
                                                        </LoaderLink>
                                                    ))}
                                                </DialogTitle>

                                                <div className="space-y-2">
                                                    <HideButton postId={post._id} onHide={() => handleHide(post._id)} />
                                                    <QrButton postId={post._id} />
                                                    {post.currentUserProfile ? (
                                                        <>
                                                            <LoaderLink href={`/pages/edit_post/${post._id}`} className="flex gap-3 w-full p-3 text-lg justify-start cursor-pointer text-gray-700 hover:bg-gray-100 dark:text-gray-300 border-2 rounded-lg bg-gray-100 dark:bg-neutral-800">
                                                                <Pencil /> {t("edit")}
                                                            </LoaderLink>
                                                            <DeleteButton postId={post._id} onHide={() => handleHide(post._id)} />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <LoaderLink href={`/${post.creatorName}`} className="flex gap-3 w-full p-3 text-lg justify-start cursor-pointer text-gray-700 hover:bg-gray-100 dark:text-gray-300 border-2 rounded-lg bg-gray-100 dark:bg-neutral-800">
                                                                <Image src={post.creatorImage} alt="Profile" width={40} height={40} className="rounded-full size-5" priority /> {t("viewProfile")}
                                                            </LoaderLink>
                                                            <LoaderLink href={`/pages/others/report_an_issue/${post._id}`} className="flex gap-3 w-full p-3 text-lg justify-start cursor-pointer text-gray-700 hover:bg-gray-100 dark:text-gray-300 border-2 rounded-lg bg-gray-100 dark:bg-neutral-800">
                                                                <TbReport className="size-6" /> {t("report")}
                                                            </LoaderLink>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </DrawerContent>
                                    </Drawer>
                                </div>

                                {/* Post Drawer */}
                                <Drawer open={openDrawerId === post._id} onOpenChange={(isOpen: boolean) => {
                                    if (isOpen) handleDrawerOpen(post._id);
                                    else handleDrawerClose();
                                }}>
                                    <DrawerTrigger asChild>
                                        <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-neutral-900 h-[50vh] px-5 pt-8 pb-16 overflow-hidden text-black dark:text-white flex flex-col justify-start z-50 pointer-events-none rounded-t-4xl border">
                                            {post.latitude && post.longitude && (
                                                <GetDistance lat={post.latitude} lng={post.longitude} location={post.location} />
                                            )}
                                            <h2 className="text-2xl font-bold pr-10 pointer-events-auto">{post.title}</h2>
                                            <div className="flex items-center justify-between gap-3 w-full mt-4 mb-1 pointer-events-auto">
                                                <div className="flex items-center gap-2">
                                                    <Image src={post.creatorImage} alt={post.creatorName} width={40} height={40} className="rounded-full" priority />
                                                    <span className="text-base font-semibold">{post.creatorName}</span>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-500">{formatTimeAgo(post.createdAt)}</span>
                                            </div>
                                            <div className="bg-gradient-to-b from-transparent via-white to-white dark:via-neutral-900 dark:to-neutral-900 h-[10vh] w-full absolute bottom-0"></div>
                                            <p className="text-xl text-gray-400 font-medium mt-6 cursor-pointer pointer-events-auto">
                                                {post.description.split(" ").slice(0, 20).join(" ")}
                                            </p>
                                        </div>
                                    </DrawerTrigger>
                                    <DrawerContent className="p-0 pointer-events-auto h-screen data-[vaul-drawer-direction=bottom]:max-h-screen">
                                        <div className="overflow-y-scroll py-20 px-4">
                                            <span className="text-sm font-semibold text-gray-500">{formatTimeAgo(post.createdAt)}</span>
                                            <DrawerTitle className="pt-4 text-2xl font-bold pr-10 capitalize">{post.title}</DrawerTitle>
                                            <div className="flex items-center justify-between gap-3 w-full mt-6 mb-1">
                                                <div className="flex items-center gap-2">
                                                    <Image src={post.creatorImage} alt={post.creatorName} width={40} height={40} className="rounded-full" priority />
                                                    <span className="text-base font-semibold">{post.creatorName}</span>
                                                </div>
                                                <VoteButtons news={post} />
                                            </div>
                                            <div className="mt-8">
                                                {post.latitude && post.longitude && (
                                                    <GetDistance lat={post.latitude} lng={post.longitude} location={post.location} />
                                                )}
                                            </div>
                                            <p className="text-xl text-gray-400 font-medium mt-5 cursor-pointer text-balance">
                                                {post.description.split(" ").slice(0, 30).join(" ") + "..."}
                                            </p>
                                        </div>
                                    </DrawerContent>
                                </Drawer>
                            </SwiperSlide>
                        )
                    ))}
                </Swiper>
            </div>
        </PullToRefresh>
    );
}
