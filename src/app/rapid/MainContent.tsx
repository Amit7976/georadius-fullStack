"use client";

import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import DeleteButton from "@/src/components/DeleteButton";
import HideButton from "@/src/components/HideButton";
import QrButton from "@/src/components/QrButton";
import VoteButtons from "@/src/components/VoteButtons";
import { formatTimeAgo } from "@/src/helpers/formatTimeAgo";
import { Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { TbReport } from "react-icons/tb";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { useGeolocation } from "../hooks/useGeolocation";
import { LoaderLink } from "@/src/components/loaderLinks";
import { t } from "@/src/helpers/i18n";
import { DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PullToRefresh from "react-pull-to-refresh";


interface Post {
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



export default function MainContent() {

    const [newsData, setNewsData] = useState<Post[]>([]);
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [error, setError] = useState<string | null>(null);
    let location = useGeolocation();


    useEffect(() => {
        const hiddenPosts = JSON.parse(localStorage.getItem("hideNews") || "[]");
        const filteredNews = posts.filter((news: Post) => !hiddenPosts.includes(news._id));
        setNewsData(filteredNews);
    }, [posts]);

    const handleHide = (postId: string) => {
        setNewsData(prevNews => prevNews.filter(news => news._id !== postId.toString()));

        const hiddenPosts = JSON.parse(localStorage.getItem("hideNews") || "[]");
        if (!hiddenPosts.includes(postId)) {
            hiddenPosts.push(postId);
            localStorage.setItem("hideNews", JSON.stringify(hiddenPosts));
        }
    };


    useEffect(() => {
        if (!location) {
            location = { lat: 26.92, lng: 75.78 } //Default Jaipur Latitude & Longitude
        };

        const fetchNearbyPosts = async (latitude: number, longitude: number) => {
            try {
                const res = await fetch(`/api/rapid/nearby?lat=${latitude}&lng=${longitude}`);
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


    const handleRefresh = async () => {
        window.location.reload();
    };

    if (loadingPosts) return <div className="flex items-center justify-center h-[94vh]"><div className="loader"></div></div>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <>
            <PullToRefresh
                onRefresh={handleRefresh}
                resistance={5}
            >
                <div className="bg-gray-100 dark:bg-neutral-800">
                    <Swiper
                        direction="vertical"
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        className="h-[94vh] w-full"
                    >
                        {newsData.map((post) => (
                            (post.images.length) > 0 && (
                                <SwiperSlide key={post._id} className="relative flex items-center justify-center w-full">
                                    <Swiper
                                        direction="horizontal"
                                        slidesPerView={1}
                                        pagination={{ clickable: true }}
                                        className="w-full h-[50vh] z-10 relative"
                                    >
                                        {post.images.map((image: string) => (
                                            <SwiperSlide key={image} className="relative flex items-center justify-center w-full">
                                                <Image src={image} alt={post.title} layout="fill" sizes="full" objectFit="cover" priority />
                                            </SwiperSlide>
                                        ))}

                                    </Swiper>

                                    <div className="absolute top-5 right-4 z-50">
                                        <Drawer>
                                            <DrawerTrigger>
                                                <HiDotsVertical className="text-2xl text-gray-500" />
                                            </DrawerTrigger>
                                            <DrawerContent className={""}>
                                                <div className="px-4 py-10 space-y-6">
                                                    <DialogTitle className={"flex gap-2 px-4 flex-wrap"}>
                                                        {post.categories.map((category: string, index: number) => (
                                                            <LoaderLink href={`/category/${category}`} key={index} className="bg-gray-200 dark:bg-neutral-800 rounded-sm px-5 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-green-500 cursor-pointer">
                                                                {category}
                                                            </LoaderLink>
                                                        ))}
                                                    </DialogTitle>

                                                    <div className="space-y-2 mb-0">
                                                        <>
                                                            <HideButton postId={post._id} onHide={() => handleHide(post._id)} />
                                                        </>
                                                        <>
                                                            <QrButton postId={post._id} />
                                                        </>
                                                        {post.currentUserProfile ? (
                                                            <>
                                                                <LoaderLink href={"/pages/edit_post/" + post._id} className="flex gap-3 w-full p-3 text-lg justify-start cursor-pointer text-gray-700 hover:bg-gray-100 dark:text-gray-300 border-2 rounded-lg bg-gray-100 dark:bg-neutral-800">
                                                                    <Pencil /> {t("edit")}
                                                                </LoaderLink>

                                                                <DeleteButton postId={post._id} onHide={() => handleHide(post._id)} />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <LoaderLink href={"/" + post.creatorName} className="flex gap-3 w-full p-3 text-lg justify-start cursor-pointer text-gray-700 hover:bg-gray-100 dark:text-gray-300 border-2 rounded-lg bg-gray-100 dark:bg-neutral-800">
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

                                    <Drawer>
                                        <DrawerTrigger asChild>

                                            <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-neutral-900 h-[50vh] px-5 pt-10 pb-16 overflow-hidden text-black dark:text-white flex flex-col justify-start z-50 pointer-events-none rounded-t-4xl border">

                                                <h2 className="text-2xl font-bold pr-10 pointer-events-auto">{post.title} Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, cupiditate.</h2>


                                                <div className="flex items-center justify-between gap-3 w-full mt-6 mb-1 pointer-events-auto">
                                                    <div className="flex items-center gap-2">
                                                        <Image src={post.creatorImage} alt={post.creatorName} width={40} height={40} className="rounded-full" priority />
                                                        <span className="text-base font-semibold">{post.creatorName}</span>
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-500">
                                                        {formatTimeAgo(post.createdAt)}
                                                    </span>
                                                </div>

                                                <div className="bg-gradient-to-b from-transparent via-white to-white dark:via-neutral-900 dark:to-neutral-900 h-[10vh] w-full absolute bottom-0"></div>

                                                <p className="text-xl text-gray-400 font-medium mt-6 cursor-pointer pointer-events-auto">
                                                    {post.description.split(" ").slice(0, 20).join(" ")} Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium minima rem fugiat, laborum libero voluptatem doloribus eos autem a labore? A impedit tempora iusto saepe rerum vero suscipit, mollitia velit? Harum, vero tempore unde cumque voluptatibus sint hic tempora corrupti ipsum ea!
                                                </p>
                                            </div>
                                        </DrawerTrigger>
                                        <DrawerContent className="p-0 pointer-events-auto h-screen data-[vaul-drawer-direction=bottom]:max-h-screen">
                                            <div className="overflow-y-scroll py-20 px-4">
                                                <span className="text-sm font-semibold text-gray-500">
                                                    {formatTimeAgo(post.createdAt)}
                                                </span>
                                                <DrawerTitle className="pt-4 text-2xl font-bold pr-10 capitalize">
                                                    {post.title} Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, cupiditate.
                                                </DrawerTitle>


                                                <div className="flex items-center justify-between gap-3 w-full mt-6 mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <Image src={post.creatorImage} alt={post.creatorName} width={40} height={40} className="rounded-full" priority />
                                                        <span className="text-base font-semibold">{post.creatorName}</span>
                                                    </div>

                                                    <VoteButtons news={post} />
                                                </div>

                                                <p className="text-xl text-gray-400 font-medium mt-8 cursor-pointer text-balance">
                                                    {post.description.split(" ").slice(0, 20).join(" ")} Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus magnam repudiandae voluptatem nostrum blanditiis distinctio et eius, delectus adipisci! Iste laudantium ratione doloribus excepturi, necessitatibus dolores labore molestias fuga repudiandae architecto rem incidunt commodi rerum quis sed modi! Suscipit tempora est, delectus iusto dolor architecto quos, nostrum tempore amet commodi, beatae eveniet molestias. Dolor, sint. Quo ipsam quas optio! Dignissimos quo mollitia autem possimus asperiores eum fugit quas, obcaecati tempore quaerat? Repellendus harum tempore sapiente architecto nobis reiciendis error ea sit voluptatem quod consequatur enim facere ab recusandae dolor nihil explicabo sunt quibusdam natus corrupti necessitatibus ipsam, laborum iure rerum. Neque eius ipsa asperiores, harum quidem voluptatibus maxime quae qui totam labore consequatur nihil, in corporis. Nulla rerum, dicta sint quam, quasi perspiciatis consequuntur harum corrupti quae error ullam quisquam. Libero neque quas iure assumenda cumque inventore enim odio consectetur voluptatem. Molestias, facere. Consequuntur recusandae repellat voluptate fugit, omnis odio quas veniam nemo rem necessitatibus blanditiis, tempora nisi consectetur deleniti ducimus voluptates aliquid! Aut nesciunt aspernatur, reprehenderit fugiat ad error tempore, sunt minus, amet necessitatibus hic soluta qui quo nostrum iusto cum officia nulla animi magnam ab voluptatem corrupti? Voluptas, eos delectus, accusamus necessitatibus ducimus sunt voluptatum nobis nisi autem soluta asperiores nemo illo expedita doloremque quasi! Blanditiis, deserunt voluptate cupiditate quos odit amet quis nobis neque praesentium possimus alias aperiam maxime nostrum eius cum soluta pariatur reprehenderit repellendus tempore ducimus inventore quia. Quod maiores, vitae unde iusto eius repellat repellendus accusantium fugiat fugit? Distinctio iure quo unde! Itaque, quos! Doloribus fugiat odit praesentium molestias. Magni odit voluptates perspiciatis ab, voluptate iste nam facilis numquam rerum beatae, blanditiis dolorum vero fugit libero vel accusamus ullam id perferendis incidunt sed distinctio reprehenderit. Recusandae rem tempora non explicabo adipisci? Maiores sed velit porro alias laboriosam error obcaecati culpa totam eos hic enim architecto maxime cumque adipisci magni minima, voluptatibus natus saepe. Voluptas quisquam, eligendi consequuntur atque repudiandae ab nobis architecto ipsa mollitia itaque officia voluptatem laboriosam vero earum tempore quidem saepe voluptates ullam eaque eveniet? Delectus, atque. Laboriosam qui ipsum nesciunt sapiente saepe impedit odio. Consectetur voluptas explicabo, ipsa inventore nam saepe pariatur adipisci sapiente sequi doloremque eaque non quas facilis hic labore dicta dolores perferendis corporis laborum consequatur quod quo molestias aperiam. Nisi, tenetur, aperiam aspernatur laborum aliquid tempora facilis dolore deserunt ullam necessitatibus odio quisquam, quo hic provident quidem! Dolore ratione minus voluptatum impedit sed fuga repellat possimus repellendus vel maxime velit recusandae rerum ipsam, harum beatae distinctio. Quasi ullam quis sint doloremque dolorum velit voluptatum animi repudiandae rem, amet sunt at vel deleniti nostrum natus fugit quo quidem sit doloribus commodi quod eaque consequatur nesciunt? Nam aut doloribus explicabo corporis molestias, ratione dicta expedita ipsam incidunt, reiciendis alias qui? Voluptatem alias sapiente laudantium molestiae, quod, corrupti quas nisi placeat, dicta consequuntur blanditiis voluptatum soluta aliquam! Fugit sed nostrum iusto. Dolores porro id explicabo veniam illo amet libero impedit aperiam consequuntur alias quos sapiente commodi praesentium nulla, nemo voluptates quisquam tempore, suscipit minima autem laudantium? Quas quis saepe at alias.  Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium minima rem fugiat, laborum libero voluptatem doloribus eos autem a labore? A impedit tempora iusto saepe rerum vero suscipit, mollitia velit? Harum, vero tempore unde cumque voluptatibus sint hic tempora corrupti ipsum ea!
                                                </p>
                                            </div>
                                        </DrawerContent>
                                    </Drawer>
                                </SwiperSlide>
                            )
                        ))}
                    </Swiper>
                </div >
            </PullToRefresh >
        </>
    );
}