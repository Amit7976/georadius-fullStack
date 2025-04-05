import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { TbBookmark, TbBookmarkFilled } from "react-icons/tb";

const SaveButton = ({ news }: { news: any }) => {
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (news.isSaved) setSaved(true);
    }, [news]);

    const handleSave = async () => {
        if (loading) return;

        const newSavedState = !saved ? 1 : 0;
        setLoading(true);

        try {
            const response = await fetch("/api/post/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId: news._id, save: newSavedState }),
            });

            const data = await response.json();

            if (response.ok) {
                setSaved(!saved);
            }
        } catch (error) {
            console.log("Network error!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button className={""} size="icon" variant="ghost" disabled={loading} onClick={handleSave}>
            {saved ? <TbBookmarkFilled className="size-5 text-yellow-500" /> : <TbBookmark className="size-6" />}
        </Button>
    );
};

export default SaveButton;
