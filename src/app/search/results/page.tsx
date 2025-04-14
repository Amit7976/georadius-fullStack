"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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

export default function SearchResultsPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [radius, setRadius] = useState("10");
    const [searchType, setSearchType] = useState("post");

    const [latLng, setLatLng] = useState<{
        lat: number | null;
        lng: number | null;
        latMin?: number;
        latMax?: number;
        lngMin?: number;
        lngMax?: number;
    }>({ lat: null, lng: null });

    const [results, setResults] = useState<any[]>([]);
    const [expandedDescriptions, setExpandedDescriptions] = useState<string[]>([]);

    useEffect(() => {
        setResults([]);
        setRadius("10");
    }, [searchType]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    const latOffset = parseInt(radius) / 111;
                    const lngOffset = parseInt(radius) / (111 * Math.cos((lat * Math.PI) / 180));

                    setLatLng({
                        lat,
                        lng,
                        latMin: lat - latOffset,
                        latMax: lat + latOffset,
                        lngMin: lng - lngOffset,
                        lngMax: lng + lngOffset,
                    });
                },
                (error) => {
                    console.warn("Geolocation error:", error.message);
                }
            );
        }
    }, [radius]);

    useEffect(() => {
        const fetchResults = async () => {
            const { latMin, latMax, lngMin, lngMax } = latLng;

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

            console.log("Search Results:", data);
            setResults(searchType === "user" ? data.users : data.posts);
        };

        if (query && latLng.latMin && latLng.lngMin) {
            fetchResults();
        }
    }, [query, radius, latLng, searchType]);

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
                    Search Results for "<span className="text-green-600 font-medium">{query}</span>"
                </h2>

                <div className="flex mb-2 gap-2 justify-between items-center">
                    <h3 className="text-base font-medium text-gray-600 mb-1">Filter Results</h3>
                    <div className="flex gap-2 items-center">
                        <div>
                            <Select onValueChange={setSearchType} defaultValue="post">
                                <SelectTrigger className="w-fit flex items-center shadow-none border-0">
                                    <SelectValue placeholder="post" />
                                </SelectTrigger>
                                <SelectContent className="static">
                                    <SelectItem className="static" value="post">Posts</SelectItem>
                                    <SelectItem className="static" value="user">Users</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {searchType === "post" && (
                            <div>
                                <Select onValueChange={setRadius} defaultValue="10">
                                    <SelectTrigger className="w-fit flex items-center shadow-none border-0">
                                        <SelectValue placeholder="10 km" />
                                    </SelectTrigger>
                                    <SelectContent className="static">
                                        <SelectItem className="static" value="5">5 km</SelectItem>
                                        <SelectItem className="static" value="10">10 km</SelectItem>
                                        <SelectItem className="static" value="25">25 km</SelectItem>
                                        <SelectItem className="static" value="50">50 km</SelectItem>
                                        <SelectItem className="static" value="500">500 km</SelectItem>
                                        <SelectItem className="static" value="50000">5000 km</SelectItem>
                                        <SelectItem className="static" value="5000000">World Wide</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {searchType === "user" && results.length > 0 && (
                <div className="mt-4 mb-8">
                    <h3 className="text-lg font-medium mb-2 text-gray-500">Users</h3>
                    {results.map((user: any) => (
                        <Link href={"/" + user.username} key={user._id} className="flex items-center py-2 mt-2">
                            <div className="w-12 flex-1">
                                <img
                                    src={user.profileImage}
                                    alt="Profile Pic"
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            </div>
                            <div className="flex-5 mt-1">
                                <p className="text-gray-500 text-sm font-medium">@{user.username}</p>
                                <h3 className="text-xl font-bold">{user.fullname}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {searchType === "post" && results.length > 0 && (
                <div className="mt-2">
                    <h3 className="text-lg font-medium mb-2 text-gray-500">Posts</h3>
                    <div className="divider-y-2 border-gray-200 mb-4">
                        <div className="flex flex-col gap-6">
                            {results.map((post: any) => (
                                <Link href={"/post/" + post._id} key={post._id} className="py-2 space-y-2">
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
                                            className={`border-l-4 border-green-500 pl-3 py-0.5 text-sm text-gray-800 ${expandedDescriptions.includes(post._id) ? "" : "line-clamp-6"
                                                }`}
                                            onClick={() => toggleDescription(post._id)}
                                        >
                                            {post.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
