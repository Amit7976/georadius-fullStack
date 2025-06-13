'use client';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { t } from "../helpers/i18n";
import { CommentType } from "../helpers/types";

import { LoaderLink } from "./loaderLinks";

type CommentProps = {
    news_id: string;
    currentLoginUsername: string;
    comments: CommentType[];
    setComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
    hasMore: boolean;
    setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
    totalComments: number;
};

const Comments = ({
    news_id,
    currentLoginUsername,
    comments,
    setComments,
    hasMore,
    setHasMore,
    totalComments,
}: CommentProps) => {
    const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
    const [input, setInput] = useState('');
    const [replyingTo, setReplyingTo] = useState<{ parentId: string; replyingToUsername: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fetchedCount = useRef(comments.length);

    const rootComments = comments.filter(c => !c.parentCommentId);
    const getReplies = (id: string) => comments.filter(c => c.parentCommentId === id);

    const fetchMoreComments = async () => {
        setIsLoading(true);
        try {
            const alreadyFetchedIds = comments.map(comment => comment._id);
            const res = await fetch('/api/post/getComments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId: news_id, excludeIds: alreadyFetchedIds }),
            });
            const data = await res.json();
            if (res.ok && data?.comments?.length > 0) {
                setComments(prev => [...prev, ...data.comments]);
                fetchedCount.current += data.comments.length;
                if (fetchedCount.current >= totalComments) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error('Error fetching more comments:', err);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (totalComments > 10) {
            fetchMoreComments();
        }
    }, [])

    const handleSubmit = async () => {
        if (!input.trim()) return;

        try {
            const res = await fetch('/api/post/comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postId: news_id,
                    comment: input.trim(),
                    parentCommentId: replyingTo?.parentId,
                    replyingToUsername: replyingTo?.replyingToUsername,
                }),
            });

            const data = await res.json();
            if (res.ok && data?.comment) {
                const savedComment: CommentType = { ...data.comment, reports: false };
                setComments(prev => [...prev, savedComment]);
                setInput('');
                setReplyingTo(null);
            }
        } catch (err) {
            console.error("Error submitting comment:", err);
        }
    };

    const handleDelete = async () => {
        if (!deleteCommentId) return;

        try {
            const res = await fetch('/api/post/commentDelete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ commentId: deleteCommentId }),
            });

            if (res.ok) {
                const idsToDelete = new Set<string>();
                const collectReplies = (id: string) => {
                    idsToDelete.add(id);
                    comments.forEach(c => c.parentCommentId === id && collectReplies(c._id));
                };
                collectReplies(deleteCommentId);
                setComments(prev => prev.filter(c => !idsToDelete.has(c._id)));
            }
        } catch (err) {
            console.error("Error deleting comment:", err);
        }
        setDeleteCommentId(null);
    };

    const handleReport = async (id: string) => {
        const isReported = comments.find(c => c._id === id)?.reports;
        try {
            const res = await fetch('/api/post/commentReport', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ commentId: id, report: isReported ? 0 : 1 }),
            });

            const data = await res.json();
            if (res.ok && typeof data.reported === 'boolean') {
                setComments(prev => prev.map(c => c._id === id ? { ...c, reports: data.reported } : c));
            }
        } catch (err) {
            console.error('Error reporting comment:', err);
        }
    };

    const [longPressedCommentId, setLongPressedCommentId] = useState<string | null>(null);
    let pressTimer: NodeJS.Timeout;

    const handleLongPressStart = (id: string) => {
        pressTimer = setTimeout(() => setLongPressedCommentId(id), 600);
    };

    const handleLongPressEnd = () => {
        clearTimeout(pressTimer);
    };



    const CommentItem = ({ comment, level = 0 }: { comment: CommentType; level?: number }) => {
        const replies = getReplies(comment._id);
        return (
            <div className={`${level ? 'pl-10' : ''} border-gray-200 mt-1 mb-5`}>
                <div className="flex items-start gap-3">
                    {comment.profileImage && (
                        <LoaderLink href={`/${comment.username}`}>
                            <Image
                                width={100}
                                height={100}
                                src={comment.profileImage}
                                alt={comment.username}
                                className={`${level ? 'w-5 h-5' : 'w-8 h-8'} mt-0.5 rounded-full bg-gray-100 dark:bg-neutral-800`}
                            />
                        </LoaderLink>
                    )}
                    <div className="flex-1 grid grid-cols-12 gap-4 relative">
                        <div className="col-span-11">
                            <div onMouseDown={() => handleLongPressStart(comment._id)}
                                onMouseUp={handleLongPressEnd}
                                onMouseLeave={handleLongPressEnd}
                                onTouchStart={() => handleLongPressStart(comment._id)}
                                onTouchEnd={handleLongPressEnd}>
                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 w-fit">
                                    {comment.username}
                                </p>
                                <p className="text-gray-800 dark:text-gray-200 text-xs mt-0.5">
                                    {comment.replyingToUsername && (
                                        <Link href={"/" + comment.replyingToUsername} className="text-gray-400 dark:text-gray-500 font-medium pr-1">
                                            @{comment.replyingToUsername}
                                        </Link>
                                    )}
                                    {comment.comment}
                                </p>
                            </div>
                            <Button variant="ghost" className="text-xs scale-95 p-0 m-0 h-auto text-gray-500" onClick={() => setReplyingTo({ parentId: comment.parentCommentId || comment._id, replyingToUsername: comment.username })}>
                                {t("reply")}
                            </Button>
                        </div>
                        {longPressedCommentId === comment._id && (
                            <div className={`flex mt-1 text-gray-600 absolute w-1/2 bg-gray-400 dark:bg-neutral-800 h-full p-1 rounded-xl`}>
                                <div className="fixed top-0 left-0 w-full h-full bg-transparent" onClick={() => setLongPressedCommentId("")}></div>
                                {currentLoginUsername === comment.username ? (
                                    <Button variant="ghost" className="h-full w-full bg-red-500 text-white py-3 px-8 z-50" onClick={() => setDeleteCommentId(comment._id)}>
                                        {t("delete")}
                                    </Button>
                                ) : (
                                    <Button variant="ghost" onClick={() => handleReport(comment._id)} className={"h-full w-full bg-red-500 text-white py-3 px-8 z-50"}>
                                        {comment.reports ? t("reported") : t("report")}
                                    </Button>
                                )}
                            </div>
                        )}
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
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 shadow-md p-4 border-t z-50">
                    {replyingTo && (
                        <div className="text-sm text-gray-500 mb-1">
                            {t("replyingTo")} @{replyingTo.replyingToUsername}
                            <Button variant="ghost" onClick={() => setReplyingTo(null)} className="ml-2 text-red-500 text-xs">
                                {t("cancel")}
                            </Button>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <textarea className="flex-1 p-2 resize-none outline-none" placeholder={t("writeComment")} value={input} rows={1} onChange={e => setInput(e.target.value)} />
                        <Button variant="ghost" className="px-4 bg-green-500 text-xs text-white" onClick={handleSubmit}>
                            {replyingTo ? t("reply") : t("comments")}
                        </Button>
                    </div>
                </div>
                {rootComments.length === 0 && (
                    <div className="text-center text-gray-500 mt-4">
                        {t("noCommentsYet")}
                    </div>
                )}
                <div className="select-none">
                    {rootComments.map(comment => (
                        <CommentItem key={comment._id} comment={comment} />
                    ))}

                    {hasMore && (
                        <div className="text-center mt-4">
                            <Button onClick={fetchMoreComments} disabled={isLoading} className="bg-gray-200 dark:bg-neutral-800 text-gray-700 dark:text-gray-300">
                                {isLoading ? 'Loading...' : 'Load More Comments'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {deleteCommentId && (
                <Dialog open={!!deleteCommentId} onOpenChange={() => setDeleteCommentId(null)}>
                    <DialogContent className="p-10">
                        <DialogHeader className={""}>
                            <DialogTitle className="text-xl">{t("deleteComment")}</DialogTitle>
                            <DialogDescription className="mt-3 text-base">
                                {t("deleteCommentConfirm")} <br /> {t("deleteCommentWarning")}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex items-center justify-center gap-4 mt-4 flex-row">
                            <Button className="flex-1 w-full h-14 py-2 bg-transparent border-2 text-black dark:text-white" onClick={() => setDeleteCommentId(null)}>{t("cancel")}</Button>
                            <Button className="flex-1 w-full h-14 py-2 bg-red-500 text-white" onClick={handleDelete}>{t("delete")}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default Comments;
