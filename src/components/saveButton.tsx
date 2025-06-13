import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { TbBookmark, TbBookmarkFilled } from "react-icons/tb";
import { SavedButtonProps } from "../helpers/types";


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


const SaveButton = ({ news }: SavedButtonProps) => {
    const [saved, setSaved] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        if (news.isSaved) setSaved(true);
    }, [news]);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const handleSave = async (): Promise<void> => {
        if (loading) return;

        const newSavedState = !saved ? 1 : 0;
        setLoading(true);

        try {
            const response = await fetch("/api/post/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId: news._id, save: newSavedState }),
            });

            if (response.ok) {
                setSaved(!saved);
            }
        } catch (error) {
            console.log("Network error! " + error);
        } finally {
            setLoading(false);
        }
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <Button className={""} size="icon" variant="ghost" disabled={loading} onClick={handleSave}>
            {saved ? <TbBookmarkFilled className="size-5 text-green-600" /> : <TbBookmark className="size-5 text-gray-500" />}
        </Button>
    );
};

export default SaveButton;
