"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination } from "swiper/modules";
import { formatDistanceToNow } from "date-fns";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { HiDotsVertical } from "react-icons/hi";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";

const formatNumber = (num: any) => {
    if (num >= 1_00_00_000) return `${(num / 1_00_00_000).toFixed(1)}Cr`;
    if (num >= 1_00_000) return `${(num / 1_00_000).toFixed(1)}L`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
};

const posts = [
    {
        id: "1",
        title: "Breaking News: AI is taking over!",
        category: "Technology",
        author: "john_doe",
        authorImage: "/images/profileIcon/image.jpg",
        image: "/images/profileIcon/image.jpg",
        upvotes: 12500,
        downvotes: 200,
        uploadTime: new Date(Date.now() - 3600 * 1000),
        description: "Artificial intelligence is now smarter than ever. Researchers have developed new models that surpass human intelligence in various fieldsArtificial intelligence is now smarter than ever. Researchers have developed new models that surpass human intelligence in various fieldsArtificial intelligence is now smarter than ever. Researchers have developed new models that surpass human intelligence in various fieldsArtificial intelligence is now smarter than ever. Researchers have developed new models that surpass human intelligence in various fieldsArtificial intelligence is now smarter than ever. Researchers have developed new models that surpass human intelligence in various fieldsArtificial intelligence is now smarter than ever. Researchers have developed new models that surpass human intelligence in various fields",
    }, {
        id: "2",
        title: "Breaking News: AI is taking over!",
        category: "Technology",
        author: "john_doe",
        authorImage: "/images/profileIcon/image.jpg",
        image: "/images/profileIcon/image.jpg",
        upvotes: 12500,
        downvotes: 200,
        uploadTime: new Date(Date.now() - 3600 * 1000),
        description: "Artificial intelligence is now smarter than ever. Researchers have developed new models that surpass human intelligence in various fields...",
    }, {
        id: "3",
        title: "Breaking News: AI is taking over!",
        category: "Technology",
        author: "john_doe",
        authorImage: "/images/profileIcon/image.jpg",
        image: "/images/profileIcon/image.jpg",
        upvotes: 12500,
        downvotes: 200,
        uploadTime: new Date(Date.now() - 3600 * 1000),
        description: "Artificial intelligence is now smarter than ever. Researchers have developed new models that surpass human intelligence in various fields...",
    }, {
        id: "4",
        title: "Breaking News: AI is taking over!",
        category: "Technology",
        author: "john_doe",
        authorImage: "/images/profileIcon/image.jpg",
        image: "/images/profileIcon/image.jpg",
        upvotes: 12500,
        downvotes: 200,
        uploadTime: new Date(Date.now() - 3600 * 1000),
        description: "Artificial intelligence is now smarter than ever. Researchers have developed new models that surpass human intelligence in various fields...",
    },
];

export default function MainContent() {

    const [vote, setVote] = useState(0);
    const [save, setSave] = useState(false);

    return (
        <>
            <div className="bg-neutral-800">
                <Swiper
                    direction="vertical"
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    className="h-[90.5vh] w-full"
                >
                    {posts.map((post) => (
                        <SwiperSlide key={post.id} className="relative flex items-center justify-center w-full">
                            <Image src={post.image} alt={post.title} layout="fill" objectFit="cover" />

                            <div className="absolute top-5 right-4 z-10">
                                <Drawer>
                                    <DrawerTrigger asChild>
                                        <HiDotsVertical className="text-2xl text-white" />
                                    </DrawerTrigger>
                                    <DrawerContent className="p-5">
                                        <div className="p-4">
                                            <DrawerTitle className="text-lg font-semibold text-center mb-4">Options</DrawerTitle>
                                            <div className="space-y-3 mb-10">
                                                <Button variant={"ghost"} size={100} className="flex items-center justify-start gap-3 active:scale-95 duration-300 w-full p-3 text-lg rounded-md text-gray-700 hover:bg-gray-100">Report</Button>
                                                <Button variant={"ghost"} size={100} className="flex items-center justify-start gap-3 active:scale-95 duration-300 w-full p-3 text-lg rounded-md text-gray-700 hover:bg-gray-100">Share</Button>
                                                <Button variant={"ghost"} size={100} className="flex items-center justify-start gap-3 active:scale-95 duration-300 w-full p-3 text-lg rounded-md text-gray-700 hover:bg-gray-100">Interested</Button>
                                                <Button variant={"ghost"} size={100} className="flex items-center justify-start gap-3 active:scale-95 duration-300 w-full p-3 text-lg rounded-md text-gray-700 hover:bg-gray-100">Not Interested</Button>
                                            </div>
                                        </div>
                                    </DrawerContent>
                                </Drawer>
                            </div>

                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-b to-[#00000060] h-full p-5 pb-10 text-white flex flex-col justify-end">
                                <p className="text-sm text-gray-300 font-semibold mb-2 rounded-full border-2 w-fit px-4 py-1.5">{post.category}</p>
                                <h2 className="text-4xl font-bold pr-10">{post.title}</h2>


                                <div className="flex items-center justify-between gap-3 w-full mt-4 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Image src={post.authorImage} alt={post.author} width={40} height={40} className="rounded-full" />
                                        <span className="text-base font-semibold">{post.author}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-300">
                                        {formatDistanceToNow(post.uploadTime, { addSuffix: true })}
                                    </span>

                                    <div className="flex items-center gap-2">
                                        <Button size={100} variant="ghost" className="flex items-center gap-1 active:opacity-80 duration-300" onClick={() => vote === 1 ? setVote(0) : setVote(1)}>
                                            {vote === 1 ? (
                                                <BiSolidLike className="size-6 fill-green-500" />
                                            ) : (
                                                <BiLike className="size-6" />
                                            )}
                                            <span className={`font-semibold text-sm ${vote === 1 ? "text-green-400" : ""}`}>{formatNumber(post.upvotes)}</span>
                                        </Button>
                                        <Button size={100} variant="ghost" className="flex items-center gap-1 active:opacity-80 duration-300" onClick={() => vote === 2 ? setVote(0) : setVote(2)}>
                                            {vote === 2 ? (
                                                <BiSolidDislike className="size-6 fill-red-500" />
                                            ) : (
                                                <BiDislike className="size-6" />
                                            )}
                                            <span className={`font-semibold text-sm ${vote === 2 ? " text-red-600" : ""}`}>{formatNumber(post.downvotes)}</span>
                                        </Button>
                                    </div>
                                </div>


                                <Drawer>
                                    <DrawerTrigger asChild>
                                        <p className="text-xl text-gray-200 font-medium mt-2 cursor-pointer line-clamp-4">
                                            {post.description.split(" ").slice(0, 20).join(" ")}...
                                        </p>
                                    </DrawerTrigger>
                                    <DrawerContent className="pt-4 pb-10 px-6">
                                        <h2 className="text-4xl font-bold px-5 pt-2 text-center">{post.title}</h2>
                                        <DrawerTitle className="space-y-10 overflow-scroll pt-4">
                                            <p className="text-gray-600 text-xl font-medium text-justify leading-8 overflow-scroll">{post.description} Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi cum sit accusamus quae veritatis sapiente, architecto eveniet, totam illum amet aut earum, molestiae praesentium at. Explicabo aut quod suscipit atque cum nostrum nihil error illo aspernatur quae enim, magnam distinctio tenetur facilis minima autem nesciunt impedit! Libero earum ipsum, consequatur nesciunt dolore similique nihil officia beatae ducimus? Sequi pariatur exercitationem, labore numquam perspiciatis laboriosam quibusdam doloremque omnis architecto modi facilis velit earum quam quasi consectetur? Vel, delectus corporis eum sapiente aperiam laboriosam voluptatem asperiores, cupiditate praesentium ipsa tenetur expedita, tempora eveniet rem dolor velit sequi nisi provident est voluptatum quia?</p>
                                        </DrawerTitle>
                                    </DrawerContent>
                                </Drawer>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </>
    );
}