import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Send } from "lucide-react";
import { formatNumber } from "../helpers/formatNumber";
import { ShareButtonProps } from "../helpers/types";



const ShareButton = ({ shareProps }: ShareButtonProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [shareCount, setShareCount] = useState<number>(shareProps.share || 0);


    const handleShare = async (): Promise<void> => {
        if (loading) return;

        const shareUrl = `${window.location.origin}/news/${shareProps._id}`;
        const shareTitle = shareProps.title;
        const shareText = `\n📰 ${shareProps.title}\n\n${shareProps.description}\n\n`;

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
                body: JSON.stringify({ postId: shareProps._id }),
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