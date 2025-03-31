"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    MoreHorizontal,
    EyeOff,
    QrCode,
    Pencil,
    Trash,
    Send,
    MessageCircle,
} from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle, DrawerHeader } from "@/components/ui/drawer";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { TbBookmark, TbBookmarkFilled } from "react-icons/tb";
import Comment from "./Comments";

// Function to format time
const formatTimeAgo = (publish_time: string) => {
    const time = new Date(publish_time);
    const now = new Date();
    const diff = Math.floor((now.getTime() - time.getTime()) / 1000); // Difference in seconds

    if (diff < 60) return `${diff} min ago`;
    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "yesterday";
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} months ago`;
    return `${Math.floor(months / 12)} years ago`;
};

// Function to format numbers (K, L, Cr)
const formatNumber = (num: number) => {
    if (num >= 10000000) return `${parseFloat((num / 10000000).toFixed(1))}Cr`; // 1Cr+
    if (num >= 100000) return `${parseFloat((num / 100000).toFixed(1))}L`; // 1L+
    if (num >= 1000) return `${parseFloat((num / 1000).toFixed(1))}K`; // 1K+
    return num.toString();
};


interface NewsPostProps {
    news: {
        id: number;
        title: string;
        description: string;
        image?: string;
        publish_time: string;
        location: string;
        longitude: number;
        latitude: number;
        categories: string[];
        source: {
            username: string;
            profile_picture: string;
        };
        upvote: number;
        downvote: number;
        comments: number;
    };
}

const NewsPost: React.FC<NewsPostProps> = ({ news }) => {

    const [vote, setVote] = useState(0);
    const [save, setSave] = useState(false);

    return (
        <Card className="w-full my-0 border-0 shadow-none gap-4">
            {/* Header */}
            <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-3">
                    <Image
                        src={news.source.profile_picture}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold">{news.source.username}</span>
                            <span className="text-gray-500 text-sm">-</span>
                            <span className="text-gray-500 text-xs">{formatTimeAgo(news.publish_time)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                            <span className="text-green-600">{news.longitude}, {news.latitude}</span>
                            <span>{news.location}</span>
                        </div>
                    </div>
                </div>

                {/* Three-dot Drawer */}
                <Drawer>
                    <DrawerTrigger>
                        <MoreHorizontal className="text-gray-600 cursor-pointer" />
                    </DrawerTrigger>
                    <DrawerContent className="">
                        <div className="p-4">
                            <DrawerTitle className="text-lg font-semibold text-center mb-4">Options</DrawerTitle>
                            <div className="space-y-3 mb-10">
                                <Button size={100} variant="ghost" className="flex items-center justify-start gap-3 active:scale-95 duration-300 w-full p-3 text-lg rounded-md text-gray-700 hover:bg-gray-100">
                                    <EyeOff /> Hide
                                </Button>
                                <Button size={100} variant="ghost" className="flex items-center justify-start gap-3 active:scale-95 duration-300 w-full p-3 text-lg rounded-md text-gray-700 hover:bg-gray-100">
                                    <QrCode /> Make QR
                                </Button>
                                <Button size={100} variant="ghost" className="flex items-center justify-start gap-3 active:scale-95 duration-300 w-full p-3 text-lg rounded-md text-gray-700 hover:bg-gray-100">
                                    <Pencil /> Edit
                                </Button>
                                <Button size={100} variant="ghost" className="flex items-center justify-start gap-3 active:scale-95 duration-300 w-full p-3 text-lg rounded-md text-red-500 hover:bg-gray-100">
                                    <Trash /> Delete
                                </Button>
                            </div>
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>

            {/* Post Content */}
            {news.image ? (
                <>
                    <div className="relative w-full h-[400px]">
                        <Image
                            src={news.image}
                            alt="Post"
                            layout="fill"
                            objectFit="cover"
                        />
                        <div className="absolute inset-0 bg-black opacity-30 rounded-md" />
                    </div>
                    <div className="px-4">
                        <p className="border-l-4 border-green-500 pl-3 my-2 text-sm text-gray-800 leading-6">
                            {news.description}
                        </p>
                    </div>
                </>
            ) : (
                <div className="px-4">
                    <p className="border-l-4 border-green-500 pl-3 mt-4 text-sm text-gray-800 leading-6">
                        {news.description}
                    </p>
                </div>
            )}

            {/* Footer */}
            <div className="flex justify-between items-center mt-0 px-4">
                <div className="flex gap-5">
                    <Button size={100} variant="ghost" className="flex items-center gap-1 active:opacity-80 duration-300" onClick={() => vote === 1 ? setVote(0) : setVote(1)}>
                        {vote === 1 ? (
                            <BiSolidLike className="size-6 fill-green-500" />
                        ) : (
                            <BiLike className="size-6" />
                        )}
                        <span className="font-semibold text-sm">{formatNumber(news.upvote)}</span>
                    </Button>
                    <Button size={100} variant="ghost" className="flex items-center gap-1 active:opacity-80 duration-300" onClick={() => vote === 2 ? setVote(0) : setVote(2)}>
                        {vote === 2 ? (
                            <BiSolidDislike className="size-6 fill-red-500" />
                        ) : (
                            <BiDislike className="size-6" />
                        )}
                        <span className="font-semibold text-sm">{formatNumber(news.downvote)}</span>
                    </Button>
                    <Drawer>
                        <DrawerTrigger className="flex items-center gap-1 active:opacity-80 duration-300">
                            <MessageCircle className="size-6" />
                            <span className="font-semibold text-sm">{formatNumber(news.comments)}</span>
                        </DrawerTrigger>
                        <DrawerContent className="">
                            <DrawerHeader className="p-4 overflow-scroll">
                                <DrawerTitle className="text-lg font-semibold text-center mb-1">Comments</DrawerTitle>
                                <Comment news_id={news.id} />
                            </DrawerHeader>
                        </DrawerContent>
                    </Drawer>
                    <Button className="" size={100} variant="ghost">
                        <Send className="size-6" />
                    </Button>
                </div>
                <Button className="pl-4 pr-1 py-0.5" size={100} variant="ghost" onClick={() => setSave(!save)}>
                    {save ? (

                        <TbBookmarkFilled className="size-6 fill-blue-600" />
                    ) : (
                        <TbBookmark className="size-6" />
                    )}
                </Button>
            </div>
        </Card>
    );
};

export default NewsPost;
