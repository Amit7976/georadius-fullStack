import { Button } from "@/components/ui/button";
import interestsList from "@/public/json/interestList.json";
import { t } from "@/src/helpers/i18n";
import { News } from "@/src/helpers/types";
import NewsPost from "../NewsPost";
import Placeholder from "./Placeholder";


const filterOptions = [t("nearby"), t("district"), t("worldwide")];


export default function CategoryTabs({ selectedCategory, setSelectedCategory, currentLoginUsername, categoriesRef, loading, newsData, handleHide }: { selectedCategory: string; setSelectedCategory: (category: string) => void;currentLoginUsername:string, categoriesRef: React.RefObject<HTMLDivElement | null>; loading: boolean; newsData: News[], handleHide: (id: string) => void }) {


    return (
        <>
            {/* Categories */}
            <div ref={categoriesRef} className="w-full py-2 pb-3 bg-white dark:bg-neutral-900">
                <div className="flex gap-2 px-2 overflow-x-auto whitespace-nowrap">
                    <Button
                        variant="outline"
                        className={`rounded-lg px-8 py-2 font-bold text-xs dark:bg-neutral-800 dark:border-neutral-700 ${selectedCategory === "All" ? "bg-black text-white dark:bg-neutral-600" : ""}`}
                        onClick={() => setSelectedCategory("All")}
                    >
                        All
                    </Button>
                    {interestsList.map((category, index) => (
                        <Button
                            key={index}
                            variant="outline"
                            className={`rounded-lg px-6 py-2 font-bold text-xs dark:bg-neutral-800 dark:border-neutral-700 ${selectedCategory === category.name ? "bg-black text-white dark:bg-neutral-600" : ""}`}
                            onClick={() => setSelectedCategory(category.name)}
                        >
                            {category.name}
                        </Button>
                    ))}
                </div>
            </div>



            {/* News Posts */}
            <div>
                {loading ? (
                    <Placeholder />
                ) : (
                    newsData.length > 0 ? (
                        newsData.map((news) => (
                            <div key={news._id} className="snap-start">
                                <NewsPost news={news} currentLoginUsername={currentLoginUsername} onHide={handleHide} fullDescription={false} />
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col gap-2 py-10">
                            <p className="text-center text-gray-500">No News Available.</p>
                        </div>
                    )
                )}

            </div>

        </>
    );
}