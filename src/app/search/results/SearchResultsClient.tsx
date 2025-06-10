"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import SearchInput from "@/src/components/SearchInput";
import ImageSlider from "@/src/components/ImageSlider";
import { formatTimeAgo } from "@/src/helpers/formatTimeAgo";
import Image from "next/image";
import { LoaderLink } from "@/src/components/loaderLinks";
import { t } from "@/src/helpers/i18n";
import BackButton from "@/src/components/BackButton";
import { useGeolocation } from "../../hooks/useGeolocation";

export default function SearchResultsClient() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [radius, setRadius] = useState("5000000");
    const [searchType, setSearchType] = useState("post");

    interface User {
        _id: string;
        username: string;
        fullname: string;
        profileImage: string;
    }

    interface Post {
        _id: string;
        title: string;
        description: string;
        location: string;
        updatedAt: string;
        images: string[];
    }

    const [results, setResults] = useState<User[] | Post[]>([]);
    const [expandedDescriptions, setExpandedDescriptions] = useState<string[]>([]);

    useEffect(() => {
        setResults([]);
        setRadius("10");
    }, [searchType]);


    const location = useGeolocation();


    const fetchResults = useCallback(async (lat: number, lng: number) => {
        const r = parseInt(radius);
        const latMin = lat - r / 111;
        const latMax = lat + r / 111;
        const lngMin = lng - r / (111 * Math.cos(lat * (Math.PI / 180)));
        const lngMax = lng + r / (111 * Math.cos(lat * (Math.PI / 180)));

        if (!latMin || !latMax || !lngMin || !lngMax) return;


        const queryParams = new URLSearchParams({
            q: query,
            type: searchType,
            radius,
            latMin: latMin.toString(),
            latMax: latMax.toString(),
            lngMin: lngMin.toString(),
            lngMax: lngMax.toString(),
        });

        const res = await fetch(`/api/search/result?${queryParams}`);
        const data = await res.json();

        setResults(searchType === "user" ? data.users : data.posts);
    }, [query, radius, searchType]);


    useEffect(() => {
        if (location) {
            fetchResults(location.lat, location.lng);
        }
    }, [location, query, radius, searchType, fetchResults]);
      




    const toggleDescription = (postId: string) => {
        setExpandedDescriptions((prev) =>
            prev.includes(postId)
                ? prev.filter((id) => id !== postId)
                : [...prev, postId]
        );
    };


    return (
        <div className="p-4">
            <SearchInput queryParam={query} />

            <div className="mb-0">
                <h2 className="text-sm font-normal text-gray-500 mb-2">
                    {t("searchResultsFor")} &#34;<span className="text-green-600 font-medium">{query}</span>&#34;
                </h2>

                <div className="flex mb-2 gap-2 justify-between items-center">
                    <h3 className="text-base font-medium text-gray-600 mb-1">{t("filterResults")}</h3>
                    <div className="flex gap-2 items-center">
                        <div>
                            <Select onValueChange={setSearchType} defaultValue="post">
                                <SelectTrigger className="w-fit flex items-center shadow-none border-0">
                                    <SelectValue placeholder="post" />
                                </SelectTrigger>
                                <SelectContent className="static">
                                    <SelectItem className="static" value="post">{t("posts")}</SelectItem>
                                    <SelectItem className="static" value="user">{t("users")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {searchType === "post" && (
                            <div>
                                <Select onValueChange={setRadius} defaultValue="5000000">
                                    <SelectTrigger className="w-fit flex items-center shadow-none border-0">
                                        <SelectValue placeholder={t("worldwide")} />
                                    </SelectTrigger>
                                    <SelectContent className="static">
                                        <SelectItem className="static" value="5">5 km</SelectItem>
                                        <SelectItem className="static" value="10">10 km</SelectItem>
                                        <SelectItem className="static" value="25">25 km</SelectItem>
                                        <SelectItem className="static" value="50">50 km</SelectItem>
                                        <SelectItem className="static" value="500">500 km</SelectItem>
                                        <SelectItem className="static" value="50000">5000 km</SelectItem>
                                        <SelectItem className="static" value="5000000">{t("worldwide")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {searchType === "user" && results.length > 0 && (
                <div className="my-6">
                    {results.map((result) => {
                        if (
                            "username" in result &&
                            result.username.trim() !== "" &&
                            "fullname" in result &&
                            "profileImage" in result
                        ) {
                            const user = result as User;
                            return (
                                <LoaderLink href={"/" + user.username} key={user._id} className="flex items-center py-2 mt-2">
                                    <div className="w-16 shrink-0">
                                        <Image
                                            width={100}
                                            height={100}
                                            src={user.profileImage}
                                            alt="Profile Pic"
                                            className="w-12 h-12 rounded-full object-cover shrink-0"
                                        />
                                    </div>
                                    <div className="mt-1 w-full text-start">
                                        <p className="text-gray-500 text-sm font-medium">@{user.username}</p>
                                        <h3 className="text-xl font-bold">{user.fullname}</h3>
                                    </div>
                                </LoaderLink>
                            );
                        }
                        return null;
                    })}
                </div>
            )}

            {searchType === "post" && results.length > 0 && (
                <div className="my-6">
                    <div className="divider-y-2 border-gray-200 mb-4">
                        <div className="flex flex-col gap-6">
                            {results.filter((result): result is Post => "title" in result).map((post) => (
                                <LoaderLink href={"/search/results/" + post._id} key={post._id} className="py-2 space-y-2 text-start">
                                    <p className="text-gray-500 text-xs">{formatTimeAgo(post.updatedAt)}</p>
                                    <h4 className="font-semibold text-lg leading-5">{post.title}</h4>
                                    <p className="text-xs text-gray-500 leading-5 mt-1">{post.location}</p>

                                    {Array.isArray(post.images) && post.images.length > 0 && (
                                        <div className="rounded-2xl overflow-hidden mt-4 my-2">
                                            <ImageSlider images={post.images} height={250} />
                                        </div>
                                    )}

                                    <div className="flex-6 mt-4">
                                        <p
                                            className={`border-l-4 border-green-500 pl-3 py-0.5 text-sm text-gray-800 dark:text-gray-400 ${expandedDescriptions.includes(post._id) ? "" : "line-clamp-6"
                                                }`}
                                            onClick={() => toggleDescription(post._id)}
                                        >
                                            {post.description}
                                        </p>
                                    </div>
                                </LoaderLink>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
