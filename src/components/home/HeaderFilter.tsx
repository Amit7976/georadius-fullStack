"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";
import { IoMapOutline } from "react-icons/io5";
import { t } from "@/src/helpers/i18n";
import { LoaderLink } from "../loaderLinks";
import { HeaderFilterProps } from "@/src/helpers/types";


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


const filterOptions = [t("nearby"), t("district"), t("worldwide")];

/////////////////////////////////////////////////////////////////////////////////////////////////////

export default function HeaderFilter({ selectedFilter, setSelectedFilter }: HeaderFilterProps) {
    const [showFixedHeader, setShowFixedHeader] = useState<boolean>(false);
    const lastScrollY = useRef<number>(0);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const screenHeight = window.innerHeight;

            /////////////////////////////////////////////////////////////////////////////////////////////////////

            // Scroll up
            if (currentScrollY > screenHeight && currentScrollY < lastScrollY.current) {
                setShowFixedHeader(true);
            }

            /////////////////////////////////////////////////////////////////////////////////////////////////////

            // Scroll down
            else if (currentScrollY > screenHeight && currentScrollY > lastScrollY.current) {
                setShowFixedHeader(false);
            }

            /////////////////////////////////////////////////////////////////////////////////////////////////////

            // At the top, hide fixed
            if (currentScrollY === 0) {
                setShowFixedHeader(false);
            }

            /////////////////////////////////////////////////////////////////////////////////////////////////////

            lastScrollY.current = currentScrollY;
        };

        /////////////////////////////////////////////////////////////////////////////////////////////////////

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <>
            <div className="sticky top-0 w-full z-50 transition-shadow">
                <div className="flex justify-between items-center p-3 pb-1.5 bg-white dark:bg-neutral-900">
                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                        <SelectTrigger className="w-fit border-0 text-2xl font-bold shadow-none px-0 scale-90">
                            <SelectValue placeholder="Select Filter" />
                        </SelectTrigger>
                        <SelectContent className={""}>
                            {filterOptions.map((option) => (
                                <SelectItem key={option} value={option} className="text-xl font-semibold py-2">
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <LoaderLink href="/pages/others/map" className="flex items-center gap-4 pr-1">
                        <IoMapOutline className="text-3xl scale-95" />
                    </LoaderLink>
                </div>
            </div>

            {showFixedHeader && (
                <div className="fixed left-0 top-0 w-full flex justify-center z-50">
                    <div className="w-full bg-white dark:bg-neutral-900 shadow-md transition-transform duration-300">
                        {/* Header */}
                        <div className="flex justify-between items-center p-3 pb-2">
                            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                                <SelectTrigger className="w-fit border-0 text-2xl font-bold shadow-none px-0 scale-90">
                                    <SelectValue placeholder="Select Filter" />
                                </SelectTrigger>
                                <SelectContent className={""}>
                                    {filterOptions.map((option) => (
                                        <SelectItem key={option} value={option} className="text-xl font-semibold py-2">
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <LoaderLink href="/pages/others/map" className="flex items-center gap-4 pr-1">
                                <IoMapOutline className="text-3xl scale-95" />
                            </LoaderLink>
                        </div>

                        {/* Fixed Categories */}
                        {/* <div className="w-full pb-1.5 dark:pb-2 bg-white dark:bg-neutral-900">
                            <div className="flex gap-2 px-2 overflow-x-auto whitespace-nowrap">
                                <Button
                                    variant="outline"
                                    className={`rounded-lg px-6 py-2 font-bold text-xs ${selectedCategory === "All" ? "bg-black text-white" : ""}`}
                                    onClick={() => setSelectedCategory("All")}
                                >
                                    All
                                </Button>
                                {interestsList.map((category, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        className={`rounded-lg px-6 py-2 font-bold text-xs ${selectedCategory === category.name ? "bg-black text-white" : ""}`}
                                        onClick={() => setSelectedCategory(category.name)}
                                    >
                                        {category.name}
                                    </Button>
                                ))}
                            </div>
                        </div> */}
                    </div>
                </div>
            )}
        </>
    );
}