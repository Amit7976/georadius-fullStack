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

        const shareUrl = `${window.location.origin}/news/${ShareProps._id}`;
        const shareTitle = ShareProps.title;
        const shareText = `📰 ${ShareProps.title}\n\n${ShareProps.description}`;
        const imageUrl = ShareProps.images?.[0];

        // 🧠 Try Web Share API v2 with image (if browser supports it)
        if (navigator.canShare && navigator.canShare({ files: [] }) && imageUrl) {
            try {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const file = new File([blob], "share-image.jpg", { type: blob.type });

                await navigator.share({
                    title: shareTitle,
                    text: shareText,
                    url: shareUrl,
                    files: [file],
                });

                await updateShareCount();
                return;
            } catch (error) {
                console.warn("Web Share with image failed:", error);
            }
        }

        // 🟡 Fallback: Web Share API without image
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: shareText,
                    url: shareUrl,
                });

                await updateShareCount();
                return;
            } catch (error) {
                console.warn("Simple share failed:", error);
            }
        }

        // 🔴 Final fallback: Copy to clipboard
        try {
            await navigator.clipboard.writeText(shareUrl);
            alert("🔗 Link copied to clipboard!");
            await updateShareCount();
        } catch (error) {
            console.error("Clipboard fallback failed:", error);
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
