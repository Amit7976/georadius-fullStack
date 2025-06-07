import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react"; // or any other icon
import { Button } from "@/components/ui/button";

const CategoryDisplay = ({ categories }: { categories: string[] }) => {
    const [showAll, setShowAll] = useState(false);

    if (!categories || categories.length === 0) return null;

    return (
        <div className="relative mb-2">
            {categories.length === 1 ? (
                <p className="text-sm text-white font-semibold mb-2 rounded-full border-2 w-fit px-4 py-1.5 text-shadow-black">
                    {categories[0]}
                </p>
            ) : (
                <div className="flex items-center gap-1 pointer-events-auto">
                    {showAll ? null : (
                        <>
                            <p className="text-sm text-white font-bold rounded-full border-2 w-fit px-4 py-1.5 text-shadow-black">
                                {categories[0]}
                            </p>
                            <Button variant="primary" className={""} onClick={() => setShowAll(true)}>
                                <ChevronRight className="text-gray-400 size-6" />
                            </Button>
                        </>
                    )
                    }
                </div>
            )}

            <AnimatePresence>
                {showAll && (
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="relative top-0 shadow-lg flex flex-wrap gap-2 z-50 pointer-events-auto"
                    >
                        {categories.map((category, index) => (
                            <p
                                key={index}
                                className="text-sm text-white font-semibold rounded-full border-2 w-fit px-4 py-1.5 text-shadow-black"
                            >
                                {category}
                            </p>
                        ))}
                        <Button variant="primary" className={""} onClick={() => setShowAll(false)}>
                            <ChevronLeft className="text-gray-400 size-6" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CategoryDisplay;
