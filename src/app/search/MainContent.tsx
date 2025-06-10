"use client";
import interestsList from "@/public/json/interestList.json";
import Link from "next/link";
import "swiper/css";
import SearchInput from "@/src/components/SearchInput";
import { LoaderLink } from "@/src/components/loaderLinks";
import { t } from "@/src/helpers/i18n";



export default function MainContent() {

    return (
        <div className="min-h-screen pb-10">
            <div className="pt-4 px-2">
                <SearchInput queryParam={""} />
            </div>
           
            {/* 🔥 Trending Topics Section */}
            <div className="pt-6">
                <h2 className="px-5 font-semibold text-xl">{t("allCategories")}</h2>
                <div className="flex flex-wrap items-center px-5 py-8 gap-y-5 gap-x-3 select-none">
                    {interestsList.map((interest, index) => (
                        <LoaderLink
                            key={index}
                            href={`/category/${interest.name}`}
                            className="relative overflow-hidden rounded-lg flex items-center gap-2 p-4 pr-5 border duration-300 active:scale-95">
                            <p className="text-xl ">{interest.icon}</p>
                            <p className="text-lg font-bold">{interest.name}</p>
                        </LoaderLink>
                    ))}
                </div>
            </div>

        </div>
    );
}