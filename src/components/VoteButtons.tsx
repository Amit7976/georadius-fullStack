import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { formatNumber } from "../helpers/formatNumber";


interface News {
    _id: string;
    upvoteCount: number;
    downvoteCount: number;
    isUserUpvote: boolean;
    isUserDownvote: boolean;
}

const VoteButtons = ({ news }: { news: News }) => {
    const [vote, setVote] = useState<number>(0); // 0 = No vote, 1 = Upvote, 2 = Downvote
    const [loading, setLoading] = useState<boolean>(false);

    // 🔹 Store vote counts in state
    const [upvoteCount, setUpvoteCount] = useState<number>(news.upvoteCount);
    const [downvoteCount, setDownvoteCount] = useState<number>(news.downvoteCount);

    // 🔹 Set initial vote state based on user interaction
    useEffect(() => {
        if (news.isUserUpvote) setVote(1);
        if (news.isUserDownvote) setVote(2);
    }, [news]);

    const handleVote = async (type: number) => {
        if (loading) return;

        const newVote = vote === type ? 0 : type; // Toggle vote (if already selected, set to 0)
        setLoading(true);

        try {
            const response = await fetch("/api/post/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId: news._id, vote: newVote }),
            });

            if (response.ok) {
                // ✅ Update vote state
                setVote(newVote);

                // ✅ Update counts locally
                setUpvoteCount((prev: number) => prev + (newVote === 1 ? 1 : vote === 1 ? -1 : 0));
                setDownvoteCount((prev: number) => prev + (newVote === 2 ? 1 : vote === 2 ? -1 : 0));
            }
        } catch (error) {
            console.log("Network error! " + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-2">
            {/* Upvote Button */}
            <Button size="icon" variant="ghost" disabled={loading} className="flex items-center gap-1 hover:bg-transparent hover:text-gray-300" onClick={() => handleVote(1)}>
                {vote === 1 ? <BiSolidLike className="size-5 fill-green-500" /> : <BiLike className="size-5 fill-gray-500" />}
                <span className="font-semibold text-sm text-gray-500">{formatNumber(upvoteCount)}</span>
            </Button>

            {/* Downvote Button */}
            <Button size="icon" variant="ghost" disabled={loading} className="flex items-center gap-1 hover:bg-transparent hover:text-gray-300" onClick={() => handleVote(2)}>
                {vote === 2 ? <BiSolidDislike className="size-5 fill-red-500" /> : <BiDislike className="size-5 fill-gray-500" />}
                <span className="font-semibold text-sm text-gray-500">{formatNumber(downvoteCount)}</span>
            </Button>
        </div>
    );
};

export default VoteButtons;
