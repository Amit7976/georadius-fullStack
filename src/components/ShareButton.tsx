import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Send } from "lucide-react";
import { formatNumber } from "../helpers/formatNumber";

interface News {
    _id: string;
    title: string;
    description: string;
    share?: number;
}

interface ShareButtonProps {
    news: News;
}

const ShareButton = ({ news }: ShareButtonProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [shareCount, setShareCount] = useState<number>(news.share || 0);


    const handleShare = async (): Promise<void> => {
        if (loading) return;

        // 🟢 Web Share API Supported?
        if (navigator.share) {
            try {
                await navigator.share({
                    title: news.title,
                    text: news.description,
                    url: `${window.location.origin}/news/${news._id}`
                });

                // 🔹 If successfully shared, update the database
                await updateShareCount();
            } catch (error) {
                console.error("Share failed:", error);
            }
        } else {
            // 🚨 Fallback: Copy Link to Clipboard (for unsupported browsers)
            try {
                await navigator.clipboard.writeText(`${window.location.origin}/news/${news._id}`);
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
                body: JSON.stringify({ postId: news._id }),
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
            <Send className="size-6" />
            <span className="font-semibold text-sm">{formatNumber(shareCount)}</span>
        </Button>
    );
};

export default ShareButton;
