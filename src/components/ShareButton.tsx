import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Send } from "lucide-react";
import { formatNumber } from "../helpers/formatNumber";
import { ShareButtonProps } from "../helpers/types";



const ShareButton = ({ ShareProps }: ShareButtonProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [shareCount, setShareCount] = useState<number>(ShareProps.share || 0);


    const handleShare = async (): Promise<void> => {
        if (loading) return;

        // 🟢 Web Share API Supported?
        if (navigator.share) {
            try {
                await navigator.share({
                    title: ShareProps.title,
                    text: ShareProps.description,
                    url: `${window.location.origin}/news/${ShareProps._id}`
                });

                // 🔹 If successfully shared, update the database
                await updateShareCount();
            } catch (error) {
                console.error("Share failed:", error);
            }
        } else {
            // 🚨 Fallback: Copy Link to Clipboard (for unsupported browsers)
            try {
                await navigator.clipboard.writeText(`${window.location.origin}/news/${ShareProps._id}`);
                await updateShareCount(); // ✅ Update share count after copying link
            } catch (error) {
                console.error("Clipboard error:", error);
            }
        }
    };

    // 🔹 Update share count in the database
    const updateShareCount = async (): Promise<void> => {
        setLoading(true);
        try {
            const response = await fetch("/api/post/share", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId: ShareProps._id }),
            });

            if (response.ok) {
                setShareCount((prev: number) => prev + 1);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button size="icon" variant="ghost" disabled={loading} className="flex items-center gap-1" onClick={handleShare}>
            <Send className="size-4.5 text-gray-500" />
            <span className="font-semibold text-xs text-gray-500">{formatNumber(shareCount)}</span>
        </Button>
    );
};

export default ShareButton;
