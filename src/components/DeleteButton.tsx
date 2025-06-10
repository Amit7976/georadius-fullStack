"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { toast } from "sonner"

const DeleteButton = ({ postId, onHide }: { postId: string; onHide: (id: string) => void }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/post/delete", {
                method: "DELETE",
                body: JSON.stringify({ postId }),
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                onHide(postId);
                toast.success("Post deleted successfully");
                // window.location.reload();
            } else {
                toast.error("Failed to delete post");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("An error occurred");
        }
        setLoading(false);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="flex gap-3 w-full p-3 h-12 text-lg justify-start cursor-pointer text-red-500 hover:bg-gray-100 border-2 rounded-lg bg-gray-100 dark:bg-neutral-800">
                    <Trash /> Delete
                </Button>
            </DialogTrigger>
            <DialogContent className={""}>
                <DialogHeader className={""}>
                    <DialogTitle className={""}>Are you sure?</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-gray-500 text-center">This action cannot be undone.</p>
                <div className="flex justify-center gap-4 mt-4">
                    <Button className={"w-full py-2 flex-1 cursor-pointer"} variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button className={"w-full py-2 flex-1 cursor-pointer"} variant="destructive" onClick={handleDelete} disabled={loading}>
                        {loading ? "Deleting..." : "Confirm"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteButton;