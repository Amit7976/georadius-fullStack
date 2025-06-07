"use client";
import { Card } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { MessageCircle, MoreHorizontal, Pencil } from "lucide-react";
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
import Link from "next/link";
import { TbReport } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface News {
    _id: string;
    title: string;
    description: string;
    latitude?: number;
    longitude?: number;
    creatorName: string;
    creatorImage: string;
    createdAt: string;
    location: string;
    likes: number;
    comments: number;
    categories: string[];
    images: string[];
    commentsCount: number;
    currentUserProfile: boolean;
    // Add these
    upvoteCount: number;
    downvoteCount: number;
    isUserUpvote: boolean;
    isUserDownvote: boolean;
    isSaved: boolean;
}



const NewsPost = ({ news, onHide, fullDescription }: { news:News; fullDescription: boolean; onHide: (id: number) => void }) => {
    const [distance, setDistance] = useState<string | null>(null);

    console.log("📰 News Post Data:", news);

    const [showAddress, setShowAddress] = useState(false);
    const [showDescription, setShowDescription] = useState(fullDescription);

    useEffect(() => {
        if (news.latitude !== undefined && news.longitude !== undefined) {
            getDistanceFromCurrentLocation(news.latitude, news.longitude)
                .then(({ formattedDistance }) => setDistance(formattedDistance))
                .catch(() => setDistance("Location not available"));
        } else {
            setDistance("Location not available");
        }
    }, [news.latitude, news.longitude]);



    const router = useRouter();

    const handleEditClick = () => {
        sessionStorage.setItem("editNewsData", JSON.stringify(news));
        router.push(`/pages/edit_post/${news._id}`);
      };
    
    return (
        <div key={String(news._id)}>
            <Card className="w-full my-0 border-0 shadow-none gap-4 select-none rounded-none">
                {/* Header */}
                <div className="flex justify-between items-center px-2">
                    <div className="flex items-start gap-2">
                        <Link href={"/" + news.creatorName} target="_blank" className="mt-1 shrink-0 w-9 h-9">
                            <Image src={news.creatorImage} alt="Profile" width={40} height={40} priority className="rounded-full w-9 h-9 aspect-square" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <Link href={"/" + news.creatorName} target="_blank"><span className="font-bold">{news.creatorName}</span></Link>
                                <span className="text-gray-500 text-sm">-</span>
                                <span className="text-gray-500 text-xs">{formatTimeAgo(news.createdAt)}</span>
                            </div>
                            <div className="flex items-start gap-2 text-gray-500 text-xs">
                                <span className="text-green-600 font-semibold">{distance}</span>
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
                        <DrawerContent className={"max-w-lg mx-auto"} aria-describedby={undefined}>
                            <div className="p-4">
                                <DrawerTitle className="text-lg font-semibold text-center mb-4">Options</DrawerTitle>
                                <div className="space-y-3 mb-10">
                                    {/* News Categories */}
                                    <div className="flex gap-2 px-4 flex-wrap">
                                        {news.categories.map((category: string, index: number) => (
                                            <Link href={`/category/${category}`} key={index} className="bg-gray-200 rounded px-2 py-1 text-xs font-semibold text-gray-600 hover:text-green-500 cursor-pointer">
                                                {category}
                                            </Link>
                                        ))}
                                    </div>
                                    <HideButton postId={Number(news._id)} onHide={onHide} />
                                    <QrButton postId={news._id} />
                                    {news.currentUserProfile ? (
                                        <>
                                            <Button
                                                variant="ghost"
                                                onClick={handleEditClick}
                                                className="flex gap-3 w-full p-3 h-12 text-lg justify-start cursor-pointer rounded-md text-gray-700 hover:bg-gray-100 items-center font-semibold"
                                            >
                                                <Pencil /> Edit
                                            </Button>

                                            <DeleteButton postId={Number(news._id)} onHide={onHide} />
                                        </>
                                    ) : (
                                        <>
                                            <Link href={"/" + news.creatorName} className="flex gap-3 w-full p-3 text-lg justify-start cursor-pointer rounded-md text-gray-700 hover:bg-gray-100 items-center font-semibold">
                                                    <Image src={news.creatorImage} alt="Profile" width={40} height={40} className="rounded-full size-5" priority /> View Profile
                                            </Link>
                                            <Link href={`/pages/others/report_an_issue?id=${news._id}`} className="flex gap-3 w-full p-3 text-lg justify-start cursor-pointer rounded-md text-gray-700 hover:bg-gray-100">
                                                <TbReport className="size-6" /> Report
                                            </Link>
                                        </>
                                    )}

                                </div>
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>



                {/* Image Slider */}
                {news.images.length > 0 && <ImageSlider images={news.images} height={400} />}



                <div className="pl-1">
                    <p className={`border-l-4 border-green-500 pl-3 py-3 text-sm text-gray-800 ${showDescription ? "" : "line-clamp-6"}`}
                        onClick={() => setShowDescription(!showDescription)}>
                        {news.description}
                    </p>

                </div>

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
                            <DrawerContent className={""} aria-describedby={undefined}>
                                <DrawerHeader className="p-4 overflow-scroll">
                                    <DrawerTitle className="text-lg font-semibold text-center mb-1">Comments</DrawerTitle>
                                    <Comment news_id={String(news._id)} />
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
