'use client';

import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


interface CommentType {
    _id: string;
    comment: string;
    username: string;
    parentCommentId?: string;
    replyingToUsername?: string;
    profileImage?: string;
    updatedAt: string;
    likes: boolean;
    reports: boolean;
}

interface CurrentUser {
    username: string;
    profileImage?: string;
}

const Comments = ({ news_id }: { news_id: string }) => {
    const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const [comments, setComments] = useState<CommentType[]>([]);
    const [input, setInput] = useState('');
    const [replyingTo, setReplyingTo] = useState<{
        parentId: string;
        replyingToUsername: string;
    } | null>(null);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch('/api/post/getComments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ postId: news_id }),
                });

                const data = await res.json();

                if (data?.comments) {
                    console.log('====================================');
                    console.log('Fetched comments:', data.comments);
                    console.log('Current user:', data.currentUser);
                    console.log('====================================');
                    setComments(data.comments);
                    setCurrentUser(data.currentUser);
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [news_id]);

    const rootComments = comments.filter(c => !c.parentCommentId);
    const getReplies = (id: string) => comments.filter(c => c.parentCommentId === id);

    const handleSubmit = async () => {
        if (!input.trim()) return;

        try {
            const body = {
                postId: news_id,
                comment: input.trim(),
                parentCommentId: replyingTo?.parentId,
                replyingToUsername: replyingTo?.replyingToUsername,
            };

            const res = await fetch('/api/post/comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            console.log('====================================');
            console.log('res:', res);
            console.log('Comment submitted:', data);
            console.log('====================================');

            if (res.ok && data?.comment) {
                const savedComment: CommentType = {
                    ...data.comment,
                    likes: false,
                    reports: false,
                };
                console.log('====================================');
                console.log('Comment saved:', savedComment);
                console.log('====================================');
                setComments(prev => [...prev, savedComment]);
                setInput('');
                setReplyingTo(null);
            }

        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };


    const handleDelete = (id: string) => {
        setDeleteCommentId(id);
        setDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteCommentId) return;
        try {
            const res = await fetch('/api/post/commentDelete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ commentId: deleteCommentId }),
            });

            if (res.ok) {
                // remove root + all its replies
                const idsToDelete = new Set<string>();
                const collectReplies = (id: string) => {
                    idsToDelete.add(id);
                    comments.forEach(comment => {
                        if (comment.parentCommentId === id) {
                            collectReplies(comment._id);
                        }
                    });
                };
                collectReplies(deleteCommentId);

                setComments(prev => prev.filter(c => !idsToDelete.has(c._id)));
            }
        } catch (err) {
            console.error("Error deleting comment:", err);
        } finally {
            setDialogOpen(false);
            setDeleteCommentId(null);
        }
    };




    const handleLike = async (id: string) => {
        const isLiked = comments.find(c => c._id === id)?.likes;

        try {
            const res = await fetch('/api/post/commentLike', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    commentId: id,
                    like: isLiked ? 0 : 1,  // Toggle like value
                }),
            });

            const data = await res.json();
            console.log('====================================');
            console.log(data);
            console.log('====================================');
            if (res.ok && typeof data.liked === 'boolean') {
                setComments(prev =>
                    prev.map(c =>
                        c._id === id ? { ...c, likes: data.liked } : c
                    )
                );
            }
        } catch (err) {
            console.error('Error liking comment:', err);
        }
    };

    const handleReport = async (id: string) => {
        const isReported = comments.find(c => c._id === id)?.reports;

        try {
            const res = await fetch('/api/post/commentReport', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    commentId: id,
                    report: isReported ? 0 : 1,  // Toggle report value
                }),
            });

            const data = await res.json();
            if (res.ok && typeof data.reported === 'boolean') {
                setComments(prev =>
                    prev.map(c =>
                        c._id === id ? { ...c, reports: data.reported } : c
                    )
                );
            }
        } catch (err) {
            console.error('Error reporting comment:', err);
        }
    };

    const CommentItem = ({ comment, level = 0 }: { comment: CommentType; level?: number }) => {
        const replies = getReplies(comment._id);

        return (
            <div className={`ml-${level * 4} border-gray-200 pl-4 mt-3`}>
                <div className="flex items-start gap-3">
                    {comment.profileImage && (
                        <img
                            src={comment.profileImage}
                            alt={comment.username}
                            className="w-8 h-8 rounded-full"
                        />
                    )}
                    <div className="flex-1">
                        <p className="text-sm font-semibold">{comment.username}</p>
                        {comment.replyingToUsername && (
                            <p className="text-xs text-gray-500">
                                Replying to @{comment.replyingToUsername}
                            </p>
                        )}
                        <p className="text-gray-800 mt-1">{comment.comment}</p>

                        <div className="flex gap-3 mt-2 text-xs text-gray-600">
                            <Button variant={"ghost"} size={100} className=""
                                onClick={() => {
                                    setReplyingTo({
                                        parentId: comment.parentCommentId || comment._id,
                                        replyingToUsername: comment.username,
                                    });
                                }}
                            >
                                Reply
                            </Button>
                            <Button variant={"ghost"} size={100}
                                onClick={() => handleLike(comment._id)}
                                className={comment.likes ? "text-green-600 font-semibold" : ""}
                            >
                                {comment.likes ? 'Liked' : 'Like'}
                            </Button>
                            {currentUser?.username === comment.username ? (
                                <Button variant={"ghost"} size={100} className="" onClick={() => handleDelete(comment._id)}>Delete</Button>
                            ) : (
                                <Button variant={"ghost"} size={100}
                                    onClick={() => handleReport(comment._id)}
                                    className={comment.reports ? "text-red-600 font-semibold" : ""}
                                >
                                    {comment.reports ? 'Reported' : 'Report'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>


                {replies.map(reply => (
                    <CommentItem key={reply._id} comment={reply} level={level + 1} />
                ))}
            </div>
        );
    };

    return (
        <>
            <div className="w-full mx-auto mb-28">

                <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 border-t z-50">
                    {replyingTo && (
                        <div className="text-sm text-gray-500 mb-1">
                            Replying to @{replyingTo.replyingToUsername}
                            <Button variant={"ghost"} size={100}
                                onClick={() => setReplyingTo(null)}
                                className="ml-2 text-red-500 text-xs"
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <textarea
                            className="flex-1 border rounded p-2 resize-none"
                            placeholder="Write a comment..."
                            value={input}
                            rows={1}
                            onChange={e => setInput(e.target.value)}
                        />
                        <Button variant={"ghost"} size={100} className="px-4 bg-green-500 text-xs text-white" onClick={handleSubmit}>
                            {replyingTo ? 'Reply' : 'Comment'}
                        </Button>
                    </div>
                </div>

                {rootComments.length === 0 && (
                    <div className="text-center text-gray-500 mt-4">
                        No comments yet. Be the first to comment!
                    </div>
                )}
                {rootComments.map(comment => (
                    <CommentItem key={comment._id} comment={comment} />
                ))}
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className={""}>
                    <DialogHeader className={""}>
                        <DialogTitle className={""}>Delete Comment?</DialogTitle>
                        <DialogDescription className={"mt-3"}>
                            Are you sure you want to delete this comment? <br /> This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className={"flex items-center justify-center gap-4 mt-4 flex-row"}>
                        <Button size={100} className="flex-1 w-full py-2" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button size={100} className="flex-1 w-full py-2" variant="destructive" onClick={confirmDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>

    );
};

export default Comments;
