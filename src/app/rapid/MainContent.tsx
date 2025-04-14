"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination } from "swiper/modules";
import { formatDistanceToNow } from "date-fns";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { HiDotsVertical } from "react-icons/hi";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { formatNumber } from "@/src/helpers/formatNumber";
import VoteButtons from "@/src/components/VoteButtons";
import { formatTimeAgo } from "@/src/helpers/formatTimeAgo";
import HideButton from "@/src/components/HideButton";
import QrButton from "@/src/components/QrButton";
import Link from "next/link";
import { MoreHorizontal, Pencil } from "lucide-react";
import DeleteButton from "@/src/components/DeleteButton";
import { TbReport } from "react-icons/tb";


export default function MainContent({ posts }: any) {

    const [newsData, setNewsData] = useState<any[]>([]);

    useEffect(() => {
        const hiddenPosts = JSON.parse(localStorage.getItem("hideNews") || "[]");
        const filteredNews = posts.filter((news: any) => !hiddenPosts.includes(news._id));
        setNewsData(filteredNews);
    }, [posts]); // ✅ Run only when `userPosts.posts` changes

    const handleHide = (postId: number) => {
        setNewsData(prevNews => prevNews.filter(news => news._id !== postId));

        let hiddenPosts = JSON.parse(localStorage.getItem("hideNews") || "[]");
        if (!hiddenPosts.includes(postId)) {
            hiddenPosts.push(postId);
            localStorage.setItem("hideNews", JSON.stringify(hiddenPosts));
        }
    };


    return (
        <>
            <div className="bg-neutral-800">
                <Swiper
                    direction="vertical"
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    className="h-[92vh] w-full"
                >
                    {newsData.map((post: any) => (
                        (post.images.length) > 0 && (
                            <SwiperSlide key={post.id} className="relative flex items-center justify-center w-full">
                                <Swiper
                                    direction="horizontal"
                                    slidesPerView={1}
                                    pagination={{ clickable: true }}
                                    className="h-[92vh] w-full z-10"
                                >
                                    {post.images.map((image: any) => (
                                        <SwiperSlide key={image} className="relative flex items-center justify-center w-full">
                                            <Image src={image} alt={post.title} layout="fill" objectFit="cover" priority />
                                        </SwiperSlide>
                                    ))}

                                </Swiper>

                                <div className="absolute top-5 right-4 z-50">
                                    <Drawer>
                                        <DrawerTrigger>
                                            <HiDotsVertical className="text-2xl text-gray-500" />
                                        </DrawerTrigger>
                                        <DrawerContent className={""}>
                                            <div className="p-4">
                                                <DrawerTitle className="text-lg font-semibold text-center mb-4">Options</DrawerTitle>
                                                <div className="space-y-3 mb-10">
                                                    {/* News Categories */}
                                                    <div className="flex gap-2 px-4 flex-wrap">
                                                        {post.categories.map((category: string, index: number) => (
                                                            <Link href={`/category/${category}`} key={index} className="bg-gray-200 rounded px-2 py-1 text-xs font-semibold text-gray-600 hover:text-green-500 cursor-pointer">
                                                                {category}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                    <HideButton postId={post._id} onHide={() => handleHide(post._id)} />
                                                    <QrButton postId={post._id} />
                                                    {post.currentUserProfile ? (
                                                        <>
                                                            <Link href={"/pages/edit_post/" + post._id} className="flex gap-3 w-full p-3 text-lg justify-start cursor-pointer rounded-md text-gray-700 hover:bg-gray-100 items-center font-semibold">
                                                                <Pencil /> Edit
                                                            </Link>
                                                            <DeleteButton postId={post._id} onHide={() => handleHide(post._id)} />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Link href={"/" + post.creatorName} className="flex gap-3 w-full p-3 text-lg justify-start cursor-pointer rounded-md text-gray-700 hover:bg-gray-100 items-center font-semibold">
                                                                    <Image src={post.creatorImage} alt="Profile" width={40} height={40} priority className="rounded-full size-5" /> View Profile
                                                            </Link>
                                                            <Link href={`/pages/others/report_an_issue?id=${post._id}`} className="flex gap-3 w-full p-3 text-lg justify-start cursor-pointer rounded-md text-gray-700 hover:bg-gray-100">
                                                                <TbReport className="size-6" /> Report
                                                            </Link>
                                                        </>
                                                    )}

                                                </div>
                                            </div>
                                        </DrawerContent>
                                    </Drawer>
                                </div>

                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-b to-[#00000080] h-full p-5 pb-8 text-white flex flex-col justify-end z-50 pointer-events-none">

                                    <h2 className="text-4xl font-bold pr-10">{post.title}</h2>


                                    <div className="flex items-center justify-between gap-3 w-full mt-6 mb-1 pointer-events-auto">
                                        <div className="flex items-center gap-2">
                                            <Image src={post.creatorImage} alt={post.creatorName} width={40} height={40} className="rounded-full" priority />
                                            <span className="text-base font-semibold">{post.creatorName}</span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-300">
                                            {formatTimeAgo(post.createdAt)}
                                        </span>

                                        <VoteButtons news={post} />
                                    </div>


                                    <Drawer>
                                        <DrawerTrigger asChild>
                                            <p className="text-xl text-gray-200 font-medium mt-4 cursor-pointer line-clamp-6 pointer-events-auto">
                                                {post.description.split(" ").slice(0, 20).join(" ")}...
                                            </p>
                                        </DrawerTrigger>
                                        <DrawerContent className="pt-4 pb-10 px-6 pointer-events-auto">
                                            <h2 className="text-4xl font-bold px-5 pt-2 text-center">{post.title}</h2>
                                            <DrawerTitle className="space-y-10 overflow-scroll pt-4">
                                                <p className="text-gray-600 text-xl font-medium text-justify leading-8 overflow-scroll">{post.description}</p>
                                            </DrawerTitle>
                                        </DrawerContent>
                                    </Drawer>
                                </div>
                            </SwiperSlide>
                        )
                    ))}
                </Swiper>
            </div>
        </>
    );
}