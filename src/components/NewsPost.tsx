"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { MessageCircle, MoreHorizontal, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { formatNumber } from "../helpers/formatNumber";
import { formatTimeAgo } from "../helpers/formatTimeAgo";
import { getDistanceFromCurrentLocation } from "../helpers/getDistanceFromCurrentLocation";
import Comment from "./Comments";
import HideButton from "./HideButton";
import ImageSlider from "./ImageSlider";
import QrButton from "./QrButton";
import SaveButton from "./saveButton";
import ShareButton from "./ShareButton";
import VoteButtons from "./VoteButtons";
import DeleteButton from "./DeleteButton";


const NewsPost = ({ news, onHide }: { news: any; onHide: (id: number) => void }) => {
    const [distance, setDistance] = useState<string | null>(null);

    console.log("📰 News Post Data:", news);

    const [showAddress, setShowAddress] = useState(false);
    const [showDescription, setShowDescription] = useState(false);

    useEffect(() => {
        getDistanceFromCurrentLocation(news.latitude, news.longitude)
            .then(({ formattedDistance }) => setDistance(formattedDistance))
            .catch(() => setDistance("Location not available"));
    }, [news.latitude, news.longitude]);



    return (
        <div key={String(news._id)}>
            <Card className="w-full my-0 border-0 shadow-none gap-4">
                {/* Header */}
                <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-3">
                        <Image src={news.creatorImage} alt="Profile" width={40} height={40} className="rounded-full" />
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold">{news.creatorName}</span>
                                <span className="text-gray-500 text-sm">-</span>
                                <span className="text-gray-500 text-xs">{formatTimeAgo(news.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-xs">
                                <span className="text-green-600">{distance}</span>
                                <span
                                    className={`cursor-pointer ${showAddress ? "" : "line-clamp-1"}`}
                                    onClick={() => setShowAddress(!showAddress)}
                                >
                                    {news.location}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Three-dot Drawer */}
                    <Drawer>
                        <DrawerTrigger>
                            <MoreHorizontal className="text-gray-600 cursor-pointer" />
                        </DrawerTrigger>
                        <DrawerContent className={""}>
                            <div className="p-4">
                                <DrawerTitle className="text-lg font-semibold text-center mb-4">Options</DrawerTitle>
                                <div className="space-y-3 mb-10">
                                    <HideButton postId={news._id} onHide={onHide} />
                                    <QrButton postId={news._id} />
                                    <Button size={100} variant="ghost" className="flex gap-3 w-full p-3 text-lg justify-start cursor-pointer rounded-md text-gray-700 hover:bg-gray-100">
                                        <Pencil /> Edit
                                    </Button>
                                    <DeleteButton postId={news._id} onHide={onHide} />

                                </div>
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>


                {/* Image Slider */}
                {news.images.length > 0 && <ImageSlider images={news.images} />}

                <p className={`border-l-4 border-green-500 pl-3 py-3 text-sm text-gray-800 ${showDescription ? "" : "line-clamp-6"}`}
                    onClick={() => setShowDescription(!showDescription)}>
                    {news.description}
                </p>

                {/* Footer */}
                <div className="flex justify-between items-center px-4">
                    <div className="flex gap-5">
                        <VoteButtons news={news} />

                        {/* Comment Drawer */}
                        <Drawer>
                            <DrawerTrigger className="flex items-center gap-1">
                                <MessageCircle className="size-6" />
                                <span className="font-semibold text-sm">{formatNumber(news.commentsCount)}</span>
                            </DrawerTrigger>
                            <DrawerContent className={""}>
                                <DrawerHeader className="p-4 overflow-scroll">
                                    <DrawerTitle className="text-lg font-semibold text-center mb-1">Comments</DrawerTitle>
                                    <Comment news_id={news._id} />
                                </DrawerHeader>
                            </DrawerContent>
                        </Drawer>

                        {/* Share Button */}
                        <ShareButton news={news} />
                    </div>

                    {/* Save Button */}
                    <SaveButton news={news} />
                </div>
            </Card>
        </div>
    );
};

export default NewsPost;
