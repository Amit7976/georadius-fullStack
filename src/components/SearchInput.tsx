"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoSearch, IoClose } from "react-icons/io5";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
    queryParam?: string;
}

export default function SearchInput({ queryParam = "" }: SearchInputProps) {
    const [query, setQuery] = useState(queryParam);
    const [suggestions, setSuggestions] = useState<{ name: string }[]>([]);
    const [hasTyped, setHasTyped] = useState(false);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null); // 👉 Wrapper for click outside

    // 🔁 Debounced fetchSuggestions when user types
    useEffect(() => {
        if (!query || !hasTyped) {
            setSuggestions([]);
            return;
        }

        const timeout = setTimeout(() => {
            fetchSuggestions(query);
        }, 500);

        return () => clearTimeout(timeout);
    }, [query, hasTyped]);

    // 🧠 Click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setSuggestions([]);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchSuggestions = async (q: string) => {
        try {
            const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(q)}`);
            const data = await res.json();
            setSuggestions(data);
        } catch (err) {
            console.error("Suggestion fetch error:", err);
        }
    };

    const handleSearch = (q?: string) => {
        const searchTerm = (q || query)?.trim();
        if (!searchTerm) return;
        router.push(`/search/results?q=${encodeURIComponent(searchTerm)}`);
        setSuggestions([]); // 💨 Clear suggestions after search
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
        }
    };

    return (
        <div ref={wrapperRef} className="pb-3 relative">
            <div className="border-2 w-full rounded-full px-5 flex items-center bg-white">
                <IoSearch className="text-gray-500 text-2xl" />
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Search for users, posts, location..."
                    value={query}
                    onChange={(e:any) => {
                        setQuery(e.target.value);
                        setHasTyped(true);
                    }}
                    onKeyDown={handleKeyDown}
                    className="h-14 font-semibold border-0 ring-0 outline-none focus-visible:ring-0 focus-visible:outline-0 focus-visible:border-0"
                />
                {query && (
                    <IoClose
                        className="text-gray-500 text-2xl cursor-pointer"
                        onClick={() => {
                            setQuery("");
                            setSuggestions([]);
                            setHasTyped(false);
                            inputRef.current?.focus();
                        }}
                    />
                )}
            </div>

            {suggestions.length > 0 && (
                <div className="absolute w-full bg-white shadow-lg rounded-lg mt-2 p-2 max-h-60 overflow-y-scroll z-10">
                    {suggestions.map((item, idx) => (
                        <div
                            key={idx}
                            className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                            onClick={() => handleSearch(item.name)}
                        >
                            {item.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
