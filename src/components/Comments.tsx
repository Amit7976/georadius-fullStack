"use client";
import React, { useEffect, useState } from "react";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { Flag, FlagIcon, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Reply {
    commentId: number;
    username: string;
    profile_picture: string;
    comment: string;
}

interface Comment {
    postId: number;
    commentId: number;
    username: string;
    profile_picture: string;
    comment: string;
    replies: Reply[];
}

interface CommentsProps {
    news_id: number;
}

const Comments: React.FC<CommentsProps> = ({ news_id }) => {
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [likedComments, setLikedComments] = useState<{ [key: number]: boolean }>({});
    const [reportComments, setReportComments] = useState<{ [key: number]: boolean }>({});
    const [likedReplies, setLikedReplies] = useState<{ [key: number]: boolean }>({});
    const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
    const [showReplyInput, setShowReplyInput] = useState<{ [key: number]: boolean }>({});


    useEffect(() => {
        fetch("/json/comments.json")
            .then((res) => res.json())
            .then((data) => {
                const filtered = data.filter((comment: Comment) => comment.postId === news_id);
                setComments(filtered);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching comments:", err);
                setLoading(false);
            });
    }, [news_id]);

    const toggleLikeComment = (commentId: number) => {
        setLikedComments((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };
    const toggleReportComment = (commentId: number) => {
        setReportComments((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    const toggleLikeReply = (replyId: number) => {
        setLikedReplies((prev) => ({
            ...prev,
            [replyId]: !prev[replyId],
        }));
    };

    const handleReplyChange = (commentId: number, text: string) => {
        setReplyText((prev) => ({
            ...prev,
            [commentId]: text,
        }));
    };

    const submitReply = (commentId: number) => {
        if (!replyText[commentId]) return;

        const newReply: Reply = {
            commentId: Date.now(),
            username: "Current User",
            profile_picture: "/images/profileIcon/default.jpg",
            comment: replyText[commentId],
        };

        setComments((prev) =>
            prev.map((comment) =>
                comment.commentId === commentId
                    ? { ...comment, replies: [...comment.replies, newReply] }
                    : comment
            )
        );

        setReplyText((prev) => ({ ...prev, [commentId]: "" }));
        setShowReplyInput((prev) => ({ ...prev, [commentId]: false }));
    };
    const addComment = () => {
        if (!newComment.trim()) return;

        const newCommentObj: Comment = {
            postId: news_id,
            commentId: Date.now(),
            username: "Current User",
            profile_picture: "/images/profileIcon/default.jpg",
            comment: newComment,
            replies: []
        };

        setComments([newCommentObj, ...comments]);
        setNewComment("");
    };

    return (
        <div className="space-y-3 mb-16 relative">
            {/* Add Comment Input */}
            <div className="flex items-center space-x-3 px-4 pb-2 m-0 w-full fixed bottom-0 bg-white left-0 z-10" style={{ boxShadow: "1px -6px 10px 1px #ececec" }}>
                <div className="mt-5 mb-3 flex items-center space-x-3 w-full">
                    <Input
                        className="px-0 font-semibold border-0 border-b-2 rounded-none focus-visible:border-green-500 focus-visible:ring-0 focus-visible:outline-0"
                        type="text"
                        value={newComment}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setNewComment(e.target.value)
                        }
                        placeholder="Write a comment..."
                    />


                    <Button
                        type="submit"
                        size={100}
                        variant={"primary"}
                        onClick={() => addComment()}
                        className="w-fit px-4 py-2 bg-green-600 active:bg-green-400 active:scale-95 duration-300 text-white text-xs font-bold rounded-lg"
                    >
                        Post
                    </Button>

                </div>
            </div>

            {loading ? (
                <p>Loading comments...</p>
            ) : (
                comments.map((comment) => (
                    <div key={comment.commentId} className="flex flex-col space-y-2 p-2 pb-5 border-b-2 border-gray-100">
                        {/* Main Comment */}
                        <div className="flex items-start space-x-3 py-2">
                            <img className="w-10 h-10 rounded-full" src={comment.profile_picture} alt="User Avatar" />
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-bold text-black">{comment.username}</p>
                                <p className="text-base text-gray-600 font-medium">{comment.comment}</p>
                                <div className="flex items-center justify-between space-x-4 mt-1">
                                    <div className="flex items-center space-x-4 mt-1">
                                        {/* Like Button */}
                                        <Button variant={"ghost"} size={50}
                                            onClick={() => toggleLikeComment(comment.commentId)}
                                            className="flex items-center space-x-1 text-gray-600">
                                            {likedComments[comment.commentId] ? (
                                                <>
                                                    <BiSolidLike className="size-5 text-green-500" />
                                                    <span className="text-green-500">Like</span>
                                                </>
                                            ) : (
                                                <>
                                                    <BiLike className="size-5" />
                                                    <span className="text-gray-500">Like</span>
                                                </>
                                            )}

                                        </Button>

                                        {/* Reply Button */}
                                        <Button variant={"ghost"} size={50}
                                            onClick={() => setShowReplyInput((prev) => ({ ...prev, [comment.commentId]: !prev[comment.commentId] }))}
                                            className="text-blue-500 font-semibold">
                                            Reply
                                        </Button>
                                    </div>

                                    {/* Report Button */}
                                    <Button variant={"ghost"} size={50}
                                        onClick={() => toggleReportComment(comment.commentId)}
                                        className="flex items-center space-x-1 text-gray-600">
                                        {reportComments[comment.commentId] ? (
                                            <Flag className="size-5 text-red-500" />
                                        ) : (
                                            <Flag className="size-5" />
                                        )}
                                    </Button>
                                </div>

                                {/* Reply Input */}
                                {showReplyInput[comment.commentId] && (
                                    <div className="mt-5 mb-3 flex items-center space-x-3">
                                        <Input
                                            className="px-0 font-semibold border-0 border-b-2 rounded-none focus-visible:border-green-500 focus-visible:ring-0 focus-visible:outline-0"
                                            type="text"
                                            value={replyText[comment.commentId] || ""}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                handleReplyChange(comment.commentId, e.target.value)
                                            }
                                            placeholder="Write a reply..."
                                        />


                                        <Button
                                            type="submit"
                                            size={100}
                                            variant={"primary"}
                                            onClick={() => submitReply(comment.commentId)}
                                            className="w-fit px-4 py-2 bg-green-600 active:bg-green-400 active:scale-95 duration-300 text-white text-xs font-bold rounded-lg"
                                        >
                                            Send
                                        </Button>

                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Replies Section */}
                        {comment.replies.length > 0 && (
                            <div className="ml-10 space-y-3">
                                {comment.replies.map((reply) => (
                                    <div key={reply.commentId} className="flex items-start space-x-3">
                                        <img className="w-8 h-8 rounded-full" src={reply.profile_picture} alt="User Avatar" />
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-bold text-black">{reply.username}</p>
                                            <p className="text-base text-gray-600 font-medium">{reply.comment}</p>
                                            <div className="flex items-center space-x-4 mt-1">
                                                {/* Like Button for Reply */}
                                                <Button variant={"ghost"} size={50}
                                                    onClick={() => toggleLikeReply(reply.commentId)}
                                                    className="flex items-center space-x-1 text-gray-600">
                                                    {likedReplies[reply.commentId] ? (
                                                        <>
                                                            <BiSolidLike className="size-5 text-green-500" />
                                                            <span className="text-green-500">Like</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <BiLike className="size-5" />
                                                            <span className="text-gray-500">Like</span>
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default Comments;
