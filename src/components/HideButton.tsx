"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EyeOff } from "lucide-react";
import { t } from "../helpers/i18n";

const HideButton = ({ postId, onHide }: { postId: string; onHide: (id: string) => void }) => {
    const [open, setOpen] = useState(false);

    const handleHidePost = () => {
        const hiddenPosts = JSON.parse(localStorage.getItem("hideNews") || "[]");

        if (!hiddenPosts.includes(postId)) {
            hiddenPosts.push(postId);
            localStorage.setItem("hideNews", JSON.stringify(hiddenPosts));
        }

        onHide(postId);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="flex gap-3 w-full p-3 h-12 text-lg justify-start cursor-pointer text-gray-700 hover:bg-gray-100 dark:text-gray-300 border-2 rounded-lg bg-gray-100 dark:bg-neutral-800">
                    <EyeOff /> {t("hide")}
                </Button>
            </DialogTrigger>

            <DialogContent className={"p-10"}>
                <DialogHeader className={""}>
                    <DialogTitle className="text-xl font-semibold text-center">{t("hideNews")}</DialogTitle>
                </DialogHeader>
                <p className="text-base text-gray-500 text-center">{t("hideNewsDesc")}</p>
                <div className="flex justify-center gap-4 mt-4">
                    <Button className={"flex-1 w-full h-14 py-2 bg-transparent border-2 text-black dark:text-white"} onClick={() => setOpen(false)}>{t("cancel")}</Button>
                    <Button className={"flex-1 w-full h-14 py-2 bg-red-500 text-white"} onClick={handleHidePost}>{t("confirm")}</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default HideButton;
