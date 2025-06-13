"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { MessageCircle, MoreHorizontal, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TbReport } from "react-icons/tb";
import { formatNumber } from "../helpers/formatNumber";
import { formatTimeAgo } from "../helpers/formatTimeAgo";
import { getDistanceFromCurrentLocation } from "../helpers/getDistanceFromCurrentLocation";
import Comment from "./Comments";
import DeleteButton from "./DeleteButton";
import HideButton from "./HideButton";
import ImageSlider from "./ImageSlider";
import { LoaderLink } from "./loaderLinks";
import QrButton from "./QrButton";
import SaveButton from "./saveButton";
import ShareButton from "./ShareButton";
import VoteButtons from "./VoteButtons";
import { t } from "../helpers/i18n";
import { DialogTitle } from "@/components/ui/dialog";
import { CommentType, News } from "../helpers/types";


const NewsPost = ({ news, onHide, fullDescription, currentLoginUsername }: { news: News, currentLoginUsername: string, fullDescription: boolean; onHide: (id: string) => void }) => {
    const [distance, setDistance] = useState<string | null>(null);
    const [openDrawerId, setOpenDrawerId] = useState<string | null>(null);
    const [comments, setComments] = useState<CommentType[]>([...news.topComments]);
    const [hasMore, setHasMore] = useState(true);

    console.log("📰 News Post Data:", news);

    const [showAddress, setShowAddress] = useState(false);
    const [showDescription, setShowDescription] = useState(fullDescription);

    useEffect(() => {
        if (news.latitude !== undefined && news.longitude !== undefined) {
            getDistanceFromCurrentLocation(news.latitude, news.longitude)
                .then(({ formattedDistance }) => setDistance(formattedDistance))
                .catch(() => setDistance(t("nearby")));
        } else {
            setDistance(t("nearby"));
        }
    }, [news.latitude, news.longitude]);



    const router = useRouter();

    const handleEditClick = () => {
        sessionStorage.setItem("editNewsData", JSON.stringify(news));
        router.push(`/pages/edit_post/${news._id}`);
    };

;
   
    useEffect(() => {
        const onHashChange = () => {
            if (!window.location.hash && openDrawerId) {
                setOpenDrawerId(null);
            }
        };
        window.addEventListener("hashchange", onHashChange);
        return () => window.removeEventListener("hashchange", onHashChange);
    }, [openDrawerId]);

    useEffect(() => {
        // Restore state if someone lands on a hash
        if (window.location.hash) {
            const hash = window.location.hash.replace("#", "");
            setOpenDrawerId(hash);
        }
    }, []);



    return (
        <div key={String(news._id)}>
            <Card className="w-full my-0 border-0 shadow-none gap-4 select-none rounded-none">
                {/* Header */}
                <div className="flex justify-between items-center px-2">
                    <div className="flex items-start gap-2">
                        <Link href={"/" + news.creatorName} className="mt-1 shrink-0 w-9 h-9">
                            <Image src={news.creatorImage} alt="Profile" width={40} height={40} priority className="rounded-full w-9 h-9 aspect-square" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <Link href={"/" + news.creatorName}><span className="font-bold">{news.creatorName}</span></Link>
                                <span className="text-gray-500 text-sm">-</span>
                                <span className="text-gray-500 text-xs">{formatTimeAgo(news.createdAt)}</span>
                            </div>
                            <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-xs">
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
                        <DrawerContent className={""} aria-describedby={undefined}>
                            <div className="px-4 py-10 space-y-6">
                                <DialogTitle className={"flex gap-2 px-4 flex-wrap"}>
                                    {news.categories.map((category: string, index: number) => (
                                        <LoaderLink href={`/category/${category}`} key={index} className="bg-gray-200 dark:bg-neutral-800 rounded-sm px-5 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-green-500 cursor-pointer">
                                            {category}
                                        </LoaderLink>
                                    ))}
                                </DialogTitle>
                                <div className="space-y-2 mb-0">
                                    <>
                                        <HideButton postId={news._id} onHide={onHide} />
                                    </>
                                    <>
                                        <QrButton postId={news._id} />
                                    </>
                                    {news.currentUserProfile ? (
                                        <>
                                            <Button
                                                variant="ghost"
                                                onClick={handleEditClick}
                                                className="flex gap-3 w-full p-3 h-12 text-lg justify-start cursor-pointer text-gray-700 hover:bg-gray-100 dark:text-gray-300 border-2 rounded-lg bg-gray-100 dark:bg-neutral-800"
                                            >
                                                <Pencil /> {t("edit")}
                                            </Button>

                                            <DeleteButton postId={news._id} onHide={onHide} />
                                        </>
                                    ) : (
                                        <>
                                            <LoaderLink href={"/" + news.creatorName} className="flex gap-3 w-full p-3 text-lg justify-start cursor-pointer text-gray-700 hover:bg-gray-100 dark:text-gray-300 border-2 rounded-lg bg-gray-100 dark:bg-neutral-800">
                                                <Image src={news.creatorImage} alt="Profile" width={40} height={40} className="rounded-full size-5" priority /> {t("viewProfile")}
                                            </LoaderLink>
                                            <LoaderLink href={`/pages/others/report_an_issue/${news._id}`} className="flex gap-3 w-full p-3 text-lg justify-start cursor-pointer text-gray-700 hover:bg-gray-100 dark:text-gray-300 border-2 rounded-lg bg-gray-100 dark:bg-neutral-800">
                                                <TbReport className="size-6" /> {t("report")}
                                            </LoaderLink>
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
                    <p className={`pl-2 pb-3 text-base font-medium text-gray-800 dark:text-gray-300`}>
                        {news.title}
                    </p>
                    <p className={`border-l-4 border-green-500 pl-3 py-3 text-sm font-medium text-gray-800 dark:text-gray-400 ${showDescription ? "" : "line-clamp-6"}`}
                        onClick={() => setShowDescription(!showDescription)}>
                        {news.description}
                    </p>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center px-4">
                    <div className="flex gap-5">
                        <VoteButtons news={news} />

                        {/* Comment Drawer */}
                        <Drawer className={""}>
                            <DrawerTrigger className="flex items-center gap-1">
                                <MessageCircle className="size-4.5 text-gray-500" />
                                <span className="font-semibold text-sm text-gray-500">{formatNumber(news.commentsCount)}</span>
                            </DrawerTrigger>
                            <DrawerContent className={"bg-white dark:bg-neutral-900 p-4 h-screen data-[vaul-drawer-direction=bottom]:max-h-[90vh]"}>
                                <DrawerHeader className="p-4 overflow-scroll">
                                    <DrawerTitle className="text-lg font-semibold mt-0 mb-5 text-start">{t("comments")}</DrawerTitle>

                                    <Comment
                                        news_id={news._id}
                                        currentLoginUsername={currentLoginUsername}
                                        comments={comments}
                                        setComments={setComments}
                                        hasMore={hasMore}
                                        setHasMore={setHasMore}
                                        totalComments={news.commentsCount}
                                    />
                                </DrawerHeader>
                            </DrawerContent>
                        </Drawer>
                        {/* Share Button */}
                        <ShareButton ShareProps={news} />
                    </div>

                    {/* Save Button */}
                    <SaveButton news={news} />
                </div>
            </Card>
        </div>
    );
};

export default NewsPost;
