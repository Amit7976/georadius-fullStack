"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EyeOff } from "lucide-react";
import { t } from "../helpers/i18n";

const HideButton = ({ postId, onHide }: { postId: number; onHide: (id: number) => void }) => {
    const [open, setOpen] = useState(false);

    const handleHidePost = () => {
        const hiddenPosts = JSON.parse(localStorage.getItem("hideNews") || "[]");

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
                <Button variant="ghost" className="flex gap-3 w-full p-3 text-lg justify-start cursor-pointer rounded-md text-gray-700 hover:bg-gray-100">
                    <EyeOff /> {t("hide")}
                </Button>
            </DialogTrigger>

            <DialogContent className={""}>
                <DialogHeader className={""}>
                    <DialogTitle className="text-lg font-semibold text-center">{t("hideNews")}</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-gray-500 text-center">{t("hideNewsDesc")}</p>
                <div className="flex justify-center gap-4 mt-4">
                    <Button className={"w-full py-2 flex-1 cursor-pointer"} variant="outline" onClick={() => setOpen(false)}>{t("cancel")}</Button>
                    <Button className={"w-full py-2 flex-1 cursor-pointer"} variant="destructive" onClick={handleHidePost}>{t("confirm")}</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default HideButton;
