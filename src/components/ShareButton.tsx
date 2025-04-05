import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Send } from "lucide-react";
import { formatNumber } from "../helpers/formatNumber";

const ShareButton = ({ news }: { news: any }) => {
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [shareCount, setShareCount] = useState(news.share || 0);

    const handleShare = async () => {
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
                setToastMessage("Sharing cancelled!");
            }
        } else {
            // 🚨 Fallback: Copy Link to Clipboard (for unsupported browsers)
            try {
                await navigator.clipboard.writeText(`${window.location.origin}/news/${news._id}`);
                setToastMessage("Link copied to clipboard!");
                await updateShareCount(); // ✅ Update share count after copying link
            } catch (error) {
                console.error("Clipboard error:", error);
                setToastMessage("Failed to copy link!");
            }
        }
    };

    // 🔹 Update share count in the database
    const updateShareCount = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/post/share", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId: news._id }),
            });

            if (response.ok) {
                setShareCount((prev: number) => prev + 1);
                setToastMessage("Post shared successfully!");
            } else {
                const data = await response.json();
                setToastMessage(data.error || "Something went wrong!");
            }
        } catch (error) {
            setToastMessage("Network error!");
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
