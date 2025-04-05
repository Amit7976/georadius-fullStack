"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EyeOff } from "lucide-react";

const HideButton = ({ postId, onHide }: { postId: number; onHide: (id: number) => void }) => {
    const [open, setOpen] = useState(false);

    const handleHidePost = () => {
        let hiddenPosts = JSON.parse(localStorage.getItem("hideNews") || "[]");

        if (!hiddenPosts.includes(postId)) {
            hiddenPosts.push(postId);
            localStorage.setItem("hideNews", JSON.stringify(hiddenPosts));
        }

        onHide(postId); // Notify parent component
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size={100} variant="ghost" className="flex gap-3 w-full p-3 text-lg justify-start cursor-pointer rounded-md text-gray-700 hover:bg-gray-100">
                    <EyeOff /> Hide
                </Button>
            </DialogTrigger>

            <DialogContent className={""}>
                <DialogHeader className={""}>
                    <DialogTitle className="text-lg font-semibold text-center">Hide this News?</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-gray-500 text-center">You won’t see this News anymore.</p>
                <div className="flex justify-center gap-4 mt-4">
                    <Button className={"w-full py-2 flex-1 cursor-pointer"} size={100} variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button className={"w-full py-2 flex-1 cursor-pointer"} size={100} variant="destructive" onClick={handleHidePost}>Confirm</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default HideButton;
